precision mediump float;
uniform sampler2D tInput;
uniform vec4 uKernel[BLOOM_SAMPLES];
varying highp vec2 j;

void main(void)
{
	vec3 c = vec3(0.0,0.0,0.0);
	for (int k = 0; k < BLOOM_SAMPLES; ++k)
	{
		vec3 l = uKernel[k].xyz;
		vec3 m = texture2D(tInput, j+l.xy).xyz;
		m = max(m, vec3(0.0,0.0,0.0));
		c += m * l.z;
	}
	gl_FragColor.xyz = c;
	gl_FragColor.w =0.0;
}