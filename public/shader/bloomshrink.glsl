precision highp float;
uniform sampler2D tInput;
varying highp vec2 d;

void main(void)
{
	float A = 0.25 / 256.0;
	gl_FragColor = 0.25 * (texture2D(tInput, d + vec2(A, A)) + texture2D(tInput, d + vec2(A, -A)) + texture2D(tInput, d + vec2(-A, A)) + texture2D(tInput, d + vec2(-A, -A)));
}
