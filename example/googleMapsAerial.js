import { GeoUtils, WGS84_ELLIPSOID, GoogleTilesRenderer, TilesRenderer } from '../src/index.js';
import {
	Scene,
	WebGLRenderer,
	PerspectiveCamera,
	Raycaster,
	MathUtils, MeshStandardMaterial, MeshBasicMaterial, Color, HalfFloatType, Vector2, IntType, MeshMatcapMaterial, TextureLoader, MeshPhongMaterial, MeshDepthMaterial, MeshNormalMaterial, MeshPhysicalMaterial, MeshToonMaterial, BasicDepthPacking, RGBADepthPacking, AmbientLight, DirectionalLight, PointLight, RectAreaLight, SpotLight, DirectionalLightHelper, PointLightHelper, SpotLightHelper, Vector3, Matrix3, SphereGeometry, Mesh

} from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

import { BloomEffect, EffectComposer, EffectPass, RenderPass, SMAAEffect, FXAAEffect, BlurPass, BrightnessContrastEffect, NormalPass, BoxBlurPass, DepthPass, GaussianBlurPass, MaskPass, BlendFunction, DepthOfFieldEffect, DepthEffect, EdgeDetectionMode, SMAAPreset, BokehEffect, ChromaticAberrationEffect,	HueSaturationEffect, LensDistortionEffect, NoiseEffect, SSAOEffect, TiltShiftEffect, ToneMappingEffect, VignetteEffect, KernelSize, ShaderPass, Effect, PixelationEffect, CopyPass, DepthPickingPass } from 'postprocessing';

import { OutlineEffect } from 'postprocessing';

import { SSGIEffect, TRAAEffect, MotionBlurEffect, VelocityDepthNormalPass, HBAOEffect } from 'realism-effects';
// import { SSGIEffect, TRAAEffect, MotionBlurEffect, VelocityDepthNormalPass, HBAOEffect, TAAPass, TemporalReprojectPass, SparkleEffect, SharpnessEffect, GTAOEffect, GTAOPass, GradualBackgroundEffect, GBufferPass } from 'https://raw.githubusercontent.com/0beqz/realism-effects/main/src/index.js';
// https://cdn.jsdelivr.net/gh/0beqz/realism-effects/src/index.js
// import( 'https://raw.githubusercontent.com/0beqz/realism-effects/main/src/index.js' ).then(
// 	( canvas ) => {

// 		console.log( canvas );
// 		// { SSGIEffect, TRAAEffect, MotionBlurEffect, VelocityDepthNormalPass, HBAOEffect, TAAPass, TemporalReprojectPass, SparkleEffect, SharpnessEffect, GTAOEffect, GTAOPass, GradualBackgroundEffect, GBufferPass } = canvas;

// 	}

// );


// import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';



import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from './src/lib/OrbitControls.js';

let camera, controls, scene, renderer, tiles;

let screenSpaceNormalEffect;

// Repo: https://github.com/pmndrs/postprocessing/tree/main?tab=readme-ov-file
// Doc: https://pmndrs.github.io/postprocessing/public/docs/class/src/effects/SSAOEffect.js~SSAOEffect.html
// Demo: https://pmndrs.github.io/postprocessing/public/demo/#antialiasing

// Other fiber resources
// https://docs.pmnd.rs/react-postprocessing/effects/bloom
// https://pmndrs.github.io/postprocessing/public/demo/#blur

// Other from official threejs PostProcessing here
// https://threejs.org/docs/#examples/en/postprocessing/EffectComposer

// import { SAOPass } from 'three/addons/postprocessing/SAOPass';
// import { SAOPass } from 'postprocessing';
// import { ShaderPass } from 'postprocessing/ShaderPass';
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader';
// import { ShaderPass } from 'three/examples/jsm/shaders/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { SobelOperatorShader } from 'three/examples/jsm/shaders/SobelOperatorShader';
import { UnrealBloomPass } from 'postprocessing';
import { LuminosityHighPassShader } from 'three/examples/jsm/shaders/LuminosityHighPassShader';



// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
// import * as OutputPass from 'three/examples/jsm/postprocessing/OutputPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';


// import { SobelOperatorShader } from 'three/addons/shaders/SobelOperatorShader';
// import { BleachBypassShader } from 'three/addons/jsm/shaders/BleachBypassShader';
// import { ColorifyShader } from 'three/addons/jsm/shaders/ColorifyShader';
// import { HorizontalBlurShader } from 'three/addons/jsm/shaders/HorizontalBlurShader';
// import { VerticalBlurShader } from 'three/addons/jsm/shaders/VerticalBlurShader';
// import { SepiaShader } from 'three/addons/jsm/shaders/SepiaShader';
// import { VignetteShader } from 'three/addons/jsm/shaders/VignetteShader';
// import { GammaCorrectionShader } from 'three/addons/jsm/shaders/GammaCorrectionShader';



