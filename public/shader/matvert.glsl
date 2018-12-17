precision highp float;
uniform mat4 uModelViewProjectionMatrix;
uniform mat4 uSkyMatrix;
uniform vec2 uUVOffset;
attribute vec3 vPosition;
attribute vec2 vTexCoord;
attribute vec2 vTangent;
attribute vec2 vBitangent;
attribute vec2 vNormal;
#ifdef VERTEX_COLOR
attribute vec4 vColor;
#endif
#ifdef TEXCOORD_SECONDARY
attribute vec2 vTexCoord2;
#endif 
varying highp vec3 dv;
varying mediump vec2 d;
varying mediump vec3 dA;
varying mediump vec3 dB;
varying mediump vec3 dC;
#ifdef VERTEX_COLOR
varying lowp vec4 dD;
#endif
#ifdef TEXCOORD_SECONDARY
varying mediump vec2 dE;
#endif
vec3 iW(vec2 v)
{
	bool iX = (v.y > (32767.1 / 65535.0));
	v.y = iX ? (v.y - (32768.0 / 65535.0)) : v.y;
	vec3 r;
	r.xy = (2.0 * 65535.0 / 32767.0) * v - vec2(1.0);
	r.z = sqrt(clamp(1.0 - dot(r.xy, r.xy), 0.0, 1.0));
	r.z = iX ? -r.z : r.z;
	return r;
}
vec4 h(mat4 i, vec3 p) { return i[0] * p.x + (i[1] * p.y + (i[2] * p.z + i[3])); }
vec3 u(mat4 i, vec3 v) { return i[0].xyz * v.x + i[1].xyz * v.y + i[2].xyz * v.z; }

void main(void)
{
	gl_Position = h(uModelViewProjectionMatrix, vPosition.xyz);
	d = vTexCoord + uUVOffset;
	dA = u(uSkyMatrix, iW(vTangent));
	dB = u(uSkyMatrix, iW(vBitangent));
	dC = u(uSkyMatrix, iW(vNormal));
	dv = h(uSkyMatrix, vPosition.xyz).xyz;
#ifdef VERTEX_COLOR
	dD = vColor;
#endif
#ifdef TEXCOORD_SECONDARY
	dE = vTexCoord2;
#endif
}