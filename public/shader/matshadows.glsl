#ifdef SHADOW_COUNT
#ifdef MOBILE
#define SHADOW_KERNEL (4.0 / 1536.0)
#else
#define SHADOW_KERNEL (4.0 / 2048.0)
#endif

highp vec4 m(highp mat4 o, highp vec3 p)
{
	return o[0] * p.x + (o[1] * p.y + (o[2] * p.z + o[3]));
}

uniform sampler2D tDepth0;
#if SHADOW_COUNT > 1
uniform sampler2D tDepth1;
#if SHADOW_COUNT > 2
uniform sampler2D tDepth2;
#endif
#endif
uniform highp vec2 uShadowKernelRotation;
uniform highp vec4 uShadowMapSize;
uniform highp mat4 uShadowMatrices[SHADOW_COUNT];
uniform highp mat4 uInvShadowMatrices[SHADOW_COUNT];
uniform highp vec4 uShadowTexelPadProjections[SHADOW_COUNT];

highp float fN(highp vec3 C)
{
	return (C.x + C.y * (1.0 / 255.0)) + C.z * (1.0 / 65025.0);
}

float fO(sampler2D fP, highp vec2 fE, highp float fQ)
{
#ifndef MOBILE
	highp vec2 c = fE * uShadowMapSize.xy;
	highp vec2 a = floor(c) * uShadowMapSize.zw, b = ceil(c) * uShadowMapSize.zw;
	highp vec4 dK;
	dK.x = fN(texture2D(fP, a).xyz);
	dK.y = fN(texture2D(fP, vec2(b.x, a.y)).xyz);
	dK.z = fN(texture2D(fP, vec2(a.x, b.y)).xyz);
	dK.w = fN(texture2D(fP, b).xyz);
	highp vec4 fR;
	fR.x = fQ < dK.x ? 1.0 : 0.0;
	fR.y = fQ < dK.y ? 1.0 : 0.0;
	fR.z = fQ < dK.z ? 1.0 : 0.0;
	fR.w = fQ < dK.w ? 1.0 : 0.0;
	highp vec2 w = c - a * uShadowMapSize.xy;
	vec2 s = (w.y * fR.zw + fR.xy) - w.y * fR.xy;
	return (w.x * s.y + s.x) - w.x * s.x;
#else
	highp float C = fN(texture2D(fP, fE.xy).xyz);
	return fQ < C ? 1.0 : 0.0;
#endif
}

highp float fS(sampler2D fP, highp vec3 fE, float fT)
{
	highp vec2 v = uShadowKernelRotation * fT;
	float s;
	s = fO(fP, fE.xy + v, fE.z);
	s += fO(fP, fE.xy - v, fE.z);
	s += fO(fP, fE.xy + vec2(-v.y, v.x), fE.z);
	s += fO(fP, fE.xy + vec2(v.y, -v.x), fE.z);
	s *= 0.25;
	return s * s;
}

struct dF
{
	float dR[LIGHT_COUNT];
};

void dH(out dF ss, float fT)
{
	highp vec3 fU[SHADOW_COUNT];
	vec3 fC = gl_FrontFacing ? G : -G;
	for (int u = 0; u < SHADOW_COUNT; ++u)
	{
		vec4 fV = uShadowTexelPadProjections[u];
		float fW = fV.x * D.x + (fV.y * D.y + (fV.z * D.z + fV.w));
#ifdef MOBILE
		fW *= .001 + fT;
#else
		fW *= .0005 + 0.5 * fT;
#endif
		highp vec4 fX = m(uShadowMatrices[u], D + fW * fC);
		fU[u] = fX.xyz / fX.w;
	}
	float J;
#if SHADOW_COUNT > 0
	J = fS(tDepth0, fU[0], fT);
	ss.dR[0] = J;
#endif
#if SHADOW_COUNT > 1
	J = fS(tDepth1, fU[1], fT);
	ss.dR[1] = J;
#endif
#if SHADOW_COUNT > 2
	J = fS(tDepth2, fU[2], fT);
	ss.dR[2] = J;
#endif
	for (int u = SHADOW_COUNT; u < LIGHT_COUNT; ++u)
	{
		ss.dR[u] = 1.0;
	}
}

struct dJ
{
	highp float dK[LIGHT_COUNT];
};

highp vec4 fY(sampler2D fP, highp vec2 fE, highp mat4 fZ)
{
	highp vec4 hc;
	hc.xy = fE;
#ifndef MOBILE
	highp vec2 c = fE * uShadowMapSize.xy;
	highp vec2 a = floor(c) * uShadowMapSize.zw, b = ceil(c) * uShadowMapSize.zw;
	highp vec4 fR;
	fR.x = fN(texture2D(fP, a).xyz);
	fR.y = fN(texture2D(fP, vec2(b.x, a.y)).xyz);
	fR.z = fN(texture2D(fP, vec2(a.x, b.y)).xyz);
	fR.w = fN(texture2D(fP, b).xyz);
	highp vec2 w = c - a * uShadowMapSize.xy;
	vec2 s = (w.y * fR.zw + fR.xy) - w.y * fR.xy;
	hc.z = (w.x * s.y + s.x) - w.x * s.x;
#else
	hc.z = fN(texture2D(fP, fE.xy).xyz);
#endif
	hc = m(fZ, hc.xyz);
	hc.xyz /= hc.w;
	return hc;
}

void dM(out dJ ss, float fT)
{
	highp vec3 hd[SHADOW_COUNT];
	vec3 fC = gl_FrontFacing ? G : -G;
	fC *= 0.6;
	for (int u = 0; u < SHADOW_COUNT; ++u)
	{
		vec4 fV = uShadowTexelPadProjections[u];
		float fW = fV.x * D.x + (fV.y * D.y + (fV.z * D.z + fV.w));
#ifdef MOBILE
		fW *= .001 + fT;
#else
		fW *= .0005 + 0.5 * fT;
#endif
		highp vec4 fX = m(uShadowMatrices[u], D - fW * fC);
		hd[u] = fX.xyz / fX.w;
	}
	highp vec4 he;
#if SHADOW_COUNT > 0
	he = fY(tDepth0, hd[0].xy, uInvShadowMatrices[0]);
	ss.dK[0] = length(D.xyz - he.xyz);
#endif
#if SHADOW_COUNT > 1
	he = fY(tDepth1, hd[1].xy, uInvShadowMatrices[1]);
	ss.dK[1] = length(D.xyz - he.xyz);
#endif
#if SHADOW_COUNT > 2
	he = fY(tDepth2, hd[2].xy, uInvShadowMatrices[2]);
	ss.dK[2] = length(D.xyz - he.xyz);
#endif
	for (int u = SHADOW_COUNT; u < LIGHT_COUNT; ++u)
	{
		ss.dK[u] = 1.0;
	}
}
#endif