// import { SobelOperatorShader } from 'three/addons/shaders/SobelOperatorShader.js';

// import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
// import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
// import { MaskPass, ClearMaskPass } from 'three/addons/postprocessing/MaskPass.js';
// import { TexturePass } from 'three/addons/postprocessing/TexturePass.js';

// import { BleachBypassShader } from 'three/addons/shaders/BleachBypassShader.js';
// import { ColorifyShader } from 'three/addons/shaders/ColorifyShader.js';
// import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
// import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
// import { SepiaShader } from 'three/addons/shaders/SepiaShader.js';
// import { VignetteShader } from 'three/addons/shaders/VignetteShader.js';

const raycaster = new Raycaster();
raycaster.firstHitOnly = true;

const apiKey = localStorage.getItem( 'googleApiKey' ) ?? 'put-your-api-key-here';

const params = {

	'apiKey': apiKey,
	'reload': reinstantiateTiles,

};

const postprocessingEnabled = true;

let composer, ssgiEffect, traaEffect, hbaoEffect, effectPass, n8aopass;


init();

console.log( 'init finished' );
animate();
console.log( 'animate called after init and returned' );
let outlineEffect, maskEffect;

function reinstantiateTiles() {

	localStorage.setItem( 'googleApiKey', params.apiKey );

	if ( tiles ) {

		scene.remove( tiles.group );
		tiles.dispose();
		tiles = null;

	}

	tiles = new GoogleTilesRenderer( params.apiKey );

	// Try other materials for tile
	// let mat;
	const texture_url = 'https://threejs.org/examples/textures/matcaps/matcap-porcelain-white.jpg';
	const matcap_tex = new TextureLoader().load( texture_url );
	// const mat = new MeshMatcapMaterial( { matcap: matcap_tex } );

	// const mat = new MeshDepthMaterial( { depthPacking: BasicDepthPacking } );
	// const mat = new MeshPhongMaterial( { color: '0x049ef4', shininess: 0.5, specular: '0x949494', } );
	// const mat = new MeshNormalMaterial( );
	// const mat = new MeshToonMaterial( { color: '0x049ef4' } );
	// const mat = new MeshStandardMaterial( );
	// const mat = new MeshPhysicalMaterial(  );
	// const mat = new MeshBasicMaterial( { color: '0xffffff' } );

	let test = true;
	tiles.onLoadModel = function ( scene, tile ) {

	  // const yup_to_zup = new THREE.Matrix4().set( 1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1 );
	  // const test_mat = yup_to_zup
	  //   .clone()
	  //   .multiply(offset_datasetCrs_mat)
	  //   .multiply(yup_to_zup.clone().transpose());

		//   const texture_url = 'https://www.filterforge.com/filters/12719-v2.jpg';
	  scene.traverse( ( c ) => {

			if ( c.isMesh ) {

				if ( outlineEffect?.selection )
					outlineEffect.selection.add( c );

				const g = c.geometry;
				// Important for NormalPass to display correct colors
				g.computeVertexNormals();

				// if ( mat )
				// 	c.material = mat;

				// g.attributes.position.applyMatrix4(
				//   test_mat
				// );

				if ( test ) {

					test = false;
					console.log( c.material );

				}

			}

		} );

	};
	// const url = 'https://demo3d.metromap.com.au/M0342_Sydney_75mm_Mar_2023/Scene/Cesium_Sydney.json';
	// tiles = new TilesRenderer( url );

	// tiles.setLatLonToYUp( 35.3606 * MathUtils.DEG2RAD, 138.7274 * MathUtils.DEG2RAD ); // Mt Fuji
	// tiles.setLatLonToYUp( 48.8584 * MathUtils.DEG2RAD, 2.2945 * MathUtils.DEG2RAD ); // Eiffel Tower
	// tiles.setLatLonToYUp( 41.8902 * MathUtils.DEG2RAD, 12.4922 * MathUtils.DEG2RAD ); // Colosseum
	// tiles.setLatLonToYUp( 43.8803 * MathUtils.DEG2RAD, - 103.4538 * MathUtils.DEG2RAD ); // Mt Rushmore
	// tiles.setLatLonToYUp( 36.2679 * MathUtils.DEG2RAD, - 112.3535 * MathUtils.DEG2RAD ); // Grand Canyon
	// tiles.setLatLonToYUp( - 22.951890 * MathUtils.DEG2RAD, - 43.210439 * MathUtils.DEG2RAD ); // Christ the Redeemer
	// tiles.setLatLonToYUp( 35.6586 * MathUtils.DEG2RAD, 139.7454 * MathUtils.DEG2RAD ); // Tokyo Tower

	tiles.setLatLonToYUp( - 33.8679346124879 * MathUtils.DEG2RAD, 151.20748985701806 * MathUtils.DEG2RAD ); // SYDNEY


	// Note the DRACO compression files need to be supplied via an explicit source.
	// We use unpkg here but in practice should be provided by the application.
	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath( 'https://unpkg.com/three@0.153.0/examples/jsm/libs/draco/gltf/' );

	const loader = new GLTFLoader( tiles.manager );
	loader.setDRACOLoader( dracoLoader );

	tiles.manager.addHandler( /\.gltf$/, loader );
	scene.add( tiles.group );

	const ambientLight = new AmbientLight( 0x333 ); // soft white light

	const directionalLight = new DirectionalLight( 0xFFFFFF );
	// directionalLight.position = new Vector3( 0, 20, 20 );
	// directionalLight.target = new Vector3( 0, 0, 0 );

	const spotLight = new SpotLight( 0xffffff );
	spotLight.position.set( 100, 1000, 100 );
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 500;
	spotLight.shadow.camera.far = 4000;
	spotLight.shadow.camera.fov = 30;


	const rectLight = new RectAreaLight( 0xffffff, 1, 10, 10 ); // intensity,  width, height );
	rectLight.position.set( 5, 5, 0 );
	rectLight.lookAt( 0, 0, 0 );
	rectLight.add( new RectAreaLightHelper( rectLight ) );

	const pointLight = new PointLight( 0xff0000, 1, 100 );
	pointLight.position.set( 50, 50, 50 );

	// Add lights to scene
	scene.add( ambientLight );
	scene.add( directionalLight );
	// scene.add( new DirectionalLightHelper( directionalLight, 5 ) );
	scene.add( spotLight );
	// scene.add( new SpotLightHelper( spotLight ) );
	// scene.add( rectLight );
	scene.add( pointLight );
	// scene.add( new PointLightHelper( pointLight, 10 ) );

	tiles.setResolutionFromRenderer( camera, renderer );
	tiles.setCamera( camera );




}



