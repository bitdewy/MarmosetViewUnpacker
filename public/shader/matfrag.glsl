#extension GL_OES_standard_derivatives : enable

precision mediump float;
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

uniform sampler2D tAlbedo;
uniform sampler2D tReflectivity;
uniform sampler2D tNormal;
uniform sampler2D tExtras;
uniform sampler2D tSkySpecular;
uniform vec4 uDiffuseCoefficients[9];
uniform vec3 uCameraPosition;
uniform vec3 uFresnel;
uniform float uAlphaTest;
uniform float uHorizonOcclude;
uniform float uHorizonSmoothing;

#ifdef EMISSIVE
	uniform float uEmissiveScale;
	uniform vec4 uTexRangeEmissive;
#endif

#ifdef AMBIENT_OCCLUSION
	uniform vec4 uTexRangeAO;
#endif

#ifdef LIGHT_COUNT
	uniform vec4 uLightPositions[LIGHT_COUNT];
	uniform vec3 uLightDirections[LIGHT_COUNT];
	uniform vec3 uLightColors[LIGHT_COUNT];
	uniform vec3 uLightParams[LIGHT_COUNT];
	uniform vec3 uLightSpot[LIGHT_COUNT];
#endif

#ifdef ANISO
	uniform float uAnisoStrength;
	uniform vec3 uAnisoTangent;
	uniform float uAnisoIntegral;
	uniform vec4 uTexRangeAniso;
#endif

#define saturate(x) clamp(x, 0.0, 1.0)
float dY(float dZ, float ec)
{
	return saturate(-dZ * ec + dZ + ec);
}

vec3 ed(float dZ, vec3 ec)
{
	return saturate(-dZ * ec + vec3(dZ) + ec);
}

float ee(float ec)
{
	return -0.31830988618379 * ec + 0.31830988618379;
}

vec3 ef(vec3 ec)
{
	return -0.31830988618379 * ec + vec3(0.31830988618379);
}

vec3 dV(vec3 T, vec3 N, vec3 U, float eh)
{
	float ei = 1.0 - saturate(dot(T, N));
	float ej = ei * ei;
	ei *= ej * ej;
	ei *= eh;
	return(U - ei * U) + ei * uFresnel;
}

vec2 ek(vec2 el, vec2 ec)
{
	el = 1.0 - el;
	vec2 em = el * el;
	em *= em;
	el = mix(em, el * 0.4, ec);
	return el;
}

vec3 du(vec3 en)
{
#define c(n) uDiffuseCoefficients[n].xyz
	vec3 C = (c(0) + en.y*((c(1) + c(4)*en.x) + c(5)*en.z)) + en.x*(c(3) + c(7)*en.z) + c(2)*en.z;
#undef c
	vec3 sqr = en*en;
	C += uDiffuseCoefficients[6].xyz*(3.0*sqr.z - 1.0);
	C += uDiffuseCoefficients[8].xyz*(sqr.x - sqr.y);
	return C;
}
void eo(inout vec3 eu, inout vec3 ev, inout vec3 eA, vec3 en)
{
	eu = uDiffuseCoefficients[0].xyz;
	ev = uDiffuseCoefficients[1].xyz*en.y;
	ev += uDiffuseCoefficients[2].xyz*en.z;
	ev += uDiffuseCoefficients[3].xyz*en.x;
	vec3 swz = en.yyz*en.xzx;
	eA = uDiffuseCoefficients[4].xyz*swz.x;
	eA += uDiffuseCoefficients[5].xyz*swz.y;
	eA += uDiffuseCoefficients[7].xyz*swz.z;
	vec3 sqr = en*en;
	eA += uDiffuseCoefficients[6].xyz*(3.0*sqr.z - 1.0);
	eA += uDiffuseCoefficients[8].xyz*(sqr.x - sqr.y);
}

vec3 eB(vec3 eu, vec3 ev, vec3 eA, vec3 eC, float ec)
{
	eC = mix(vec3(1.0), eC, ec);
	return (eu + ev*eC.x) + eA*eC.z;
}

vec3 eD(vec3 eu, vec3 ev, vec3 eA, vec3 eC, vec3 eE)
{
	vec3 eF = mix(vec3(1.0), eC.yyy, eE);
	vec3 eG = mix(vec3(1.0), eC.zzz, eE);
	return(eu + ev*eF) + eA*eG;
}

