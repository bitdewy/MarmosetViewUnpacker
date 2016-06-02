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
