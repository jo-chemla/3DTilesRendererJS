import { BufferAttribute, BufferGeometry, Matrix4, Vector3 } from 'three';
import { TilesRenderer } from '../../src/three/renderer/tiles/TilesRenderer.js';
import { PotreePlugin } from '../../src/three/plugins/potree/PotreePlugin.js';

// A loader of the documented interface, serving an in-memory octree: a 16 unit cube whose
// root has two children, r0 and r7, and where r7's children are not known yet.
class FakeLoader {

	constructor() {

		this.fetchOptions = {};
		this.metadata = null;
		this.hierarchy = null;
		this.loadedUrl = null;

	}

	fetchData() {

		throw new Error( 'not used' );

	}

	async load( url ) {

		this.loadedUrl = url;
		this.metadata = { spacing: 2, boundingBox: { min: [ 0, 0, 0 ], max: [ 16, 16, 16 ] } };
		this.hierarchy = new Map( [
			[ 'r', { childMask: 0b10000001 } ],
			[ 'r0', { childMask: 0 } ],
		] );

	}

	async loadNodeData() {

		return new ArrayBuffer( 0 );

	}

	parsePointData( buffer, key, min, max ) {

		const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new BufferAttribute( new Float32Array( 3 ), 3 ) );
		const center = new Vector3( ...min ).add( new Vector3( ...max ) ).multiplyScalar( 0.5 );
		return { geometry, center };

	}

}

describe( 'PotreePlugin', () => {

	let tiles, loader;
	beforeEach( () => {

		// the plugin and the renderer resolve urls against the page
		const location = { href: 'https://example.com/viewer/' };
		vi.stubGlobal( 'location', location );
		vi.stubGlobal( 'window', { location } );
		tiles = new TilesRenderer( 'https://example.com/cloud/metadata.json' );
		loader = new FakeLoader();

	} );

	afterEach( () => {

		tiles.dispose();
		vi.unstubAllGlobals();

	} );

	it( 'should use the loader it is given and route its requests through the plugins.', async () => {

		const plugin = new PotreePlugin( { loader } );
		tiles.registerPlugin( plugin );

		expect( plugin.loader ).toBe( loader );
		expect( typeof loader.fetchData ).toBe( 'function' );
		expect( loader.fetchData ).not.toBe( FakeLoader.prototype.fetchData );

		const tileset = await plugin.loadRootTileset();
		expect( loader.loadedUrl ).toBe( 'https://example.com/cloud/metadata.json' );
		expect( tileset.root.geometricError ).toBe( 2 );
		expect( tileset.root.transform ).toBeUndefined();
		expect( tileset.root.boundingVolume.box ).toEqual( [ 8, 8, 8, 8, 0, 0, 0, 8, 0, 0, 0, 8 ] );

	} );

	it( 'should place the root with a transform and scale the error and point size with it.', async () => {

		const matrix = new Matrix4().makeScale( 0.5, 0.5, 0.5 ).setPosition( 100, 200, 300 );
		const rootTransform = vi.fn( () => matrix );
		const plugin = new PotreePlugin( { loader, rootTransform } );
		tiles.registerPlugin( plugin );

		const tileset = await plugin.loadRootTileset();
		expect( rootTransform ).toHaveBeenCalledWith( loader.metadata );
		expect( tileset.root.transform ).toEqual( matrix.elements );
		expect( tileset.root.geometricError ).toBe( 1 );

		const root = tileset.root;
		const points = plugin.parseToMesh( new ArrayBuffer( 0 ), root, 'potree', 'https://example.com/cloud/r.potree' );
		expect( points.material.size ).toBeCloseTo( 2 * 0.5 * 1.7 );

	} );

	it( 'should take a transform given as an array.', async () => {

		const elements = new Matrix4().makeTranslation( 1, 2, 3 ).elements;
		const plugin = new PotreePlugin( { loader, rootTransform: elements } );
		tiles.registerPlugin( plugin );

		const tileset = await plugin.loadRootTileset();
		expect( tileset.root.transform ).toEqual( elements );
		expect( tileset.root.geometricError ).toBe( 2 );

	} );

	it( 'should expand the children the hierarchy holds and leave unknown nodes as leaves.', async () => {

		const plugin = new PotreePlugin( { loader } );
		tiles.registerPlugin( plugin );

		const { root } = await plugin.loadRootTileset();
		plugin.parseToMesh( new ArrayBuffer( 0 ), root, 'potree', 'https://example.com/cloud/r.potree' );
		expect( root.children.map( c => c.content.uri ) ).toEqual( [ 'r0.potree', 'r7.potree' ] );
		expect( root.children[ 0 ].geometricError ).toBe( 1 );

		// "r7" is a child of the root but its own hierarchy entry is not loaded yet
		const r7 = root.children[ 1 ];
		expect( () => plugin.parseToMesh( new ArrayBuffer( 0 ), r7, 'potree', 'https://example.com/cloud/r7.potree' ) ).not.toThrow();
		expect( r7.children ).toHaveLength( 0 );

	} );

} );
