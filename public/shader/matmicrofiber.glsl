#ifdef MICROFIBER
uniform vec4 uTexRangeFuzz;
uniform float uFresnelIntegral;
uniform vec4 uFresnelColor;
uniform float uFresnelOcc;
uniform float uFresnelGlossMask;

struct dj
{
	vec3 dm;
	vec3 dT;
	vec3 fj;
	vec3 fk;
	vec3 fl;
};

void dl(out dj s, vec3 N)
{
	s.dm = s.dT = du(N);
	s.fj = vec3(0.0);
	s.fk = uFresnelColor.rgb;
	s.fl = uFresnelColor.aaa * vec3(1.0, 0.5, 0.25);
#ifndef MICROFIBER_NO_FUZZ_TEX
	vec4 J = R(j, uTexRangeFuzz);
	s.fk *= L(J.rgb);
#endif
}

void dS(inout dj s, float fm, vec3 dN, vec3 N, vec3 dP)
{
	float en = dot(dN, N);
	float dT = saturate((1.0 / 3.1415926) * en);
	float fn = eD(en, s.fl.z);
#ifdef SHADOW_COUNT
	dT *= fm;
	float fo = mix(1.0, fm, uFresnelOcc);
	float fj = fn * fo;
#else
	float fj = fn;
#endif
	s.fj = fj * dP + s.fj;
	s.dT = dT * dP + s.dT;
}

void dX(out vec3 dn, out vec3 diff_extra, inout dj s, vec3 T, vec3 N, float V)
{
	s.fj *= uFresnelIntegral;
	float eL = dot(T, N);
	vec2 fu = eK(vec2(eL, eL), s.fl.xy);
	s.fj = s.dm * fu.x + (s.fj * fu.y);
	s.fj *= s.fk;
	float fv = saturate(1.0 + -uFresnelGlossMask * V);
	s.fj *= fv * fv;
	dn = s.dT;
	diff_extra = s.fj;
}
#endif