vec3 dB(vec3 en, float V)
{
	en /= dot(vec3(1.0), abs(en));
	vec2 eH = abs(en.zx) - vec2(1.0, 1.0);
	vec2 eI = vec2(en.x < 0.0 ? eH.x : -eH.x, en.z < 0.0 ? eH.y : -eH.y);
	vec2 eJ = (en.y < 0.0) ? eI : en.xz; eJ = vec2(0.5*(254.0 / 256.0), 0.125*0.5*(254.0 / 256.0))*eJ + vec2(0.5, 0.125*0.5);
	float eK = fract(7.0*V);
	eJ.y += 0.125*(7.0*V - eK);
	vec2 eL = eJ + vec2(0.0, 0.125);
	vec4 eM = mix(texture2D(tSkySpecular, eJ), texture2D(tSkySpecular, eL), eK);
	vec3 r = eM.xyz*(7.0*eM.w);
	return r*r;
}

float dC(vec3 en, vec3 eN)
{
	float eO = dot(en, eN);
	eO = saturate(1.0 + uHorizonOcclude*eO);
	return eO*eO;
}
vec3 L(vec3 c)
{
	return c*c;
}

vec3 O(vec3 n)
{
	vec3 eX = E;
	vec3 eY = F;
	vec3 eZ = gl_FrontFacing ? G : -G;
#ifdef TSPACE_RENORMALIZE
	eZ = normalize(eZ);
#endif
#ifdef TSPACE_ORTHOGONALIZE
	eX -= dot(eX, eZ)*eZ;
#endif
#ifdef TSPACE_RENORMALIZE
	eX = normalize(eX);
#endif
#ifdef TSPACE_ORTHOGONALIZE
	eY = (eY - dot(eY, eZ)*eZ) - dot(eY, eX)*eX;
#endif
#ifdef TSPACE_RENORMALIZE
	eY = normalize(eY);
#endif
#ifdef TSPACE_COMPUTE_BITANGENT
	vec3 fc = cross(eZ, eX); eY = dot(fc, eY)<0.0 ? -fc : fc;
#endif
	n = 2.0*n - vec3(1.0);
	return normalize(eX*n.x + eY*n.y + eZ*n.z);
}

vec3 Q(vec3 t)
{
	vec3 eZ = gl_FrontFacing ? G : -G;
	return normalize(E*t.x + F*t.y + eZ*t.z);
}

vec4 R(vec2 fd, vec4 fe)
{
#if GL_OES_standard_derivatives
	vec2 ff = fract(fd);
	vec2 fh = fwidth(ff);
	float fi = (fh.x + fh.y)>0.5 ? -6.0 : 0.0;
	return texture2D(tExtras, ff*fe.xy + fe.zw, fi);
#else
	return texture2D(tExtras, fract(fd)*fe.xy + fe.zw);
#endif
}
vec3 fj(sampler2D fk, vec2 fl, float fm)
{
	vec3 n = texture2D(fk, fl, fm*4.0).xyz;
	return O(n);
}

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

#ifdef MICROFIBER
uniform vec4 uTexRangeFuzz;
uniform float uFresnelIntegral;
uniform vec4 uFresnelColor;
uniform float uFresnelOcc;
uniform float uFresnelGlossMask;

struct dj {
	vec3 dm;
	vec3 dQ;
	vec3 eP;
	vec3 eQ;
	vec3 eR;
};

void dl(out dj s, vec3 N)
{
	s.dm = s.dQ = du(N);
	s.eP = vec3(0.0);
	s.eQ = uFresnelColor.rgb;
	s.eR = uFresnelColor.aaa * vec3(1.0, 0.5, 0.25);
#ifndef MICROFIBER_NO_FUZZ_TEX
	vec4 J = R(j, uTexRangeFuzz);
	s.eQ *= L(J.rgb);
#endif
}

void dP(inout dj s, float eS, vec3 dK, vec3 N, vec3 dM)
{
	float dZ = dot(dK, N);
	float dQ = saturate((1.0 / 3.1415926) * dZ);
	float eT = dY(dZ, s.eR.z);
#ifdef SHADOW_COUNT
	dQ *= eS;
	float eU = mix(1.0, eS, uFresnelOcc);
	float eP = eT * eU;
#else
	float eP = eT;
#endif
	s.eP = eP * dM + s.eP;
	s.dQ = dQ * dM + s.dQ;
}

