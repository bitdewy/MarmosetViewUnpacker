precision highp float;
uniform mat4 uModelViewProjectionMatrix;
uniform vec2 uUVOffset;
attribute vec3 vPosition;
attribute vec2 vTexCoord;
varying mediump vec2 d;

vec4 h(mat4 i, vec3 p)
{
	return i[0] * p.x + (i[1] * p.y + (i[2] * p.z + i[3]));
}

void main(void)
{
	gl_Position = h(uModelViewProjectionMatrix, vPosition.xyz);
	d = vTexCoord + uUVOffset;
}