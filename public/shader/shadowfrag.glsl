precision highp float;
varying vec2 iH;
#ifdef ALPHA_TEST
varying mediump vec2 j;
uniform sampler2D tAlbedo;
#endif

vec3 iI(float id)
{
	vec4 iJ = vec4(1.0, 255.0, 65025.0, 16581375.0) * id;
	iJ = fract(iJ);
	iJ.xyz -= iJ.yzw * (1.0 / 255.0);
	return iJ.xyz;
}

void main(void)
{
#ifdef ALPHA_TEST
	float k = texture2D(tAlbedo, j).a;
	if (k < 0.5)
	{
		discard;
	}
#endif
	gl_FragColor.xyz = iI((iH.x / iH.y) * 0.5 + 0.5);
	gl_FragColor.w = 0.0;
}
