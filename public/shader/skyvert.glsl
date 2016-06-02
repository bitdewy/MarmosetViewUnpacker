precision highp float;
uniform mat4 uInverseSkyMatrix;
uniform mat4 uViewProjection;
attribute vec3 vPosition;
attribute vec2 vTexCoord;
#if SKYMODE == 3
varying vec3 hR;
#else
varying vec2 j;
#endif

vec4 m(mat4 o, vec3 p)
{
	return o[0] * p.x + (o[1] * p.y + (o[2] * p.z + o[3]));
}

vec4 hu(mat4 o, vec3 hn)
{
	return o[0] * hn.x + o[1] * hn.y + o[2] * hn.z;
}

void main(void)
{
	vec3 p = m(uInverseSkyMatrix, vPosition).xyz;
	gl_Position = hu(uViewProjection, p);
	gl_Position.z -= (1.0 / 65535.0)*gl_Position.w;
#if SKYMODE == 3
	hR = vPosition;
	hR.xy += 1e-20*vTexCoord;
#else
	j = vTexCoord;
#endif
}
