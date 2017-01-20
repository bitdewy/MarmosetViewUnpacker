#ifdef SKIN
uniform vec4 uTexRangeSubdermis;
uniform vec4 uTexRangeTranslucency;
uniform vec4 uTexRangeFuzz;
uniform vec3 uSubdermisColor;
uniform vec4 uTransColor;
uniform float uTransScatter;
uniform vec4 uFresnelColor;
uniform float uFresnelOcc;
uniform float uFresnelGlossMask;
uniform float uTransSky;
uniform float uFresnelIntegral;
uniform float uTransIntegral;
uniform float uSkinTransDepth;
uniform float uSkinShadowBlur;
uniform float uNormalSmooth;

struct de
{
	vec3 hf;
	vec3 hh, hi, hj, fj;
	vec3 di, dm, hk;
	vec3 hl;
	vec3 hm;
	vec3 hn;
	vec3 ho;
	float hu;
	float hv;
	float hA;
	float dI;
};

void dh(out de s)
{
	vec4 J;
#ifdef SKIN_NO_SUBDERMIS_TEX
	s.hf = uSubdermisColor;
	s.hA = 1.0;
#else
	J = R(j, uTexRangeSubdermis);
	s.hf = L(J.xyz);
	s.hA = J.w * J.w;
#endif
	s.ho = uTransColor.rgb;
	s.hu = uTransScatter;
#ifdef SKIN_VERSION_1
	s.dI = uSkinShadowBlur * s.hA;
#else
	s.hv = max(max(s.ho.r, s.ho.g), s.ho.b) * uTransColor.a;
	float hB = max(s.hf.r, max(s.hf.g, s.hf.b));
	hB = 1.0 - hB;
	hB *= hB;
	hB *= hB;
	hB *= hB;
	hB = 1.0 - (hB * hB);
	s.hA *= hB;
	s.dI = uSkinShadowBlur * s.hA * dot(s.hf.rgb, vec3(0.333, 0.334, 0.333));
#endif
#ifndef SKIN_NO_TRANSLUCENCY_TEX
	J = R(j, uTexRangeTranslucency);
	s.ho *= L(J.xyz);
#endif
	s.hl = fJ(tNormal, j, uNormalSmooth * s.hA);
	vec3 hC, hD, hE;
	eO(hC, hD, hE, s.hl);
	s.dm = s.hh = hC + hD + hE;
#ifdef SKIN_VERSION_1
	s.di = eU(hC, hD, hE, vec3(1.0, 0.6667, 0.25), s.hf);
#else
	s.di = eU(hC, hD, hE, vec3(1.0, 0.6667, 0.25), s.hf * 0.2 + vec3(0.1));
#endif
#ifdef SKIN_VERSION_1
	vec3 hF, hG, hH;
	eO(hF, hG, hH, -s.hl);
	s.hk = eS(hF, hG, hH, vec3(1.0, 0.4444, 0.0625), s.hu);
	s.hk *= uTransSky;
#else
	s.hk = vec3(0.0);
#endif
	s.hi = s.hj = s.fj = vec3(0.0);
	s.hf *= 0.5;
	s.hu *= 0.5;
	s.hm = uFresnelColor.rgb;
	s.hn = uFresnelColor.aaa * vec3(1.0, 0.5, 0.25);
#ifndef SKIN_NO_FUZZ_TEX
	J = R(j, uTexRangeFuzz);
	s.hm *= L(J.rgb);
#endif
}

void dQ(inout de s, float hI, float hJ, vec3 dN, vec3 N, vec3 dP)
{
	float en = dot(dN, N);
	float eo = dot(dN, s.hl);
	float dT = saturate((1.0 / 3.1415926) * en);
	float fm = hI * hI;
	fm *= fm;
	fm = saturate(6.0 * fm);
#ifdef SKIN_VERSION_1
	vec3 hK = eE(eo, s.hf);
#else
	vec3 hK = em(en, eo, s.hf);
#endif
	float hL = eD(-eo, s.hu);
	vec3 hj = vec3(hL * hL);
#ifdef SKIN_VERSION_1
#ifdef SHADOW_COUNT
	vec3 hM = vec3(hI);
	float hN = saturate(fm - 2.0 * (hI * hI));
	hM += hN * s.hf;
	float hO = hI;
#endif
#else
#ifdef SHADOW_COUNT
	vec3 hM;
	highp vec3 hP = (0.995 * s.hf) + vec3(0.005, 0.005, 0.005);
	highp vec3 hQ = vec3(1.0) - hP;
	hP = mix(hP, hQ, hI);
	float hR = sqrt(hI);
	vec3 hS = 2.0 * vec3(1.0 - hR);
	hR = 1.0 - hR;
	hR = (1.0 - hR * hR);
	hM = saturate(pow(hP * hR, hS));
	highp float hT = 0.35 / (uSkinTransDepth + 0.001);
	highp float hU = saturate(hJ * hT);
	hU = saturate(1.0 - hU);
	hU *= hU;
	highp vec3 hV = vec3((-3.0 * hU) + 3.15);
	highp vec3 hW = (0.9975 * s.ho) + vec3(0.0025, 0.0025, 0.0025);
	highp float hB = saturate(10.0 * dot(hW, hW));
	vec3 hO = pow(hW * hU, hV) * hB;
#else
	hj = vec3(0.0);
#endif
#endif
	float fn = eD(eo, s.hn.z);
#ifdef SHADOW_COUNT
	vec3 fo = mix(vec3(1.0), hM, uFresnelOcc);
	vec3 fj = fn * fo;
#else
	vec3 fj = vec3(fn);
#endif
#ifdef SHADOW_COUNT
	hK *= hM;
	dT *= fm;
	hj *= hO;
#endif
	s.fj = fj * dP + s.fj;
	s.hj = hj * dP + s.hj;
	s.hi = hK * dP + s.hi;
	s.hh = dT * dP + s.hh;
}

void dW(out vec3 dn, out vec3 diff_extra, inout de s, vec3 T, vec3 N, float V)
{
	s.fj *= uFresnelIntegral;
	float eL = dot(T, N);
	vec2 fu = eK(vec2(eL, eL), s.hn.xy);
	s.fj = s.dm * fu.x + (s.fj * fu.y);
	s.fj *= s.hm;
	float fv = saturate(1.0 + -uFresnelGlossMask * V);
	s.fj *= fv * fv;
	s.hj = s.hj * uTransIntegral;
#ifdef SKIN_VERSION_1
	s.hi = (s.hi * eG(s.hf)) + s.di;
#else
	s.hi = (s.hi * eC(s.hf)) + s.di;
#endif
	dn = mix(s.hh, s.hi, s.hA);
#ifdef SKIN_VERSION_1
	s.hj = (s.hj + s.hk) * s.ho;
	diff_extra = (s.fj + s.hj) * s.hA;
#else
	dn += s.hj * s.hv;
	diff_extra = s.fj * s.hA;
#endif
}
#endif
