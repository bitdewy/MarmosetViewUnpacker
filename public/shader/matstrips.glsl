#ifdef STRIPVIEW
uniform float uStrips[5];
uniform vec2 uStripRes;
struct Y
{
	float hB[5];
	float bg;
};

void dc(out Y hX, inout float V, inout vec3 U)
{
	highp vec2 fE = gl_FragCoord.xy * uStripRes - vec2(1.0, 1.0);
	fE.x += 0.25 * fE.y;
	hX.hB[0] = step(fE.x, uStrips[0]);
	hX.hB[1] = step(fE.x, uStrips[1]);
	hX.hB[2] = step(fE.x, uStrips[2]);
	hX.hB[3] = step(fE.x, uStrips[3]);
	hX.hB[4] = step(fE.x, uStrips[4]);
	hX.bg = 1.0 - hX.hB[4];
	hX.hB[4] -= hX.hB[3];
	hX.hB[3] -= hX.hB[2];
	hX.hB[2] -= hX.hB[1];
	hX.hB[1] -= hX.hB[0];
	bool hY = hX.hB[4] > 0.0;
	V = hY ? 0.5 : V;
	U = hY ? vec3(0.1) : U;
}
vec3 ec(Y hX, vec3 N, vec3 K, vec3 U, float V, vec3 dn, vec3 dA, vec3 hZ)
{
	return hX.hB[0] * (N * 0.5 + vec3(0.5)) + hX.hB[1] * K + hX.hB[2] * U + vec3(hX.hB[3] * V) + hX.hB[4] * (vec3(0.12) + 0.3 * dn + dA) + hX.bg * hZ;
}
#endif
