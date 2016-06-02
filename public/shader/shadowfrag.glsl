precision highp float;
varying vec2 hO;
#ifdef ALPHA_TEST
varying mediump vec2 j;
uniform sampler2D tAlbedo;
#endif
vec3 hP(float hn)
{
	vec4 hQ = vec4(1.0, 255.0, 65025.0, 16581375.0)*hn;
	hQ = fract(hQ);
	hQ.xyz -= hQ.yzw*(1.0 / 255.0);
	return hQ.xyz;
}

void main(void)
{
#ifdef ALPHA_TEST
	float k = texture2D(tAlbedo, j).a;
	if (k<0.5)
	{
		discard;
	}
#endif
	gl_FragColor.xyz = hP((hO.x / hO.y)*0.5 + 0.5);
	gl_FragColor.w = 0.0;
}
