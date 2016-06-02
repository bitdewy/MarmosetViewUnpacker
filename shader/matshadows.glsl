#ifdef SHADOW_COUNT
#ifdef MOBILE
#define SHADOW_KERNEL (4.0/1536.0)
#else
#define SHADOW_KERNEL (4.0/2048.0)
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
uniform highp vec4 uShadowTexelPadProjections[SHADOW_COUNT];

highp float fn(highp vec3 C)
{
	return(C.x + C.y*(1.0 / 255.0)) + C.z*(1.0 / 65025.0);
}

float fo(sampler2D fu, highp vec2 fd, highp float fv)
{
#ifndef MOBILE
	highp vec2 c = fd*uShadowMapSize.xy;
	highp vec2 a = floor(c)*uShadowMapSize.zw, b = ceil(c)*uShadowMapSize.zw;
	vec4 fA; fA.x = fv<fn(texture2D(fu, a).xyz) ? 1.0 : 0.0;
	fA.y = fv<fn(texture2D(fu, vec2(b.x, a.y)).xyz) ? 1.0 : 0.0;
	fA.z = fv<fn(texture2D(fu, vec2(a.x, b.y)).xyz) ? 1.0 : 0.0;
	fA.w = fv<fn(texture2D(fu, b).xyz) ? 1.0 : 0.0;
	highp vec2 w = c - a*uShadowMapSize.xy;
	vec2 t = (w.y*fA.zw + fA.xy) - w.y*fA.xy;
	return(w.x*t.y + t.x) - w.x*t.x;
#else
	highp float C = fn(texture2D(fu, fd.xy).xyz);
	return fv<C ? 1.0 : 0.0;
#endif
}float fB(sampler2D fu, highp vec3 fd, float fC)
{
	highp vec2 v = uShadowKernelRotation*fC;
	float s;
	s = fo(fu, fd.xy + v, fd.z);
	s += fo(fu, fd.xy - v, fd.z);
	s += fo(fu, fd.xy + vec2(-v.y, v.x), fd.z);
	s += fo(fu, fd.xy + vec2(v.y, -v.x), fd.z);
	s *= 0.25;
	return s*s;
}

struct dF
{
	float dO[LIGHT_COUNT];
};

void dH(out dF ss, float fC)
{
	highp vec3 fD[SHADOW_COUNT];
	vec3 eZ = gl_FrontFacing ? G : -G;
	for (int u = 0; u < SHADOW_COUNT; ++u)
	{
		vec4 fE = uShadowTexelPadProjections[u];
		float fF = fE.x*D.x + (fE.y*D.y + (fE.z*D.z + fE.w));
#ifdef MOBILE
		fF *= .001 + fC;
#else
		fF *= .0005 + 0.5*fC;
#endif
		highp vec4 fG = m(uShadowMatrices[u], D + fF*eZ);
		fD[u] = fG.xyz / fG.w;
	}
#if SHADOW_COUNT > 0
	ss.dO[0] = fB(tDepth0, fD[0], fC);
#endif
#if SHADOW_COUNT > 1
	ss.dO[1] = fB(tDepth1, fD[1], fC);
#endif
#if SHADOW_COUNT > 2
	ss.dO[2] = fB(tDepth2, fD[2], fC);
#endif
	for (int u = SHADOW_COUNT; u<LIGHT_COUNT; ++u)
	{
		ss.dO[u] = 1.0;
	}
}
#endif