import { MaskEffect } from './MaskEffect.js';
import { SobelEffect } from './SobelEffect.js';
import { ScreenSpaceNormalEffect } from './ScreenSpaceNormalEffect.js';
import { MatcapEffect } from './MatcapEffect.js';


// import { Uniform } from 'three';

// const fragmentShader = `uniform sampler2D maskTexture;

// void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

// 	float mask = texture2D(maskTexture, uv).g;
// 	outputColor = vec4(inputColor.rgb, inputColor.a * mask);

// }`;

// class MaskEffect extends Effect {

// 	constructor( maskTexture ) {

// 		console.log( 'constructor of MaskEffect' );

// 		super( 'MaskEffect', fragmentShader, {

// 			uniforms: new Map( [
// 				[ 'maskTexture', new Uniform( maskTexture ) ]
// 			] )

// 		} );
// 		console.log( 'constructor of MaskEffect finished' );

// 	}

// }

// // https://github.com/mrdoob/three.js/blob/master/examples/jsm/shaders/SobelOperatorShader.js
// export class SobelEffect extends Effect {

// 	constructor() {

// 		super(
// 			'SobelEffect',
// 			/* glsl */ `
// 				void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
// 					vec2 texel = vec2( 1.0 / resolution.x, 1.0 / resolution.y );

// 					// kernel definition (in glsl matrices are filled in column-major order)

// 					const mat3 Gx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 ); // x direction kernel
// 					const mat3 Gy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 ); // y direction kernel

// 					// fetch the 3x3 neighbourhood of a fragment

// 					// first column

// 					float tx0y0 = texture2D( inputBuffer, uv + texel * vec2( -1, -1 ) ).r;
// 					float tx0y1 = texture2D( inputBuffer, uv + texel * vec2( -1,  0 ) ).r;
// 					float tx0y2 = texture2D( inputBuffer, uv + texel * vec2( -1,  1 ) ).r;

// 					// second column

// 					float tx1y0 = texture2D( inputBuffer, uv + texel * vec2(  0, -1 ) ).r;
// 					float tx1y1 = texture2D( inputBuffer, uv + texel * vec2(  0,  0 ) ).r;
// 					float tx1y2 = texture2D( inputBuffer, uv + texel * vec2(  0,  1 ) ).r;

// 					// third column

// 					float tx2y0 = texture2D( inputBuffer, uv + texel * vec2(  1, -1 ) ).r;
// 					float tx2y1 = texture2D( inputBuffer, uv + texel * vec2(  1,  0 ) ).r;
// 					float tx2y2 = texture2D( inputBuffer, uv + texel * vec2(  1,  1 ) ).r;

// 					// gradient value in x direction

