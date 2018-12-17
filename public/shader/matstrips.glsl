#ifdef STRIPVIEW
uniform float uStrips[5];
uniform vec2 uStripRes;
struct dT
{
	float io[5];
	float bg;
};
void dV(out dT iT, inout float dQ, inout vec3 dP)
{
	highp vec2 hA = gl_FragCoord.xy * uStripRes - vec2(1.0, 1.0);
	hA.x += 0.25 * hA.y;
	iT.io[0] = step(hA.x, uStrips[0]);
	iT.io[1] = step(hA.x, uStrips[1]);
	iT.io[2] = step(hA.x, uStrips[2]);
	iT.io[3] = step(hA.x, uStrips[3]);
	iT.io[4] = step(hA.x, uStrips[4]);
	iT.bg = 1.0 - iT.io[4];
	iT.io[4] -= iT.io[3];
	iT.io[3] -= iT.io[2];
	iT.io[2] -= iT.io[1];
	iT.io[1] -= iT.io[0];
	bool iU = iT.io[4] > 0.0;
	dQ = iU ? 0.5 : dQ;
	dP = iU ? vec3(0.1) : dP;
}
vec3 eX(dT iT, vec3 dI, vec3 dF, vec3 dP, float dQ, vec3 ei, vec3 el, vec3 iV) { return iT.io[0] * (dI * 0.5 + vec3(0.5)) + iT.io[1] * dF + iT.io[2] * dP + vec3(iT.io[3] * dQ) + iT.io[4] * (vec3(0.12) + 0.3 * ei + el) + iT.bg * iV; }
#endif