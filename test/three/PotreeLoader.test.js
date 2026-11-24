import { PotreeLoader } from '../../src/three/plugins/potree/PotreeLoader.js';

const BASE = 'https://example.com/cloud/';

// A v2 hierarchy entry: type(uint8) + childMask(uint8) + numPoints(uint32) + byteOffset(int64) + byteSize(int64)
function entry( type, childMask, numPoints, byteOffset, byteSize ) {

	const bytes = new Uint8Array( 22 );
	const view = new DataView( bytes.buffer );
	view.setUint8( 0, type );
	view.setUint8( 1, childMask );
	view.setUint32( 2, numPoints, true );
	view.setBigInt64( 6, BigInt( byteOffset ), true );
	view.setBigInt64( 14, BigInt( byteSize ), true );
	return bytes;

}

function concat( ...parts ) {

	const out = new Uint8Array( parts.reduce( ( n, p ) => n + p.length, 0 ) );
	let offset = 0;
	parts.forEach( p => {

		out.set( p, offset );
		offset += p.length;

	} );
	return out;

}

// A cloud whose root chunk holds "r" and a proxy for "r0", whose own chunk holds "r0" and "r00".
// octree.bin holds 10 bytes for "r", 20 for "r0" and 30 for "r00".
function createDataset() {

	const rootChunk = concat(
		entry( 0, 0b00000001, 1, 0, 10 ),
		entry( 2, 0, 0, 44, 44 ),
	);
	const subChunk = concat(
		entry( 0, 0b00000001, 1, 10, 20 ),
		entry( 1, 0, 1, 30, 30 ),
	);

	const octree = new Uint8Array( 60 );
	octree.fill( 1, 0, 10 );
	octree.fill( 2, 10, 30 );
	octree.fill( 3, 30, 60 );

	return {
		'metadata.json': new TextEncoder().encode( JSON.stringify( {
			encoding: 'DEFAULT',
			spacing: 1,
			scale: [ 1, 1, 1 ],
			offset: [ 0, 0, 0 ],
			boundingBox: { min: [ 0, 0, 0 ], max: [ 1, 1, 1 ] },
			attributes: [],
			hierarchy: { firstChunkSize: rootChunk.length },
		} ) ),
		'hierarchy.bin': concat( rootChunk, subChunk ),
		'octree.bin': octree,
	};

}

// A fetch serving the dataset. "ranges: false" ignores the Range header, and "short" sends one
// byte less than a range asks for.
function createServer( files, { ranges = true, short = false } = {} ) {

	const log = [];
	const fetchData = async ( url, options = {} ) => {

		const name = url.slice( BASE.length );
		const range = options.headers && options.headers.Range;
		log.push( range ? `${ name } ${ range }` : name );

		const bytes = files[ name ];
		if ( ! range || ! ranges ) {

			return new Response( bytes.slice(), { status: 200 } );

		}

		const [ , start, end ] = /^bytes=(\d+)-(\d+)$/.exec( range ).map( Number );
		return new Response( bytes.slice( start, end + ( short ? 0 : 1 ) ), { status: 206 } );

	};

	return { fetchData, log };

}

describe( 'PotreeLoader', () => {

	it( 'should read the v2 hierarchy chunk by chunk with range requests.', async () => {

		const server = createServer( createDataset() );
		const loader = new PotreeLoader();
		loader.fetchData = server.fetchData;

		await loader.load( BASE + 'metadata.json' );
		expect( server.log ).toEqual( [ 'metadata.json', 'hierarchy.bin bytes=0-43' ] );
		expect( [ ...loader.hierarchy.keys() ] ).toEqual( [ 'r' ] );

		const root = new Uint8Array( await loader.loadNodeData( 'r' ) );
		expect( root ).toEqual( new Uint8Array( 10 ).fill( 1 ) );

		// the first node of a sub-chunk loads the chunk, then its points
		const r0 = new Uint8Array( await loader.loadNodeData( 'r0' ) );
		expect( r0 ).toEqual( new Uint8Array( 20 ).fill( 2 ) );
		expect( server.log.slice( - 2 ) ).toEqual( [ 'hierarchy.bin bytes=44-87', 'octree.bin bytes=10-29' ] );
		expect( [ ...loader.hierarchy.keys() ] ).toEqual( [ 'r', 'r0', 'r00' ] );

		// and the chunk is not requested again
		await loader.loadNodeData( 'r00' );
		expect( server.log.filter( l => l.startsWith( 'hierarchy.bin' ) ) ).toHaveLength( 2 );

	} );

	it( 'should request a shared hierarchy chunk once for concurrent nodes.', async () => {

		const server = createServer( createDataset() );
		const loader = new PotreeLoader();
		loader.fetchData = server.fetchData;

		await loader.load( BASE + 'metadata.json' );
		await Promise.all( [ loader.loadNodeData( 'r0' ), loader.loadNodeData( 'r0' ) ] );
		expect( server.log.filter( l => l.startsWith( 'hierarchy.bin' ) ) ).toHaveLength( 2 );

	} );

	it( 'should parse the whole hierarchy when the server ignores the Range header.', async () => {

		const server = createServer( createDataset(), { ranges: false } );
		const loader = new PotreeLoader();
		loader.fetchData = server.fetchData;

		await loader.load( BASE + 'metadata.json' );
		expect( [ ...loader.hierarchy.keys() ] ).toEqual( [ 'r', 'r0', 'r00' ] );

	} );

	it( 'should refuse point data from a server that ignores the Range header.', async () => {

		const server = createServer( createDataset(), { ranges: false } );
		const loader = new PotreeLoader();
		loader.fetchData = server.fetchData;

		await loader.load( BASE + 'metadata.json' );
		await expect( loader.loadNodeData( 'r' ) ).rejects.toThrow( /ignored the Range request/ );

	} );

	it( 'should refuse a range response of the wrong length.', async () => {

		const server = createServer( createDataset(), { short: true } );
		const loader = new PotreeLoader();
		loader.fetchData = server.fetchData;

		await expect( loader.load( BASE + 'metadata.json' ) ).rejects.toThrow( /Expected 44 bytes/ );

	} );

} );
