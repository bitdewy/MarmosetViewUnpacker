precision highp float;
uniform mat4 uModelViewProjectionMatrix;
uniform mat4 uSkyMatrix;
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
varying highp vec3 D;
varying mediump vec2 j;
varying mediump vec3 E;
varying mediump vec3 F;
varying mediump vec3 G;
#ifdef VERTEX_COLOR
varying lowp vec4 H;
#endif
#ifdef TEXCOORD_SECONDARY
varying mediump vec2 I;
#endif

vec3 ic(vec2 id)
{
	bool ie = (id.y > (32767.1 / 65535.0));
	id.y = ie ? (id.y - (32768.0 / 65535.0)) : id.y;
	vec3 r;
	r.xy = (2.0 * 65535.0 / 32767.0) * id - vec2(1.0);
	r.z = sqrt(clamp(1.0 - dot(r.xy, r.xy), 0.0, 1.0));
	r.z = ie ? -r.z : r.z;
	return r;
}

vec4 m(mat4 o, vec3 p)
{
	return o[0] * p.x + (o[1] * p.y + (o[2] * p.z + o[3]));
}

vec3 ih(mat4 o, vec3 id)
{
	return o[0].xyz * id.x + o[1].xyz * id.y + o[2].xyz * id.z;
}

void main(void)
{
	gl_Position = m(uModelViewProjectionMatrix, vPosition.xyz);
	j = vTexCoord;
	E = ih(uSkyMatrix, ic(vTangent));
	F = ih(uSkyMatrix, ic(vBitangent));
	G = ih(uSkyMatrix, ic(vNormal));
	D = m(uSkyMatrix, vPosition.xyz).xyz;
#ifdef VERTEX_COLOR
	H = vColor;
#endif
#ifdef TEXCOORD_SECONDARY
	I = vTexCoord2;
#endif
}
