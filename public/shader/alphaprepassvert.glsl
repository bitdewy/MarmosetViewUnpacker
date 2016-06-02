precision highp float;
uniform mat4 uModelViewProjectionMatrix;
attribute vec3 vPosition;
attribute vec2 vTexCoord;
varying mediump vec2 j;

vec4 m(mat4 o, vec3 p)
{
	return o[0] * p.x + (o[1] * p.y + (o[2] * p.z + o[3]));
}

void main(void)
{
	gl_Position = m(uModelViewProjectionMatrix, vPosition.xyz);
	j = vTexCoord;
}
