#ifdef MICROFIBER
uniform vec4 uTexRangeFuzz;
uniform vec4 uFresnelColor;
uniform float uFresnelIntegral;
uniform float uFresnelOcc;
uniform float uFresnelGlossMask;

struct ed
{
	vec3 eh;
	vec3 eN;
	vec3 he;
	vec3 hf;
	vec3 hh;
};

void ef(out ed s, vec3 dI)
{
	s.eh = s.eN = ej(dI);
	s.he = vec3(0.0);
	s.hf = uFresnelColor.rgb;
	s.hh = uFresnelColor.aaa * vec3(1.0, 0.5, 0.25);
#ifndef MICROFIBER_NO_FUZZ_TEX
	vec4 m = dM(d, uTexRangeFuzz);
	s.hf *= dG(m.rgb);
#endif
}

void eM(inout ed s, float hi, vec3 eH, vec3 dI, vec3 eJ)
{
	float fk = dot(eH, dI);
	float eN = saturate((1.0 / 3.1415926) * fk);
	float hj = fA(fk, s.hh.z);
#ifdef SHADOW_COUNT
	eN *= hi;
	float hk = mix(1.0, hi, uFresnelOcc);
	float he = hj * hk;
#else
	float he = hj;
#endif
	s.he = he * eJ + s.he;
	s.eN = eN * eJ + s.eN;
}

void eR(out vec3 ei, out vec3 diff_extra, inout ed s, vec3 dO, vec3 dI, float dQ)
{
	s.he *= uFresnelIntegral;
	float fH = dot(dO, dI);
	vec2 hl = fG(vec2(fH, fH), s.hh.xy);
	s.he = s.eh * hl.x + (s.he * hl.y);
	s.he *= s.hf;
	float hm = saturate(1.0 + -uFresnelGlossMask * dQ);
	s.he *= hm * hm;
	ei = s.eN;
	diff_extra = s.he;
}
#endif