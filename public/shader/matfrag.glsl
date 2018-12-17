#extension GL_OES_standard_derivatives : enable
precision mediump float;
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
uniform sampler2D tAlbedo;
uniform sampler2D tReflectivity;
uniform sampler2D tNormal;
uniform sampler2D tExtras;
uniform sampler2D tSkySpecular;
#ifdef REFRACTION
uniform sampler2D tRefraction;
#endif
uniform vec4 uDiffuseCoefficients[9];
uniform vec3 uCameraPosition;
uniform float uAlphaTest;
uniform vec3 uFresnel;
uniform float uHorizonOcclude;
uniform float uHorizonSmoothing;
#ifdef EMISSIVE
uniform float uEmissiveScale;
uniform vec4 uTexRangeEmissive;
#endif
#ifdef AMBIENT_OCCLUSION
uniform vec4 uTexRangeAO;
#endif
#ifdef REFRACTION
uniform float uRefractionIOREntry;
uniform float uRefractionRayDistance;
uniform vec3 uRefractionTint;
uniform float uRefractionAlbedoTint;
uniform mat4 uRefractionViewProjection;
uniform vec4 uTexRangeRefraction;
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
#define saturate(x) clamp( x, 0.0, 1.0 )
#include <matsampling.glsl>
#include <matlighting.glsl>
#include <matshadows.glsl>
#include <matskin.glsl>
#include <matmicrofiber.glsl>
#include <matstrips.glsl>
#ifdef TRANSPARENCY_DITHER
#include <matdither.glsl>
#endif
void main(void)
{
	vec4 m = texture2D(tAlbedo, d);
	vec3 dF = dG(m.xyz);
	float e = m.w;
#ifdef VERTEX_COLOR
	{
		vec3 dH = dD.xyz;
	#ifdef VERTEX_COLOR_SRGB
		dH = dH * (dH * (dH * 0.305306011 + vec3(0.682171111)) + vec3(0.012522878));
	#endif
		dF *= dH;
	#ifdef VERTEX_COLOR_ALPHA
		e *= dD.w;
	#endif
	}
#endif
#ifdef ALPHA_TEST
	if (e < uAlphaTest)
	{
		discard;
	}
#endif
#ifdef TRANSPARENCY_DITHER
	e = (e > f(d.x)) ? 1.0 : e;
#endif
	vec3 dI = dJ(texture2D(tNormal, d).xyz);
#ifdef ANISO
#ifdef ANISO_NO_DIR_TEX
	vec3 dK = dL(uAnisoTangent);
#else
	m = dM(d, uTexRangeAniso);
	vec3 dK = 2.0 * m.xyz - vec3(1.0);
	dK = dL(dK);
#endif
	dK = dK - dI * dot(dK, dI);
	dK = normalize(dK);
	vec3 dN = dK * uAnisoStrength;
#endif
	vec3 dO = normalize(uCameraPosition - dv);
	m = texture2D(tReflectivity, d);
	vec3 dP = dG(m.xyz);
	float dQ = m.w;
	float dR = dQ;
#ifdef HORIZON_SMOOTHING
	float dS = dot(dO, dI);
	dS = uHorizonSmoothing - dS * uHorizonSmoothing;
	dQ = mix(dQ, 1.0, dS * dS);
#endif
#ifdef STRIPVIEW
	dT dU;
	dV(dU, dQ, dP);
#endif
	float dW = 1.0;
#ifdef AMBIENT_OCCLUSION
#ifdef AMBIENT_OCCLUSION_SECONDARY_UV
	dW = dM(dE, uTexRangeAO).x;
#else
	dW = dM(d, uTexRangeAO).x;
#endif
	dW *= dW;
#endif
#if defined(SKIN)
	dX dY;
	dZ(dY);
	dY.ec *= dW;
#elif defined(MICROFIBER)
	ed ee;
	ef(ee, dI);
	ee.eh *= dW;
#else
	vec3 ei = ej(dI);
	ei *= dW;
#endif
	vec3 ek = reflect(-dO, dI);
#ifdef ANISO
	vec3 rt = ek - (0.5 * dN * dot(ek,dK));
	vec3 el = em(rt, mix(dQ, 0.5 * dQ, uAnisoStrength));
#else
	vec3 el = em(ek, dQ);
#endif
	el *= en(ek, dC);
#ifdef LIGHT_COUNT
	highp float eo = 10.0 / log2(dQ * 0.968 + 0.03);
	eo *= eo;
	float eu = eo * (1.0 / (8.0 * 3.1415926)) + (4.0 / (8.0 * 3.1415926));
	eu = min(eu, 1.0e3);
#ifdef SHADOW_COUNT
	ev eA;
#ifdef SKIN
#ifdef SKIN_VERSION_1
	eB(eA, SHADOW_KERNEL + SHADOW_KERNEL * dY.eC);
#else
	eD eE;
	float eF = SHADOW_KERNEL + SHADOW_KERNEL * dY.eC;
	eG(eE, eF);
	eB(eA, eF);
#endif
#else
	eB(eA, SHADOW_KERNEL);
#endif
#endif
#ifdef ANISO
	eu *= uAnisoIntegral;
#endif
	for (int k = 0; k < LIGHT_COUNT; ++k)
	{
		vec3 eH = uLightPositions[k].xyz - dv * uLightPositions[k].w;
		float eI = inversesqrt(dot(eH, eH));
		eH *= eI;
		float a = saturate(uLightParams[k].z / eI);
		a = 1.0 + a * (uLightParams[k].x + uLightParams[k].y * a);
		float s = saturate(dot(eH, uLightDirections[k]));
		s = saturate(uLightSpot[k].y - uLightSpot[k].z * (1.0 - s * s));
		vec3 eJ = (a * s) * uLightColors[k].xyz;
	#if defined(SKIN)
	#ifdef SHADOW_COUNT
	#ifdef SKIN_VERSION_1
		eK(dY, eA.eL[k], 1.0, eH, dI, eJ);
	#else
		eK(dY, eA.eL[k], eE.eE[k], eH, dI, eJ);
	#endif
	#else
		eK(dY, 1.0, 0.0, eH, dI, eJ);
	#endif
	#elif defined(MICROFIBER)
	#ifdef SHADOW_COUNT
		eM(ee, eA.eL[k], eH, dI, eJ);
	#else
		eM(ee, 1.0, eH, dI, eJ);
	#endif
	#else
		float eN = saturate((1.0 / 3.1415926) * dot(eH, dI));
	#ifdef SHADOW_COUNT
		eN *= eA.eL[k];
	#endif
		ei += eN * eJ;
	#endif
		vec3 eO = eH + dO;
	#ifdef ANISO
		eO = eO - (dN * dot(eO, dK));
	#endif
		eO = normalize(eO);
		float eP = eu * pow(saturate(dot(eO, dI)), eo);
	#ifdef SHADOW_COUNT
		eP *= eA.eL[k];
	#endif
		el += eP * eJ;
	}
#endif
#if defined(SKIN)
	vec3 ei, diff_extra;
	eQ(ei, diff_extra, dY, dO, dI, dQ);
#elif defined(MICROFIBER)
	vec3 ei, diff_extra;
	eR(ei, diff_extra, ee, dO, dI, dQ);
#endif
	vec3 eS = eT(dO, dI, dP, dQ * dQ);
	el *= eS;
#ifdef REFRACTION
	vec4 eU;
	{
		vec3 G = refract(-dO, dI, uRefractionIOREntry);
		G = dv + G * uRefractionRayDistance;
		vec4 eV = uRefractionViewProjection[0] * G.x + (uRefractionViewProjection[1] * G.y + (uRefractionViewProjection[2] * G.z + uRefractionViewProjection[3]));
		vec2 c = eV.xy / eV.w;
		c = 0.5 * c + vec2(0.5, 0.5);
		vec2 i = mod(floor(c), 2.0);
		c = fract(c);
		c.x = i.x > 0.0 ? 1.0 - c.x : c.x;
		c.y = i.y > 0.0 ? 1.0 - c.y : c.y;
		eU.rgb = texture2D(tRefraction, c).xyz;
		eU.rgb = mix(eU.rgb, eU.rgb * dF, uRefractionAlbedoTint);
		eU.rgb = eU.rgb - eU.rgb * eS;
		eU.rgb *= uRefractionTint;
	#ifdef REFRACTION_NO_MASK_TEX
		eU.a = 1.0;
	#else
		eU.a = dM(d, uTexRangeRefraction).x;
	#endif
	}
#endif
#ifdef DIFFUSE_UNLIT
	gl_FragColor.xyz = dF;
#else
	gl_FragColor.xyz = ei * dF;
#endif
#ifdef REFRACTION
	gl_FragColor.xyz = mix(gl_FragColor.xyz, eU.rgb, eU.a);
#endif
	gl_FragColor.xyz += el;
#if defined(SKIN) || defined(MICROFIBER)
	gl_FragColor.xyz += diff_extra;
#endif
#ifdef EMISSIVE
#ifdef EMISSIVE_SECONDARY_UV
	vec2 eW = dE;
#else
	vec2 eW = d;
#endif
	gl_FragColor.xyz += uEmissiveScale * dG(dM(eW, uTexRangeEmissive).xyz);
#endif
#ifdef STRIPVIEW
	gl_FragColor.xyz = eX(dU, dI, dF, dP, dR, ei, el, gl_FragColor.xyz);
#endif
#ifdef NOBLEND
	gl_FragColor.w = 1.0;
#else
	gl_FragColor.w = e;
#endif
}