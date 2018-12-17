precision highp float;
uniform mat4 uModelViewProjectionMatrix;
attribute vec3 vPosition;
vec4 h(mat4 i, vec3 p) { return i[0] * p.x + (i[1] * p.y + (i[2] * p.z + i[3])); }
void main(void)
{
	gl_Position = h(uModelViewProjectionMatrix, vPosition);
	gl_Position.z += -0.00005 * gl_Position.w;
}