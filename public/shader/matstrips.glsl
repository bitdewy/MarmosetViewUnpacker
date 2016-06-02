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
