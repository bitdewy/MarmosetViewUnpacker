precision highp float;
attribute vec3 vPosition;
attribute vec2 vTexCoord;
uniform mat4 uMeshTransform;
uniform mat4 uViewProjection;
varying vec2 jG;
#ifdef ALPHA_TEST
varying mediump vec2 d;
uniform vec2 uUVOffset;
#endif
vec4 h(mat4 i, vec3 p)
{
	return i[0] * p.x + (i[1] * p.y + (i[2] * p.z + i[3]));
}
void main(void)
{
	vec3 p = h(uMeshTransform, vPosition).xyz;
	gl_Position = h(uViewProjection, p);
	jG = gl_Position.zw;
#ifdef ALPHA_TEST
	d = vTexCoord + uUVOffset;
#endif
}