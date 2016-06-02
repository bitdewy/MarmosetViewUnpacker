precision highp float;
attribute vec3 vPosition;
attribute vec2 vTexCoord;
uniform mat4 uViewProjection;
varying vec2 hO;
#ifdef ALPHA_TEST
varying mediump vec2 j;
#endif
vec4 m(mat4 o, vec3 p)
{
	return o[0] * p.x + (o[1] * p.y + (o[2] * p.z + o[3]));
}

void main(void)
{
	gl_Position = m(uViewProjection, vPosition);
	hO = gl_Position.zw;
#ifdef ALPHA_TEST
	j = vTexCoord;
#endif
}
