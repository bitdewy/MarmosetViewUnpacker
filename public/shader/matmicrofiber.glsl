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
