precision highp float;
uniform mat4 uInverseSkyMatrix;
uniform mat4 uViewProjection;
attribute vec3 vPosition;
attribute vec2 vTexCoord;
#if SKYMODE == 3
varying vec3 iK;
#else
varying vec2 j;
#endif

vec4 m(mat4 o, vec3 p)
{
	return o[0] * p.x + (o[1] * p.y + (o[2] * p.z + o[3]));
}

vec4 ih(mat4 o, vec3 id)
{
	return o[0] * id.x + o[1] * id.y + o[2] * id.z;
}

void main(void)
{
	vec3 p = m(uInverseSkyMatrix, vPosition).xyz;
	gl_Position = ih(uViewProjection, p);
	gl_Position.z -= (1.0 / 65535.0) * gl_Position.w;
#if SKYMODE == 3
	iK = vPosition;
	iK.xy += 1e-20 * vTexCoord;
#else
	j = vTexCoord;
#endif
}