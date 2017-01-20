precision mediump float;
uniform sampler2D tInput0;
uniform sampler2D tInput1;
uniform sampler2D tInput2;
#ifdef HIGHQ
uniform sampler2D tInput3;
#endif
uniform vec4 uSamplesValid;
varying highp vec2 d;

void main(void)
{
	vec4 e = texture2D(tInput0, d);
	vec4 f = texture2D(tInput1, d);
	vec4 h = texture2D(tInput2, d);
#ifdef HIGHQ
	vec4 i = texture2D(tInput3, d);
	gl_FragColor = e * uSamplesValid.x + f * uSamplesValid.y + h * uSamplesValid.z + i * uSamplesValid.w;
#else
	gl_FragColor = e * uSamplesValid.x + f * uSamplesValid.y + h * uSamplesValid.z;
#endif
}
