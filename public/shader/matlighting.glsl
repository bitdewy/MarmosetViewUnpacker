vec3 ed(vec3 ee, float ef)
{
	return exp(-0.5 * ef / (ee * ee)) / (ee * 2.5066283);
}

vec3 eh(vec3 ee)
{
	return vec3(1.0, 1.0, 1.0) / (ee * 2.5066283);
}

vec3 ei(vec3 ej)
{
	return vec3(-0.5, -0.5, -0.5) / (ej);
}

vec3 ek(vec3 el, float ef)
{
	return exp(el * ef);
}

# define SAMPLE_COUNT 21.0
# define SAMPLE_HALF 10.0
# define GAUSS_SPREAD 0.05

vec3 em(float en, float eo, vec3 eu)
{
	vec3 ev = vec3(eo, eo, eo);
	ev = 0.8 * ev + vec3(0.2);
	vec3 eA = cos(ev * 3.14159);
	vec3 eB = cos(ev * 3.14159 * 0.5);
	eB *= eB;
	eB *= eB;
	eB *= eB;
	ev = ev + 0.05 * eA * eB * eu;
	eB *= eB;
	eB *= eB;
	eB *= eB;
	ev = ev + 0.1 * eA * eB * eu;
	ev = saturate(ev);
	ev *= ev * 1.2;
	return ev;
}

vec3 eC(vec3 eu)
{
	return vec3(1.0, 1.0, 1.0) / 3.1415926;
}

float eD(float en, float eu)
{
	return saturate(-en * eu + en + eu);
}

vec3 eE(float en, vec3 eu)
{
	return saturate(-en * eu + vec3(en) + eu);
}

float eF(float eu)
{
	return -0.31830988618379 * eu + 0.31830988618379;
}

vec3 eG(vec3 eu)
{
	return -0.31830988618379 * eu + vec3(0.31830988618379);
}

vec3 dY(vec3 T, vec3 N, vec3 U, float eH)
{
	float eI = 1.0 - saturate(dot(T, N));
	float eJ = eI * eI;
	eI *= eJ * eJ;
	eI *= eH;
	return (U - eI * U) + eI * uFresnel;
}

vec2 eK(vec2 eL, vec2 eu)
{
	eL = 1.0 - eL;
	vec2 eM = eL * eL;
	eM *= eM;
	eL = mix(eM, eL * 0.4, eu);
	return eL;
}

vec3 du(vec3 eN)
{
#define c(n) uDiffuseCoefficients[n].xyz
	vec3 C = (c(0) + eN.y * ((c(1) + c(4) * eN.x) + c(5) * eN.z)) + eN.x * (c(3) + c(7) * eN.z) + c(2) * eN.z;
#undef c
	vec3 sqr = eN * eN;
	C += uDiffuseCoefficients[6].xyz * (3.0 * sqr.z - 1.0);
	C += uDiffuseCoefficients[8].xyz * (sqr.x - sqr.y);
	return C;
}

void eO(inout vec3 eP, inout vec3 eQ, inout vec3 eR, vec3 eN)
{
	eP = uDiffuseCoefficients[0].xyz;
	eQ = uDiffuseCoefficients[1].xyz * eN.y;
	eQ += uDiffuseCoefficients[2].xyz * eN.z;
	eQ += uDiffuseCoefficients[3].xyz * eN.x;
	vec3 swz = eN.yyz * eN.xzx;
	eR = uDiffuseCoefficients[4].xyz * swz.x;
	eR += uDiffuseCoefficients[5].xyz * swz.y;
	eR += uDiffuseCoefficients[7].xyz * swz.z;
	vec3 sqr = eN * eN;
	eR += uDiffuseCoefficients[6].xyz * (3.0 * sqr.z - 1.0);
	eR += uDiffuseCoefficients[8].xyz * (sqr.x - sqr.y);
}

vec3 eS(vec3 eP, vec3 eQ, vec3 eR, vec3 eT, float eu)
{
	eT = mix(vec3(1.0), eT, eu);
	return (eP + eQ * eT.x) + eR * eT.z;
}

vec3 eU(vec3 eP, vec3 eQ, vec3 eR, vec3 eT, vec3 eV)
{
	vec3 eW = mix(vec3(1.0), eT.yyy, eV);
	vec3 eX = mix(vec3(1.0), eT.zzz, eV);
	return (eP + eQ * eW) + eR * eX;
}

vec3 dB(vec3 eN, float V)
{
	eN /= dot(vec3(1.0), abs(eN));
	vec2 eY = abs(eN.zx) - vec2(1.0, 1.0);
	vec2 eZ = vec2(eN.x < 0.0 ? eY.x : -eY.x, eN.z < 0.0 ? eY.y : -eY.y);
	vec2 fc = (eN.y < 0.0) ? eZ : eN.xz;
	fc = vec2(0.5 * (254.0 / 256.0), 0.125 * 0.5 * (254.0 / 256.0)) * fc + vec2(0.5, 0.125 * 0.5);
	float fd = fract(7.0 * V);
	fc.y += 0.125 * (7.0 * V - fd);
	vec2 fe = fc + vec2(0.0, 0.125);
	vec4 ff = mix(texture2D(tSkySpecular, fc), texture2D(tSkySpecular, fe), fd);
	vec3 r = ff.xyz * (7.0 * ff.w);
	return r * r;
}

float dC(vec3 eN, vec3 fh)
{
	float fi = dot(eN, fh);
	fi = saturate(1.0 + uHorizonOcclude * fi);
	return fi * fi;
}
