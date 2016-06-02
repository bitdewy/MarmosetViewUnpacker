precision mediump float;
uniform sampler2D tInput;
uniform vec4 uKernel[BLOOM_SAMPLES];
varying highp vec2 d;

void main(void)
{
	vec3 c = vec3(0.0, 0.0, 0.0);
	for (int u = 0; u < BLOOM_SAMPLES; ++u)
	{
		vec3 v = uKernel[u].xyz;
		c += texture2D(tInput, d + v.xy).xyz * v.z;
	}
	gl_FragColor.xyz = c;
	gl_FragColor.w = 0.0;
}