// 					float valueGx = Gx[0][0] * tx0y0 + Gx[1][0] * tx1y0 + Gx[2][0] * tx2y0 +
// 						Gx[0][1] * tx0y1 + Gx[1][1] * tx1y1 + Gx[2][1] * tx2y1 +
// 						Gx[0][2] * tx0y2 + Gx[1][2] * tx1y2 + Gx[2][2] * tx2y2;

// 					// gradient value in y direction

// 					float valueGy = Gy[0][0] * tx0y0 + Gy[1][0] * tx1y0 + Gy[2][0] * tx2y0 +
// 						Gy[0][1] * tx0y1 + Gy[1][1] * tx1y1 + Gy[2][1] * tx2y1 +
// 						Gy[0][2] * tx0y2 + Gy[1][2] * tx1y2 + Gy[2][2] * tx2y2;

// 					// magnitute of the total gradient

// 					float G = sqrt( ( valueGx * valueGx ) + ( valueGy * valueGy ) );

// 					outputColor = vec4( vec3( G ), 1 );
// 				}
// 			`,
// 		);

// 	}

// }

import { ShaderMaterial } from 'three';

// import vertexShader from './vertexShader.glsl';
// import fragmentShader from './fragmentShader.glsl';


function init() {

	scene = new Scene();

	// primary camera view
	const rendererCanvas = document.querySelector( '.webgl' );
	if ( postprocessingEnabled ) {

		// renderer = new WebGLRenderer( {
		// 	canvas: rendererCanvas,
		// } );
		renderer = new WebGLRenderer( {
			canvas: rendererCanvas,
			powerPreference: 'high-performance',
			premultipliedAlpha: false,
			stencil: false,
			antialias: false,
			alpha: false,
			preserveDrawingBuffer: true
		} );
		renderer.autoClear = false;
		// somewhere else
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.autoUpdate = false;
		renderer.shadowMap.needsUpdate = true;
		// const dpr = window.devicePixelRatio;
		// renderer.setPixelRatio( Math.min( 2, dpr ) );
		console.log( 'renderer defined with postprocessingEnabled' );

	} else {

		// Renderer
		if ( rendererCanvas ) {

			rendererCanvas.style.width = 0;
			rendererCanvas.style.height = 0;

		}
		renderer = new WebGLRenderer( { antialias: true } );

	}

	renderer.setClearColor( 0x151c1f );

	document.body.appendChild( renderer.domElement );
	renderer.domElement.tabIndex = 1;

	camera = new PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 100, 1600000 );

	// camera.near = 0.1;
	camera.position.set( 1e3, 1e3, 1e3 ).multiplyScalar( 0.5 );

	// controls
	controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 300;
	controls.maxDistance = 1e4 * 2;
	controls.minPolarAngle = 0;
	controls.maxPolarAngle = 3 * Math.PI / 8;
	controls.enableDamping = true;
	controls.autoRotate = true; // true false
	controls.autoRotateSpeed = 0.5;
	// controls.enablePan = false;

	reinstantiateTiles();

	if ( postprocessingEnabled ) {


		composer = new EffectComposer( renderer, { frameBufferType: HalfFloatType, stencilBuffer: true, multisampling: Math.min( 4, renderer.capabilities.maxSamples ) } );
		console.log( 'composer created' );

		const renderPass = new RenderPass( scene, camera );
		composer.addPass( renderPass );


		// ------------------------------------------------
		// BELOW ARE PMNDRS POSTPROCESSING FILTERS
		// COMPATIBLE WITH PMNDRS EFFECTCOMPOSER IMPORTED
		// ALL BELOW EFFECTS HAVE BEEN TESTED AND ARE WORKING
		// ------------------------------------------------

		// Repo: https://github.com/pmndrs/postprocessing/tree/main?tab=readme-ov-file
		// Doc: https://pmndrs.github.io/postprocessing/public/docs/class/src/effects/SSAOEffect.js~SSAOEffect.html
		// Demo: https://pmndrs.github.io/postprocessing/public/demo/#antialiasing


		// const brightnessContrastEffect = new BrightnessContrastEffect( { brightness: 0.5, contrast: 0.5 } );
		// const brightnessContrastPass = new EffectPass( camera, brightnessContrastEffect, );
		// composer.addPass( brightnessContrastPass );

		// const hueSaturationEffect = new HueSaturationEffect( { hue: 0., saturation: - 0.5 } );
		// const hueSaturationPass = new EffectPass( camera, hueSaturationEffect, );
		// composer.addPass( hueSaturationPass );

		// const noiseEffect = new NoiseEffect( { premultiply: true, blendFunction: BlendFunction.SCREEN } );
		// const noisePass = new EffectPass( camera, noiseEffect );
		// composer.addPass( noisePass );

		// const chromaticAberrationEffect = new ChromaticAberrationEffect( { modulationOffset: 0.3 } );
		// const ChromaticAberrationPass = new EffectPass( camera, chromaticAberrationEffect, );
		// composer.addPass( ChromaticAberrationPass );

		// const toneMappingEffect = new ToneMappingEffect( { maxLuminance: 4.0, whitePoint: 4.0, middleGrey: 0.6, minLuminance: 0.01, averageLuminance: 1.0,
		// } );
		// const toneMappingPass = new EffectPass( camera, toneMappingEffect );
		// composer.addPass( toneMappingPass );

		// Bloom
		// composer.addPass( new EffectPass( camera, new BloomEffect() ) );

		// Pixelation
		// const pixelationEffect = new PixelationEffect( 6, scene, camera );
		// const pixelationPass = new EffectPass( camera, pixelationEffect );
		// composer.addPass( pixelationPass );

		// Blur Passes
		// const boxBlurPass = new BoxBlurPass( { kernelSize: 5 }, );
		// composer.addPass( boxBlurPass );
		// const gaussianBlurPass = new GaussianBlurPass( { kernelSize: 35 }, );
		// composer.addPass( gaussianBlurPass );

		// antialiasing smaa fxaa (fxaa better than smaa ?)
		// const smaaEffect = new SMAAEffect( { preset: SMAAPreset.ULTRA, edgeDetectionMode: EdgeDetectionMode.COLOR } );
  		// smaaEffect.edgeDetectionMaterial.setEdgeDetectionThreshold(0.05);
		// const smaaPass = new EffectPass( camera, smaaEffect, );
		// composer.addPass( smaaPass );
		const fxaaEffect = new FXAAEffect( );
		const fxaaPass = new EffectPass( camera, fxaaEffect, );
		// composer.addPass( fxaaPass );

		// dof depthOfField
		// const depthOfFieldEffect = new DepthOfFieldEffect( camera, { worldFocusDistance: 1000, worldFocusRange: 1000, bokehScale: 1. } );
		// const depthOfFieldPass = new EffectPass( camera, depthOfFieldEffect, );
		// composer.addPass( depthOfFieldPass );

		// Depth for fog
		// const depthEffect = new DepthEffect( { inverted: false } ); // blendFunction: BlendFunction.SRC
		// const depthEffectPass = new EffectPass( camera, depthEffect, );
		// composer.addPass( depthEffectPass );

		// Depth for following computation
		// const depthPass = new DepthPass( scene, camera, { }, );
		// composer.addPass( depthPass );

		// Lens Distortion
		// const lensDistortionEffect = new LensDistortionEffect( { distortion: new Vector2( 0.2, 0.2 ),
		// 	principalPoint: new Vector2( 0.01, 0.01 ),
		// 	focalLength: new Vector2( 0.7, 0.7 	),
		// } );
		// const lensDistortionPass = new EffectPass( camera, lensDistortionEffect );
		// composer.addPass( lensDistortionPass );


		const postprocessing_test = 5;

		if ( postprocessing_test == 1 ) {

			// Normal Pass working if geometry.computeVertexNormals is done on mesh load
			const normalPass = new NormalPass( scene, camera );
			composer.addPass( normalPass );

		} else if ( postprocessing_test == 2 ) {

			const tex = renderPass.texture;
			screenSpaceNormalEffect = new ScreenSpaceNormalEffect( tex, new Vector3( 0.5, 0.9, 0 ), camera );
			const screenSpaceNormalPass = new EffectPass( camera, screenSpaceNormalEffect );
			composer.addPass( screenSpaceNormalPass );

			const texture_url = 'https://threejs.org/examples/textures/matcaps/matcap-porcelain-white.jpg';
			const matcapTexture = new TextureLoader().load( texture_url );
			const matcapEffect = new MatcapEffect( matcapTexture, camera );
			const matcapPass = new EffectPass( camera, matcapEffect );
			composer.addPass( matcapPass );

		} else if ( postprocessing_test == 3 ) {

			const tiltShiftEffect = new TiltShiftEffect( { offset: 0.0, rotation: 0.0, focusArea: 0.4, feather: 0.3, bias: 0.06, kernelSize: KernelSize.MEDIUM } );
			const tiltShiftPass = new EffectPass( camera, tiltShiftEffect );
			composer.addPass( tiltShiftPass );

			const vignetteEffect = new VignetteEffect( { offset: 0.5, darkness: 0.5 } );
			const vignettePass = new EffectPass( camera, vignetteEffect );
			composer.addPass( vignettePass );

		} else if ( postprocessing_test == 4 ) {

			console.log( 'before sobelEffect creation' );
			const sobelEffect = new SobelEffect();
			console.log( 'sobelEffect created' );
			const sobelPass = new EffectPass( camera, sobelEffect );
			console.log( 'sobelPass created' );
			composer.addPass( sobelPass );
			console.log( 'sobelPass added' );

		} else if ( postprocessing_test == 5 ) {

			// DepthPicking TEST
			const cursor = new Mesh(
				new SphereGeometry( 10, 32, 32 ),
				new MeshBasicMaterial( {
					color: 0xa9a9a9,
					transparent: true,
					depthWrite: false,
					opacity: 0.5,
					depthTest: false
				} )
			);
			scene.add( cursor );

			// Post Processing

			const depthPickingPass = new DepthPickingPass();
			composer.addPass( depthPickingPass );

			const tex = renderPass.texture;
			screenSpaceNormalEffect = new ScreenSpaceNormalEffect( tex, new Vector3( 0.5, 0.9, 0 ), camera );
			const screenSpaceNormalPass = new EffectPass( camera, screenSpaceNormalEffect );
			composer.addPass( screenSpaceNormalPass );

			// composer.addPass( new CopyPass( renderPass.texture ) );
			// composer.addPass( renderPass );

			const ndc = new Vector3();
			const container = renderer.domElement;

			async function pickDepth( event ) {

				const clientRect = container.getBoundingClientRect();
				const clientX = event.clientX - clientRect.left;
				const clientY = event.clientY - clientRect.top;
				ndc.x = ( clientX / container.clientWidth ) * 2.0 - 1.0;
				ndc.y = - ( clientY / container.clientHeight ) * 2.0 + 1.0;

				ndc.z = await depthPickingPass.readDepth( ndc );
				ndc.z = ndc.z * 2.0 - 1.0;

				// Pick relevant pixel reading portions from https://github.com/pmndrs/postprocessing/blob/main/src/passes/DepthPickingPass.js
				// pixelBuffer = (depthPacking === RGBADepthPacking) ? new Uint8Array(4) : new Float32Array(4);
				// x = Math.round(texelPosition.x * renderTarget.width);
				// y = Math.round(texelPosition.y * renderTarget.height);
				// renderer.readRenderTargetPixels(renderTarget, x, y, 1, 1, pixelBuffer);
				const pixelBuffer = new Uint8Array( 4 );
				// const renderTarget = screenSpaceNormalPass.texture;
				const renderTarget = renderPass.texture;
				renderer.readRenderTargetPixels( renderTarget, clientX, clientY, 1, 1, pixelBuffer );
				cursor.material.color = new Color( pixelBuffer[ 0 ], pixelBuffer[ 1 ], pixelBuffer[ 2 ] );
				console.log( pixelBuffer );

				// Convert from NDC to world position.
				cursor.position.copy( ndc.unproject( camera ) );

			}

			container.addEventListener( 'pointermove', ( e ) => void pickDepth( e ), { passive: true } );

		}




		// antialiasing smaa fxaa
		// const smaaEffect = new SMAAEffect( { preset: SMAAPreset.ULTRA, edgeDetectionMode: EdgeDetectionMode.COLOR } );
  		// smaaEffect.edgeDetectionMaterial.setEdgeDetectionThreshold( 0.05 );
		// const smaaPass = new EffectPass( camera, smaaEffect, );
		// composer.addPass( smaaPass );
		// const fxaaEffect = new FXAAEffect( { } );
		// const fxaaPass = new EffectPass( camera, fxaaEffect, );
		// composer.addPass( fxaaPass );


		const normalPass = new NormalPass( scene, camera );
		const ssaoEffect = new SSAOEffect( camera, normalPass.texture, {
			// blendFunction: BlendFunction.SRC,
			// distanceScaling: true,
			// depthAwareUpsampling: true,
			samples: 9,
			rings: 7,
			// distanceThreshold: 0.2,	// Render up to a distance of ~20 world units
			// distanceFalloff: 0.025,	// with an additional ~2.5 units of falloff.
			// rangeThreshold: 0.003,		// Occlusion proximity of ~0.3 world units
			// rangeFalloff: 0.001,			// with ~0.1 units of falloff.
			// luminanceInfluence: 0.7,
			// minRadiusScale: 0.33,
			// radius: 0.1,
			intensity: 30,
			luminanceInfluence: 0.1,
			// bias: 0.025,
			fade: 0.01,
			// color: null,
			// resolutionScale: 0.5,
			// worldDistanceThreshold: 1.5,
			// worldProximityFalloff: 0.5,
			// // worldDistanceFalloff: 0.5,
			// // worldProximityThreshold: 10.,
		} );
		const ssaoPass = new EffectPass( camera, ssaoEffect );
		// composer.addPass( normalPass );
		// composer.addPass( ssaoPass );

		// OutlineEffect works when outlineEffect.selection.add( c );
		// outlineEffect = new OutlineEffect( scene, camera, { edgeStrength: 3.0, visibleEdgeColor: 0x53fbff, hiddenEdgeColor: 0x53fbff, blur: true, xRay: false, blendFunction: BlendFunction.SCREEN } ); // SRC SCREEN
		// const outlinePass = new EffectPass( camera, outlineEffect );
		// composer.addPass( outlinePass );

		// // Not working Green Mask Pass, does not seem to use maskTexture
		// const tex = renderPass.texture;
		// maskEffect = new MaskEffect( tex );
		// const maskPass = new EffectPass( camera, maskEffect );
		// composer.addPass( maskPass );
		// // Not working MaskPass
		// // composer.addPass( new MaskPass( scene, camera ) );



		// Also probably useful (to export multiple passes at once etc)
		/*

		TODO:
		Matcap from ScreenSpaceNormal
		DepthPicking
		EDL

		Roadmap for upcoming passes, really great to see what's coming like scissors
		https://github.com/pmndrs/postprocessing/issues/279

		Please add all the effects in a single EffectPass for a more optimized, single FullScreen re-render see https://github.com/pmndrs/postprocessing/issues/82
		also see https://github.com/pmndrs/postprocessing/issues/419 for pipeline redesign

		CopyPass: A pass that copies the contents of an input buffer to another render target (ancestor of SavePass to get result into another pass if it still exists)
		DepthPickingPass see https://pmndrs.github.io/postprocessing/public/docs/class/src/passes/DepthPickingPass.js~DepthPickingPass.html
		LambdaPass: A pass that executes a given function.

		EDL :
			https://github.com/CloudCompare/CloudCompare/blob/master/plugins/core/GL/qEDL/shaders/EDL/edl_shade.frag
			https://theses.hal.science/tel-00438464v1/document
			https://github.com/potree/potree/blob/develop/src/materials/shaders/edl.fs

		MotionBlur upcoming in v7

		// Nice example for applying effects only to a selection of objects, very instructive using SavePass now CopyPass https://github.com/pmndrs/postprocessing/issues/303
		https://codesandbox.io/p/sandbox/transparent-antialias-khdqq?file=%2Fsrc%2FApp.js

		const ndc = new Vector3();
		const clientRect = myViewport.getBoundingClientRect();
		const clientX = pointerEvent.clientX - clientRect.left;
		const clientY = pointerEvent.clientY - clientRect.top;
		ndc.x = (clientX / myViewport.clientWidth) * 2.0 - 1.0;
		ndc.y = -(clientY / myViewport.clientHeight) * 2.0 + 1.0;
		const depth = await depthPickingPass.readDepth(ndc);
		ndc.z = depth * 2.0 - 1.0;

		const worldPosition = ndc.unproject(camera);

		scissors upcoming, hack in the meantime:
		https://github.com/pmndrs/postprocessing/issues/386
		https://codesandbox.io/p/sandbox/long-darkness-szcisb?file=%2Fsrc%2FApp.js%3A85%2C8-85%2C13

		Or could also use multiple RenderPasses, CopyPass,
		https://github.com/pmndrs/postprocessing/issues/386#issuecomment-1635767919
		You can use multiple RenderPass instances to render multiple scenes. Make sure to set RenderPass.clearPass.enabled = false if you want to render the scenes to the same frame buffer. Depending on your use case, your composition may require saving intermediate render results in textures via CopyPass. Blending textures together can be done with TextureEffect.


		*/

		// ------------------------------------------------
		// BELOW ATTEMPT WITH REALISM-EFFECTS NOT REALLY WORKING
		// ------------------------------------------------

		const velocityDepthNormalPass = new VelocityDepthNormalPass( scene, camera );

		// N8AO is based on threejs standard postprocessing effects, not pmndrs'


		// SSGI not really working
		const ssgiEffect = new SSGIEffect( scene, camera, velocityDepthNormalPass, );

		// TRAA
		const traaEffect = new TRAAEffect( scene, camera, velocityDepthNormalPass );

		// Motion Blur or velocityDepthNormalPass introduce tiles popping/flicker like material not loading correctly, otherwise great effect
		const motionBlurEffect = new MotionBlurEffect( velocityDepthNormalPass );

		// HBAO
		const hbaoEffect = new HBAOEffect( composer, camera, scene, {
			resolutionScale: 1,
			spp: 8,
			distance: 2,
			thickness: 0.75,
			radius: 6,
			// scalingFactor
			distancePower: 1,
			power: 2,
			bias: 80,
			color: new Color( 'red' ),
		} );
		// const traaPass = new EffectPass( camera, traaEffect );
		// const hbaoPass = new EffectPass( camera, hbaoEffect );

		// Not working yet, only available after v1.1.2 in npm published a long time ago, 2023-05
		// console.log( 'a' );
		// const sparkleEffect = new SparkleEffect( camera, velocityDepthNormalPass );
		// const sharpnessEffect = new SharpnessEffect( { sharpness: 0.75 } );
		// const depthTexture = ssgiEffect.depthTexture;
		// const bgColor = new Color( 0xffffff );
		// const gradualBackgroundEffect = new GradualBackgroundEffect( camera, depthTexture, bgColor, 51 );
		// const gtaoEffect = new GTAOEffect( composer, camera, scene, depthTexture );
		// const gBufferPass = new GBufferPass( this._scene, this._camera );
		// console.log( 'b' );

		// const motionBlurPass = new EffectPass( camera, ssgiEffect, motionBlurEffect );
		// composer.addPass( velocityDepthNormalPass );
		// composer.addPass( motionBlurPass );


		// GTAOEffect, GTAOPass, GBufferPass

		// composer.addPass( fxaaPass );

		// ------------------------------------------------
		// BELOW ARE CLASSIC THREEJS POSTPROCESSING FILTERS
		// NOT COMPATIBLE WITH PMNDRS EFFECTCOMPOSER IMPORTED
		// ------------------------------------------------


		// effectSobel = new ShaderPass( SobelOperatorShader );
		// effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
		// effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;

		// // composer.addPass( effectSobel );
		// composer.addPass( new BokehPass( scene, camera, {
		// 	focus: 1.0,
		// 	aperture: 0.025,
		// 	maxblur: 0.01
		// } ) );
		// composer.addPass( saoPass );

		// composer.addPass( new RenderPixelatedPass( 6, scene, camera ) );

		// composer.addPass( new OutputPass() );


		/*
		const shaderBleach = BleachBypassShader;

		const effectBloom = new BloomPass( 0.5 );
		const effectFilm = new FilmPass( 0.35 );
		const effectFilmBW = new FilmPass( 0.35, true );
		const effectDotScreen = new DotScreenPass( new THREE.Vector2( 0, 0 ), 0.5, 0.8 );

		*/


		console.log( 'composer with pass created' );

	}

	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );
	console.log( 'after resize' );

	// GUI
	const gui = new GUI();
	gui.width = 300;
	gui.add( params, 'apiKey' );
	gui.add( params, 'reload' );
	gui.open();

	// run hash functions
	initFromHash();


}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setSize( window.innerWidth, window.innerHeight );

	if ( postprocessingEnabled ) {

		composer.setSize( window.innerWidth, window.innerHeight );

	}

	camera.updateProjectionMatrix();
	renderer.setPixelRatio( window.devicePixelRatio );

}

