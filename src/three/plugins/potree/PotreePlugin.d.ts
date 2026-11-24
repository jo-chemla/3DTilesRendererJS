import { BufferGeometry, Matrix4, Vector3 } from 'three';
import { PointCloudEffectsPlugin } from '../pointcloud/PointCloudEffectsPlugin.js';

export interface PointCloudOctreeLoader {

	fetchOptions: RequestInit;
	fetchData( url: string, options?: RequestInit ): Promise<Response>;
	load( url: string ): Promise<void>;
	metadata: { spacing: number, boundingBox: { min: number[], max: number[] } } | null;
	hierarchy: Map<string, { childMask: number }> | null;
	loadNodeData( key: string, options?: RequestInit ): Promise<ArrayBuffer>;
	parsePointData( buffer: ArrayBuffer, key: string, min: number[], max: number[] ): { geometry: BufferGeometry, center: Vector3 };

}

type RootTransform = Matrix4 | number[] | null;

export class PotreePlugin extends PointCloudEffectsPlugin {

	url: string | null;
	pointScale: number;
	useRecommendedSettings: boolean;
	loader: PointCloudOctreeLoader | null;
	rootTransform: RootTransform | ( ( metadata: object ) => RootTransform );

	constructor( options?: {
		url?: string | null,
		pointScale?: number,
		useRecommendedSettings?: boolean,
		loader?: PointCloudOctreeLoader | null,
		rootTransform?: RootTransform | ( ( metadata: object ) => RootTransform ),
		pointShape?: 'square' | 'round' | 'sphere',
		minPointSize?: number,
		maxPointSize?: number,
		edlStrength?: number,
		edlRadius?: number,
		debugColorMode?: 'none' | 'node' | 'depth' | 'tile',
	} );

}
