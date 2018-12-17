precision highp float;
uniform sampler2D tInput;
varying highp vec2 j;

void main(void)
{
	float o = 0.25 / 256.0;
	gl_FragColor = 0.25 * (texture2D(tInput, j + vec2(o, o)) + texture2D(tInput, j + vec2(o, -o)) + texture2D(tInput, j + vec2(-o, o)) + texture2D(tInput, j + vec2(-o, -o)));
}