function initFromHash() {

	const hash = window.location.hash.replace( /^#/, '' );
	const tokens = hash.split( /,/g ).map( t => parseFloat( t ) );
	if ( tokens.length !== 2 || tokens.findIndex( t => Number.isNaN( t ) ) !== - 1 ) {

		return;

	}

	const [ lat, lon ] = tokens;
	WGS84_ELLIPSOID.getCartographicToPosition( lat * MathUtils.DEG2RAD, lon * MathUtils.DEG2RAD, 0, controls.target );

	tiles.group.updateMatrixWorld();
	controls.target.applyMatrix4( tiles.group.matrixWorld );

}

function animate() {


	requestAnimationFrame( animate );

	if ( ! tiles ) return;

	controls.update();

	// update options
	tiles.setResolutionFromRenderer( camera, renderer );
	tiles.setCamera( camera );

	// update tiles
	camera.updateMatrixWorld();
	tiles.update();

	render();

}

function render() {

	// render primary view
	if ( true && postprocessingEnabled ) {

		// console.log( 'before composer.render()' );
		// renderer.clear();
		composer.render();
		// renderer.clear();
		// renderer.render( scene, camera );
		// console.log( 'after composer.render()' );

		// const normalMatrix = new Matrix3().getNormalMatrix( camera.matrixWorld );
		// screenSpaceNormalEffect.uniforms.get( 'camera_normalMatrix' ).value = normalMatrix;
		// screenSpaceNormalEffect.uniforms.get( 'camera_projectionMatrixInverse' ).value = camera.projectionMatrixInverse;

	} else {

		renderer.clear();
		renderer.render( scene, camera );

	}

	if ( tiles ) {

		const mat = tiles.group.matrixWorld.clone().invert();
		const vec = camera.position.clone().applyMatrix4( mat );

		const res = {};
		WGS84_ELLIPSOID.getPositionToCartographic( vec, res );
		// document.getElementById( 'credits' ).innerText = GeoUtils.toLatLonString( res.lat, res.lon ) + '\n' + tiles.getCreditsString();

	}

}