void dU(out vec3 dn, out vec3 diff_extra, inout dj s, vec3 T, vec3 N, float V)
{
	s.eP *= uFresnelIntegral;
	float el = dot(T, N);
	vec2 eV = ek(vec2(el, el), s.eR.xy);
	s.eP = s.dm * eV.x + (s.eP * eV.y);
	s.eP *= s.eQ;
	float eW = saturate(1.0 + -uFresnelGlossMask * V);
	s.eP *= eW * eW;
	dn = s.dQ;
	diff_extra = s.eP;
}
#endif

#ifdef STRIPVIEW
uniform float uStrips[5];
uniform vec2 uStripRes;

struct Y
{
	float hi[5];
	float bg;
};

void dc(out Y hj, inout float V, inout vec3 U)
{
	highp vec2 fd = gl_FragCoord.xy*uStripRes - vec2(1.0, 1.0);
	fd.x += 0.25*fd.y;
	hj.hi[0] = step(fd.x, uStrips[0]);
	hj.hi[1] = step(fd.x, uStrips[1]);
	hj.hi[2] = step(fd.x, uStrips[2]);
	hj.hi[3] = step(fd.x, uStrips[3]);
	hj.hi[4] = step(fd.x, uStrips[4]);
	hj.bg = 1.0 - hj.hi[4];
	hj.hi[4] -= hj.hi[3];
	hj.hi[3] -= hj.hi[2];
	hj.hi[2] -= hj.hi[1];
	hj.hi[1] -= hj.hi[0];
	bool hk = hj.hi[4]>0.0;
	V = hk ? 0.5 : V;
	U = hk ? vec3(0.1) : U;
}

vec3 dX(Y hj, vec3 N, vec3 K, vec3 U, float V, vec3 dn, vec3 dA, vec3 hl)
{
	return hj.hi[0] * (N*0.5 + vec3(0.5)) + hj.hi[1] * K + hj.hi[2] * U + vec3(hj.hi[3] * V) + hj.hi[4] * (vec3(0.12) + 0.3*dn + dA) + hj.bg*hl;
}
#endif

#ifdef TRANSPARENCY_DITHER
	float l(highp float B)
	{
		highp float C = 0.5 * fract(gl_FragCoord.x * 0.5) + 0.5 * fract(gl_FragCoord.y * 0.5);
		return 0.4 + 0.6 * fract(C + 3.141592e6 * B);
	}
#endif

