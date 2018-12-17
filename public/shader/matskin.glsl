#ifdef SKIN
#ifndef SKIN_NO_SUBDERMIS_TEX
uniform vec4 uTexRangeSubdermis;
#endif
#ifndef SKIN_NO_TRANSLUCENCY_TEX
uniform vec4 uTexRangeTranslucency;
#endif
#ifndef SKIN_NO_FUZZ_TEX
uniform vec4 uTexRangeFuzz;
#endif
uniform vec4 uTransColor;
uniform vec4 uFresnelColor;
uniform vec3 uSubdermisColor;
uniform float uTransScatter;
uniform float uFresnelOcc;
uniform float uFresnelGlossMask;
uniform float uTransSky;
uniform float uFresnelIntegral;
uniform float uTransIntegral;
uniform float uSkinTransDepth;
uniform float uSkinShadowBlur;
uniform float uNormalSmooth;
struct dX
{
	vec3 hX
	vec3 hY, hZ, ic, he;
	vec3 ec, eh, id;
	vec3 ie;
	vec3 ih;
	vec3 ii;
	vec3 ij;
	float ik;
	float il;
	float im;
	float eC;
};
void dZ(out dX s)
{
	vec4 m;
#ifdef SKIN_NO_SUBDERMIS_TEX
	s.hX = uSubdermisColor;
	s.im = 1.0;
#else
	m = dM(d, uTexRangeSubdermis);
	s.hX = dG(m.xyz);
	s.im = m.w * m.w;
#endif
	s.ij = uTransColor.rgb;
	s.ik = uTransScatter;
#ifdef SKIN_VERSION_1
	s.eC = uSkinShadowBlur * s.im;
#else
	s.il = max(max(s.ij.r, s.ij.g), s.ij.b) * uTransColor.a;
	float io = max(s.hX.r, max(s.hX.g, s.hX.b));
	io = 1.0 - io;
	io *= io;
	io *= io;
	io *= io;
	io = 1.0 - (io * io);
	s.im *= io;
	s.eC = uSkinShadowBlur * s.im * dot(s.hX.rgb, vec3(0.333, 0.334, 0.333));
#endif
#ifndef SKIN_NO_TRANSLUCENCY_TEX
	m = dM(d, uTexRangeTranslucency);
	s.ij *= dG(m.xyz);
#endif
	s.ie = hF(tNormal, d, uNormalSmooth * s.im);
	vec3 iu, iv, iA;
	fK(iu, iv, iA, s.ie);
	s.eh = s.hY = iu + iv + iA;
#ifdef SKIN_VERSION_1
	s.ec = fQ(iu, iv, iA, vec3(1.0, 0.6667, 0.25), s.hX);
#else
	s.ec = fQ(iu, iv, iA, vec3(1.0, 0.6667, 0.25), s.hX * 0.2 + vec3(0.1));
#endif
#ifdef SKIN_VERSION_1
	vec3 iB, iC, iD;
	fK(iB, iC, iD, -s.ie);
	s.id = fO(iB, iC, iD, vec3(1.0, 0.4444, 0.0625), s.ik);
	s.id *= uTransSky;
#else
	s.id = vec3(0.0);
#endif
	s.hZ = s.ic = s.he = vec3(0.0);
	s.hX *= 0.5;
	s.ik *= 0.5;
	s.ih = uFresnelColor.rgb;
	s.ii = uFresnelColor.aaa * vec3(1.0, 0.5, 0.25);
#ifndef SKIN_NO_FUZZ_TEX
	m = dM(d, uTexRangeFuzz);
	s.ih *= dG(m.rgb);
#endif
}
void eK(inout dX s, float iE, float iF, vec3 eH, vec3 dI, vec3 eJ)
{
	float fk = dot(eH, dI);
	float fl = dot(eH, s.ie);
	float eN = saturate((1.0 / 3.1415926) * fk);
	float hi = iE * iE;
	hi *= hi;
	hi = saturate(6.0 * hi);
#ifdef SKIN_VERSION_1
	vec3 iG = fB(fl, s.hX);
#else
	vec3 iG = fj(fk, fl, s.hX);
#endif
	float iH = fA(-fl, s.ik);
	vec3 ic = vec3(iH * iH);
#ifdef SKIN_VERSION_1
#ifdef SHADOW_COUNT
	vec3 iI = vec3(iE);
	float iJ = saturate(hi - 2.0 * (iE * iE));
	iI += iJ * s.hX;
	float iK = iE;
#endif
#else
#ifdef SHADOW_COUNT
	vec3 iI;
	highp vec3 iL = (0.995 * s.hX) + vec3(0.005, 0.005, 0.005);
	highp vec3 iM = vec3(1.0) - iL;
	iL = mix(iL, iM, iE);
	float iN = sqrt(iE);
	vec3 iO = 2.0 * vec3(1.0 - iN);
	iN = 1.0 - iN;
	iN = (1.0 - iN * iN);
	iI = saturate(pow(iL * iN, iO));
	highp float iP = 0.35 / (uSkinTransDepth + 0.001);
	highp float iQ = saturate(iF * iP);
	iQ = saturate(1.0 - iQ);
	iQ *= iQ;
	highp vec3 iR = vec3((-3.0 * iQ) + 3.15);
	highp vec3 iS = (0.9975 * s.ij) + vec3(0.0025, 0.0025, 0.0025);
	highp float io = saturate(10.0 * dot(iS, iS));
	vec3 iK = pow(iS * iQ, iR) * io;
#else
	ic = vec3(0.0);
#endif
#endif
	float hj = fA(fl, s.ii.z);
#ifdef SHADOW_COUNT
	vec3 hk = mix(vec3(1.0), iI, uFresnelOcc);
	vec3 he = hj * hk;
#else
	vec3 he = vec3(hj);
#endif
#ifdef SHADOW_COUNT
	iG *= iI;
	eN *= hi;
	ic *= iK;
#endif 
	s.he = he * eJ + s.he;
	s.ic = ic * eJ + s.ic;
	s.hZ = iG * eJ + s.hZ;
	s.hY = eN * eJ + s.hY;
}
void eQ(out vec3 ei, out vec3 diff_extra, inout dX s, vec3 dO, vec3 dI, float dQ)
{
	s.he *= uFresnelIntegral;
	float fH = dot(dO, dI);
	vec2 hl = fG(vec2(fH, fH), s.ii.xy);
	s.he = s.eh * hl.x + (s.he * hl.y);
	s.he *= s.ih;
	float hm = saturate(1.0 + -uFresnelGlossMask * dQ);
	s.he *= hm * hm;
	s.ic = s.ic * uTransIntegral;
#ifdef SKIN_VERSION_1
	s.hZ = (s.hZ * fD(s.hX)) + s.ec;
#else 
	s.hZ = (s.hZ * fv(s.hX)) + s.ec;
#endif 
	ei = mix(s.hY, s.hZ, s.im);
#ifdef SKIN_VERSION_1
	s.ic = (s.ic + s.id) * s.ij;
	diff_extra = (s.he + s.ic) * s.im;
#else
	ei += s.ic * s.il;
	diff_extra = s.he * s.im;
#endif
}
#endif