precision highp float;
uniform mat4 uModelViewProjectionMatrix;
uniform mat4 uModelSkyMatrix;
uniform float uScale;
attribute vec3 vPosition;
varying highp vec3 dv;
varying mediump vec2 jv;
varying mediump vec3 dC;
vec4 h(mat4 i, vec3 p) { return i[0] * p.x + (i[1] * p.y + (i[2] * p.z + i[3])); }
void main(void)
{
    jv = vPosition.xz;
    dC = normalize(uModelSkyMatrix[1].xyz);
    dv = h(uModelSkyMatrix, vPosition).xyz;
    gl_Position = h(uModelViewProjectionMatrix, vPosition);
}