void main(void)
{
	vec4 J = texture2D(tAlbedo, j);
	vec3 K = L(J.xyz);
	float k = J.w;
#ifdef VERTEX_COLOR
	{
		vec3 M = H.xyz;
#ifdef VERTEX_COLOR_SRGB
		M = M*(M*(M*0.305306011 + vec3(0.682171111)) + vec3(0.012522878));
#endif
		K *= M;
#ifdef VERTEX_COLOR_ALPHA
		k *= H.w;
#endif
	}
#endif

#ifdef ALPHA_TEST
	if ( k < uAlphaTest)
	{
		discard;
	}

#endif

#ifdef TRANSPARENCY_DITHER
	k = (k > l(j.x)) ? 1.0 : k;
#endif
	vec3 N = O(texture2D(tNormal, j).xyz);
#ifdef ANISO

#ifdef ANISO_NO_DIR_TEX
	vec3 P = Q(uAnisoTangent);
#else
	J = R(j, uTexRangeAniso);
	vec3 P = 2.0 * J.xyz - vec3(1.0);
	P = Q(P);
#endif
	P = P - N * dot(P, N);
	P = normalize(P);
	vec3 S = P * uAnisoStrength;
#endif
	vec3 T = normalize(uCameraPosition - D);
	J = texture2D(tReflectivity, j);
	vec3 U = L(J.xyz);
	float V = J.w;
	float W = V;
#ifdef HORIZON_SMOOTHING
	float X = dot(T, N);
	X = uHorizonSmoothing - X * uHorizonSmoothing;
	V = mix(V, 1.0, X * X);
#endif

#ifdef STRIPVIEW
	Y Z;
	dc(Z, V, U);
#endif
	float dd = 1.0;

#ifdef AMBIENT_OCCLUSION

#ifdef AMBIENT_OCCLUSION_SECONDARY_UV
	dd = R(I, uTexRangeAO).x;
#else
	dd = R(j, uTexRangeAO).x;
#endif
	dd *= dd;
#endif
#if defined(SKIN)
	de df;
	dh(df);
	df.di *= dd;
#elif defined(MICROFIBER)
	dj dk;
	dl(dk, N);
	dk.dm *= dd; 
#else
	vec3 dn = du(N);
	dn *= dd;
#endif
	vec3 dv = reflect(-T, N);

#ifdef ANISO
	vec3 rt = dv - (0.5 * S * dot(dv, P));
	vec3 dA = dB(rt, mix(V, 0.5 * V, uAnisoStrength));
#else
	vec3 dA = dB(dv, V);
#endif
	dA *= dC(dv, G);
#ifdef LIGHT_COUNT
	highp float dD = 10.0 / log2(V * 0.968 + 0.03);
	dD *= dD;
	float dE = dD * (1.0 / (8.0 * 3.1415926)) + (4.0 / (8.0 * 3.1415926));
	dE = min(dE, 1.0e3);
#ifdef SHADOW_COUNT
	dF dG;
	dH(dG, SHADOW_KERNEL);
#ifdef SKIN
	dF dI; dH(dI, SHADOW_KERNEL + SHADOW_KERNEL*df.dJ);
#endif
#endif

#ifdef ANISO
	dE *= uAnisoIntegral;
#endif
	for (int u = 0; u < LIGHT_COUNT; ++u)
	{
		vec3 dK = uLightPositions[u].xyz - D * uLightPositions[u].w;
		float dL = inversesqrt(dot(dK, dK));
		dK *= dL;
		float a = saturate(uLightParams[u].z / dL);
		a = 1.0 + a * (uLightParams[u].x + uLightParams[u].y*a);
		float s = saturate(dot(dK, uLightDirections[u]));
		s = saturate(uLightSpot[u].y - uLightSpot[u].z * (1.0 - s * s));
		vec3 dM = (a * s) * uLightColors[u].xyz;
#if defined(SKIN)

#ifdef SHADOW_COUNT
		dN(df, dG.dO[u], dI.dO[u], dK, N, dM);
#else
		dN(df, 1.0, 1.0, dK, N, dM);
#endif
#elif defined(MICROFIBER)

#ifdef SHADOW_COUNT
		dP(dk, dG.dO[u], dK, N, dM);
#else
		dP(dk, 1.0, dK, N, dM);
#endif
#else
		float dQ = saturate((1.0 / 3.1415926) * dot(dK, N));
#ifdef SHADOW_COUNT
		dQ *= dG.dO[u];
#endif
		dn += dQ * dM;
#endif
		vec3 dR = dK + T;
#ifdef ANISO
		dR = dR - (S * dot(dR, P));
#endif
		dR = normalize(dR);
		float dS = dE * pow(saturate(dot(dR, N)), dD);
#ifdef SHADOW_COUNT
		dS *= dG.dO[u];
#endif
		dA += dS * dM;
	}
#endif

#if defined(SKIN)
	vec3 dn, diff_extra;
	dT(dn, diff_extra, df, T, N, V);
#elif defined(MICROFIBER)
	vec3 dn, diff_extra;
	dU(dn, diff_extra, dk, T, N, V);
#endif
	dA *= dV(T, N, U, V*V);
#ifdef DIFFUSE_UNLIT
	gl_FragColor.xyz = K + dA;
#else
	gl_FragColor.xyz = dn * K + dA;
#endif

#if defined(SKIN) || defined(MICROFIBER)
	gl_FragColor.xyz += diff_extra;
#endif

#ifdef EMISSIVE
#ifdef EMISSIVE_SECONDARY_UV
	vec2 dW = I;
#else
	vec2 dW = j;
#endif
	gl_FragColor.xyz += uEmissiveScale * L(R(dW, uTexRangeEmissive).xyz);
#endif

#ifdef STRIPVIEW
	gl_FragColor.xyz = dX(Z, N, K, U, W, dn, dA, gl_FragColor.xyz);
#endif

#ifdef NOBLEND
	gl_FragColor.w = 1.0;
#else
	gl_FragColor.w = k;
#endif
}
