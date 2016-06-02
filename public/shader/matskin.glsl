#ifdef SKIN
uniform vec4 uTexRangeSubdermis;
uniform vec4 uTexRangeTranslucency;
uniform vec4 uTexRangeFuzz;
uniform vec3 uSubdermisColor;
uniform vec4 uTransColor;
uniform vec4 uFresnelColor;
uniform float uFresnelOcc;
uniform float uFresnelGlossMask;
uniform float uTransSky;
uniform float uFresnelIntegral;
uniform float uTransIntegral;
uniform float uSkinShadowBlur;
uniform float uNormalSmooth;

struct de
{
	vec3 fH;
	vec3 fI, fJ, fK, eP;
	vec3 di, dm, fL;
	vec3 fM;
	vec3 fN;
	vec3 fO;
	vec3 fP;
	float fQ;
	float fR;
	float dJ;
};

void dh(out de s)
{
	vec4 J;
#ifdef SKIN_NO_SUBDERMIS_TEX
	s.fH = uSubdermisColor; s.fR = 1.0;
#else 
	J = R(j, uTexRangeSubdermis); s.fH = L(J.xyz); s.fR = J.w*J.w;
#endif
	s.fP = uTransColor.rgb; s.fQ = uTransColor.a;
#ifndef SKIN_NO_TRANSLUCENCY_TEX
	J = R(j, uTexRangeTranslucency); s.fP *= L(J.xyz);
#endif
	s.fM = fj(tNormal, j, uNormalSmooth*s.fR);
	vec3 fS, fT, fU;
	eo(fS, fT, fU, s.fM);
	s.dm = s.fI = fS + fT + fU;
	s.di = eD(fS, fT, fU, vec3(1.0, 0.6667, 0.25), s.fH);
	vec3 fV, fW, fX;
	eo(fV, fW, fX, -s.fM);
	s.fL = eB(fV, fW, fX, vec3(1.0, 0.4444, 0.0625), s.fQ);
	s.fL *= uTransSky;
	s.fJ = s.fK = s.eP = vec3(0.0);
	s.dJ = uSkinShadowBlur*s.fR;
	s.fH *= 0.5;
	s.fQ *= 0.5;
	s.fN = uFresnelColor.rgb;
	s.fO = uFresnelColor.aaa*vec3(1.0, 0.5, 0.25);
#ifndef SKIN_NO_FUZZ_TEX
	J = R(j, uTexRangeFuzz);
	s.fN *= L(J.rgb);
#endif
}

void dN(inout de s, float eS, float fY, vec3 dK, vec3 N, vec3 dM)
{
	float dZ = dot(dK, N);
	float fZ = dot(dK, s.fM);
	float dQ = saturate((1.0 / 3.1415926)*dZ);
	vec3 hc = ed(fZ, s.fH);
	float hd = dY(-fZ, s.fQ);
	vec3 fK = vec3(hd*hd);
#ifdef SHADOW_COUNT
	float he = fY;
	vec3 hf = vec3(fY);
	float hh = saturate(eS - 2.0*(fY*fY));
	hf += hh*s.fH;
#endif
	float eT = dY(fZ, s.fO.z);
#ifdef SHADOW_COUNT
	vec3 eU = mix(vec3(1.0), hf, uFresnelOcc);
	vec3 eP = eT*eU;
#else
	vec3 eP = vec3(eT);
#endif
#ifdef SHADOW_COUNT
	hc *= hf;
	fK *= he;
	dQ *= eS;
#endif
	s.eP = eP*dM + s.eP;
	s.fK = fK*dM + s.fK;
	s.fJ = hc*dM + s.fJ;
	s.fI = dQ*dM + s.fI;
}

void dT(out vec3 dn, out vec3 diff_extra, inout de s, vec3 T, vec3 N, float V)
{
	s.eP *= uFresnelIntegral;
	float el = dot(T, N);
	vec2 eV = ek(vec2(el, el), s.fO.xy);
	s.eP = s.dm*eV.x + (s.eP*eV.y);
	s.eP *= s.fN;
	float eW = saturate(1.0 + -uFresnelGlossMask*V);
	s.eP *= eW*eW;
	s.fJ = s.fJ*ef(s.fH) + s.di;
	s.fK = s.fK*uTransIntegral + s.fL;
	s.fK *= s.fP;
	dn = mix(s.fI, s.fJ, s.fR);
	diff_extra = (s.eP + s.fK)*s.fR;
}
#endif
