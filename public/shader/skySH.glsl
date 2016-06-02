precision mediump float;
uniform vec4 uSkyCoefficients[9];
uniform float uAlpha;
varying vec3 hR;

void main(void)
{
	vec3 C = normalize(hR);
	vec3 r = uSkyCoefficients[0].xyz;
	r += uSkyCoefficients[1].xyz*C.y;
	r += uSkyCoefficients[2].xyz*C.z;
	r += uSkyCoefficients[3].xyz*C.x;
	vec3 swz = C.yyz*C.xzx;
	r += uSkyCoefficients[4].xyz*swz.x;
	r += uSkyCoefficients[5].xyz*swz.y;
	r += uSkyCoefficients[7].xyz*swz.z;
	vec3 sqr = C*C;
	r += uSkyCoefficients[6].xyz*(3.0*sqr.z - 1.0);
	r += uSkyCoefficients[8].xyz*(sqr.x - sqr.y);
	gl_FragColor.xyz = r;
	gl_FragColor.w = uAlpha;
}
