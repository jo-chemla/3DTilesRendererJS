// MaskEffect.js
import { Uniform } from 'three';
import { Effect } from 'postprocessing';

const fragmentShader = `uniform sampler2D maskTexture;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec4 tex = texture2D(maskTexture, uv);
	// float mask = texture2D(maskTexture, uv).g;
	outputColor = vec4(tex.g, tex.r, tex.b, 0.9);
	// outputColor = vec4(inputColor.rgb, inputColor.a * mask);

}`;

export class MaskEffect extends Effect {

	constructor( maskTexture ) {

		super( 'MaskEffect', fragmentShader, {

			uniforms: new Map( [
				[ 'maskTexture', new Uniform( maskTexture ) ]
			] )

		} );

	}

}
