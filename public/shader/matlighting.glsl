vec3 eY(vec3 eZ, float fc)
{
	return exp(-0.5 * fc / (eZ * eZ)) / (eZ * 2.5066283);
}

vec3 fd(vec3 eZ)
{
	return vec3(1.0, 1.0, 1.0) / (eZ * 2.5066283);
}

vec3 fe(vec3 ff)
{
	return vec3(-0.5, -0.5, -0.5) / (ff);
}

vec3 fh(vec3 fi, float fc)
{
	return exp(fi * fc);
}

#define SAMPLE_COUNT 21.0
#define SAMPLE_HALF 10.0
#define GAUSS_SPREAD 0.05
vec3 fj(float fk, float fl, vec3 fm)
{
	vec3 fn = vec3(fl, fl, fl);
	fn = 0.8 * fn + vec3(0.2);
	vec3 fo = cos(fn * 3.14159);
	vec3 fu = cos(fn * 3.14159 * 0.5);
	fu *= fu;
	fu *= fu;
	fu *= fu;
	fn = fn + 0.05 * fo * fu * fm;
	fu *= fu;
	fu *= fu;
	fu *= fu;
	fn = fn + 0.1 * fo * fu * fm;
	fn = saturate(fn);
	fn *= fn * 1.2;
	return fn;
}

vec3 fv(vec3 fm)
{
	return vec3(1.0, 1.0, 1.0) / 3.1415926;
}

float fA(float fk, float fm)
{
	return saturate(-fk * fm + fk + fm);
}

vec3 fB(float fk, vec3 fm)
{
	return saturate(-fk * fm + vec3(fk) + fm);
}

float fC(float fm)
{
	return -0.31830988618379 * fm + 0.31830988618379;
}

vec3 fD(vec3 fm)
{
	return -0.31830988618379 * fm + vec3(0.31830988618379);
}

vec3 eT(vec3 dO, vec3 dI, vec3 dP, float fE)
{
	float C = 1.0 - saturate(dot(dO, dI));
	float fF = C * C;
	C *= fF * fF;
	C *= fE;
	return (dP - C * dP) + C * uFresnel;
}

vec2 fG(vec2 fH, vec2 fm)
{
	fH = 1.0 - fH;
	vec2 fI = fH * fH;
	fI *= fI;
	fH = mix(fI, fH * 0.4, fm);
	return fH;
}

vec3 ej(vec3 fJ)
{
	#define c(n) uDiffuseCoefficients[n].xyz
	vec3 G = (c(0) + fJ.y * ((c(1) + c(4) * fJ.x) + c(5) * fJ.z)) + fJ.x * (c(3) + c(7) * fJ.z) + c(2) * fJ.z;
	#undef c
	vec3 sqr = fJ * fJ;
	G += uDiffuseCoefficients[6].xyz * (3.0 * sqr.z - 1.0);
	G += uDiffuseCoefficients[8].xyz * (sqr.x - sqr.y);
	return G;
}

void fK(inout vec3 fL, inout vec3 fM, inout vec3 fN, vec3 fJ)
{
	fL = uDiffuseCoefficients[0].xyz;
	fM = uDiffuseCoefficients[1].xyz * fJ.y;
	fM += uDiffuseCoefficients[2].xyz * fJ.z;
	fM += uDiffuseCoefficients[3].xyz * fJ.x;
	vec3 swz = fJ.yyz * fJ.xzx;
	fN = uDiffuseCoefficients[4].xyz * swz.x;
	fN += uDiffuseCoefficients[5].xyz * swz.y;
	fN += uDiffuseCoefficients[7].xyz * swz.z;
	vec3 sqr = fJ * fJ;
	fN += uDiffuseCoefficients[6].xyz * (3.0 * sqr.z - 1.0);
	fN += uDiffuseCoefficients[8].xyz * (sqr.x - sqr.y);
}

vec3 fO(vec3 fL, vec3 fM, vec3 fN, vec3 fP, float fm)
{
	fP = mix(vec3(1.0), fP, fm);
	return (fL + fM * fP.x) + fN * fP.z;
}

vec3 fQ(vec3 fL, vec3 fM, vec3 fN, vec3 fP, vec3 fR)
{
	vec3 fS = mix(vec3(1.0), fP.yyy, fR);
	vec3 fT = mix(vec3(1.0), fP.zzz, fR);
	return (fL + fM * fS) + fN * fT;
}

vec3 em(vec3 fJ, float dQ)
{
	fJ /= dot(vec3(1.0), abs(fJ));
	vec2 fU = abs(fJ.zx) - vec2(1.0,1.0);
	vec2 fV = vec2(fJ.x < 0.0 ? fU.x : -fU.x, fJ.z < 0.0 ? fU.y : -fU.y);
	vec2 fW = (fJ.y < 0.0) ? fV : fJ.xz;
	fW = vec2(0.5 * (254.0 / 256.0), 0.125 * 0.5 * (254.0 / 256.0)) * fW + vec2(0.5, 0.125 * 0.5);
	float fX = fract(7.0 * dQ);
	fW.y += 0.125 * (7.0 * dQ - fX);
	vec2 fY = fW + vec2(0.0, 0.125);
	vec4 fZ = mix(texture2D(tSkySpecular, fW), texture2D(tSkySpecular, fY), fX);
	vec3 r = fZ.xyz * (7.0 * fZ.w);
	return r * r;
}

float en(vec3 fJ, vec3 hc)
{
	float hd = dot(fJ, hc);
	hd = saturate(1.0 + uHorizonOcclude * hd);
	return hd * hd;
}
