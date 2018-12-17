#ifdef SHADOW_COUNT
#ifdef MOBILE
#define SHADOW_KERNEL (4.0/1536.0)
#else
#define SHADOW_KERNEL (4.0/2048.0)
#endif

highp vec4 h(highp mat4 i,highp vec3 p)
{
	return i[0] * p.x + (i[1] * p.y + (i[2] * p.z + i[3]));
}

uniform sampler2D tDepth0;
#if SHADOW_COUNT > 1
uniform sampler2D tDepth1;
#if SHADOW_COUNT > 2
uniform sampler2D tDepth2;
#endif
#endif
uniform highp vec2 uShadowKernelRotation;
uniform highp vec2 uShadowMapSize;
uniform highp mat4 uShadowMatrices[SHADOW_COUNT];
uniform highp vec4 uShadowTexelPadProjections[SHADOW_COUNT];
#ifndef MOBILE
uniform highp mat4 uInvShadowMatrices[SHADOW_COUNT];
#endif
highp float hJ(highp vec3 G)
{
#ifdef SHADOW_NATIVE_DEPTH
	return G.x;
#else
	return (G.x + G.y * (1.0 / 255.0)) + G.z * (1.0 / 65025.0);
#endif
}
#ifndef SHADOW_COMPARE
#define SHADOW_COMPARE(a,b) ((a) < (b) ? 1.0 : 0.0)
#endif
#ifndef SHADOW_CLIP
#define SHADOW_CLIP(c,v) v
#endif
float hK(sampler2D hL, highp vec2 hA, highp float H)
{
#ifndef MOBILE
	highp vec2 c = hA * uShadowMapSize.x;
	highp vec2 a = floor(c) * uShadowMapSize.y, b=ceil(c) * uShadowMapSize.y;
	highp vec4 eE;
	eE.x = hJ(texture2D(hL, a).xyz);
	eE.y = hJ(texture2D(hL, vec2(b.x, a.y)).xyz);
	eE.z = hJ(texture2D(hL, vec2(a.x, b.y)).xyz);
	eE.w = hJ(texture2D(hL, b).xyz);
	highp vec4 hM;
	hM.x = SHADOW_COMPARE(H, eE.x);
	hM.y = SHADOW_COMPARE(H, eE.y);
	hM.z = SHADOW_COMPARE(H, eE.z);
	hM.w = SHADOW_COMPARE(H, eE.w);
	highp vec2 w = c - a * uShadowMapSize.x;
	vec2 s = (w.y * hM.zw + hM.xy) - w.y * hM.xy;
	return (w.x * s.y + s.x) - w.x * s.x;
#else
	highp float G = hJ(texture2D(hL, hA.xy).xyz);
	return SHADOW_COMPARE(H,G);
#endif
}

highp float hN(sampler2D hL, highp vec3 hA, float hO)
{
	highp vec2 l = uShadowKernelRotation * hO;
	float s;
	s = hK(hL, hA.xy + l, hA.z);
	s += hK(hL, hA.xy - l, hA.z);
	s += hK(hL, hA.xy + vec2(-l.y, l.x), hA.z);
	s += hK(hL, hA.xy + vec2(l.y, -l.x), hA.z);
	s *= 0.25;
	return s * s;
}

struct ev
{
	float eL[LIGHT_COUNT];
};

void eB(out ev ss, float hO)
{
	highp vec3 hP[SHADOW_COUNT];
	vec3 hu = gl_FrontFacing ? dC : -dC;
	for (int k = 0; k < SHADOW_COUNT; ++k)
	{
		vec4 hQ = uShadowTexelPadProjections[k];
		float hR = hQ.x * dv.x + (hQ.y * dv.y + (hQ.z * dv.z + hQ.w));
	#ifdef MOBILE
		hR *= .001 + hO;
	#else
		hR *= .0005 + 0.5 * hO;
	#endif
		highp vec4 hS = h(uShadowMatrices[k], dv + hR * hu);
		hP[k] = hS.xyz / hS.w;
	}

	float m;
	#if SHADOW_COUNT > 0
	m = hN(tDepth0, hP[0], hO);
	ss.eL[0] = SHADOW_CLIP(hP[0].xy, m);
	#endif
	#if SHADOW_COUNT > 1
	m = hN(tDepth1, hP[1], hO);
	ss.eL[1] = SHADOW_CLIP(hP[1].xy, m);
	#endif
	#if SHADOW_COUNT > 2
	m = hN(tDepth2, hP[2], hO);
	ss.eL[2] = SHADOW_CLIP(hP[2].xy, m);
	#endif
	for (int k = SHADOW_COUNT; k < LIGHT_COUNT; ++k)
	{
		ss.eL[k] = 1.0;
	}
}

struct eD
{
	highp float eE[LIGHT_COUNT];
};

#ifdef MOBILE
void eG(out eD ss, float hO)
{
	for (int k = 0; k < LIGHT_COUNT; ++k)
	{
		ss.eE[k] = 1.0;
	}
}
#else
highp vec4 hT(sampler2D hL, highp vec2 hA, highp mat4 hU)
{
	highp vec4 E;
	E.xy = hA;
#ifndef MOBILE
	highp vec2 c = hA * uShadowMapSize.x;
	highp vec2 a = floor(c) * uShadowMapSize.y, b = ceil(c) * uShadowMapSize.y;
	highp vec4 hM;
	hM.x = hJ(texture2D(hL, a).xyz);
	hM.y = hJ(texture2D(hL, vec2(b.x, a.y)).xyz);
	hM.z = hJ(texture2D(hL, vec2(a.x, b.y)).xyz);
	hM.w = hJ(texture2D(hL, b).xyz);
	highp vec2 w = c - a * uShadowMapSize.x;
	vec2 s = (w.y * hM.zw + hM.xy) - w.y * hM.xy;
	E.z = (w.x * s.y + s.x) - w.x * s.x;
#else
	E.z = hJ(texture2D(hL, hA.xy).xyz);
#endif
	E = h(hU, E.xyz);
	E.xyz /= E.w;
	return E;
}

void eG(out eD ss, float hO)
{
	highp vec3 hV[SHADOW_COUNT];
	vec3 hu = gl_FrontFacing ? dC : -dC;
	hu *= 0.6;
	for (int k = 0; k < SHADOW_COUNT; ++k)
	{
		vec4 hQ = uShadowTexelPadProjections[k];
		float hR = hQ.x * dv.x + (hQ.y * dv.y + (hQ.z * dv.z + hQ.w));
	#ifdef MOBILE
		hR *= .001 + hO;
	#else
		hR *= .0005 + 0.5 * hO;
	#endif
		highp vec4 hS = h(uShadowMatrices[k], dv - hR * hu);
		hV[k] = hS.xyz / hS.w;
	}
	highp vec4 hW;
	#if SHADOW_COUNT > 0
	hW = hT(tDepth0, hV[0].xy, uInvShadowMatrices[0]);
	ss.eE[0] = length(dv.xyz - hW.xyz);
	#endif
	#if SHADOW_COUNT > 1
	hW = hT(tDepth1, hV[1].xy, uInvShadowMatrices[1]);
	ss.eE[1] = length(dv.xyz - hW.xyz);
	#endif
	#if SHADOW_COUNT > 2
	hW = hT(tDepth2, hV[2].xy, uInvShadowMatrices[2]);
	ss.eE[2] = length(dv.xyz - hW.xyz);
	#endif
	for (int k = SHADOW_COUNT; k < LIGHT_COUNT; ++k)
	{
		ss.eE[k] = 1.0;
	}
}
#endif
#endif