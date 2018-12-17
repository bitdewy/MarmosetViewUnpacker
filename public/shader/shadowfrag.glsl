precision highp float;
varying vec2 jG;
#ifdef ALPHA_TEST
varying mediump vec2 d;
uniform sampler2D tAlbedo;
#endif
vec3 jH(float v)
{
	vec4 jI = vec4(1.0, 255.0, 65025.0, 16581375.0) * v;
	jI = fract(jI);
	jI.xyz -= jI.yzw * (1.0 / 255.0);
	return jI.xyz;
}
void main(void)
{
#ifdef ALPHA_TEST
	float e = texture2D(tAlbedo, d).a;
	if (e < 0.5)
	{
		discard;
	}
#endif
#ifdef SHADOW_NATIVE_DEPTH
	gl_FragColor.xyz = vec3(0.0, 0.0, 0.0);
#else
	gl_FragColor.xyz = jH((jG.x / jG.y) * 0.5 + 0.5);
#endif
	gl_FragColor.w = 0.0;
}