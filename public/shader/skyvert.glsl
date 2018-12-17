precision highp float;
uniform mat4 uInverseSkyMatrix;
uniform mat4 uViewProjection;
attribute vec3 vPosition;
attribute vec2 vTexCoord;
#if SKYMODE == 3
varying vec3 jJ;
#else
varying vec2 d;
#endif
vec4 h(mat4 i, vec3 p)
{
	return i[0] * p.x + (i[1] * p.y + (i[2] * p.z + i[3]));
}
vec4 u(mat4 i, vec3 v) { return i[0] * v.x + i[1] * v.y + i[2] * v.z; }
void main(void)
{
	vec3 p = h(uInverseSkyMatrix, vPosition).xyz;
	gl_Position = u(uViewProjection, p);
	gl_Position.z -= (1.0 / 65535.0) * gl_Position.w;
#if SKYMODE == 3
	jJ = vPosition;
	jJ.xy += 1e-20 * vTexCoord;
#else
	d = vTexCoord;
#endif
}