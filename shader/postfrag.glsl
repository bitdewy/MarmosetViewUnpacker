precision mediump float;
uniform sampler2D tInput;
#ifdef BLOOM
uniform sampler2D tBloom;
#endif
#ifdef GRAIN
uniform sampler2D tGrain;
#endif
#ifdef COLOR_LUT
uniform sampler2D tLUT;
#endif
uniform vec3 uScale;
uniform vec3 uBias;
uniform vec3 uSaturation;
uniform vec4 uSharpenKernel;
uniform vec3 uSharpness;
uniform vec3 uBloomColor;
uniform vec4 uVignetteAspect;
uniform vec4 uVignette;
uniform vec4 uGrainCoord;
uniform vec2 uGrainScaleBias;
varying vec2 d;
vec3 hv(vec3 c)
{
	vec3 hA = sqrt(c);
	return(hA - hA*c) + c*(0.4672*c + vec3(0.5328));
}

void main(void)
{
	vec4 hB = texture2D(tInput, d); vec3 c = hB.xyz;
#ifdef SHARPEN
	vec3 fA = texture2D(tInput, d + uSharpenKernel.xy).xyz;
	fA += texture2D(tInput, d - uSharpenKernel.xy).xyz;
	fA += texture2D(tInput, d + uSharpenKernel.zw).xyz;
	fA += texture2D(tInput, d - uSharpenKernel.zw).xyz;
	vec3 hC = uSharpness.x*c - uSharpness.y*fA;
	c += clamp(hC, -uSharpness.z, uSharpness.z);
#endif
#ifdef BLOOM
	c += uBloomColor*texture2D(tBloom, d).xyz;
#endif
#ifdef VIGNETTE
	vec2 hD = d*uVignetteAspect.xy - uVignetteAspect.zw;
	vec3 hn = clamp(vec3(1.0, 1.0, 1.0) - uVignette.xyz*dot(hD, hD), 0.0, 1.0);
	vec3 hE = hn*hn;
	hE *= hn;
	c *= mix(hn, hE, uVignette.w);
#endif
#ifdef SATURATION
	float gray = dot(c, vec3(0.3, 0.59, 0.11));
	c = mix(vec3(gray, gray, gray), c, uSaturation);
#endif
#ifdef CONTRAST
	c = c*uScale + uBias;
#endif
#ifdef GRAIN
	float hF = uGrainScaleBias.x*texture2D(tGrain, d*uGrainCoord.xy + uGrainCoord.zw).x + uGrainScaleBias.y;
	c += c*hF;
#endif
#ifdef REINHARD
	{
		c *= 1.8;
		float hG = dot(c, vec3(0.3333));
		c = clamp(c / (1.0 + hG), 0.0, 1.0);
	}
#elif defined(HEJL)
	{
		const highp float hH = 0.22, hI = 0.3, hJ = .1, hK = 0.2, hL = .01, hM = 0.3;
		const highp float hN = 1.25;
		highp vec3 dR = max(vec3(0.0), c - vec3(.004));
		c = (dR*((hN*hH)*dR + hN*vec3(hJ*hI, hJ*hI, hJ*hI)) + hN*vec3(hK*hL, hK*hL, hK*hL)) / (dR*(hH*dR + vec3(hI, hI, hI)) + vec3(hK*hM, hK*hM, hK*hM)) - hN*vec3(hL / hM, hL / hM, hL / hM);
	}
#endif
#ifdef COLOR_LUT
	c = clamp(c, 0.0, 1.0);
	c = (255.0 / 256.0)*c + vec3(0.5 / 256.0);
	c.x = texture2D(tLUT, c.xx).x;
	c.y = texture2D(tLUT, c.yy).y;
	c.z = texture2D(tLUT, c.zz).z;
	c *= c;
#endif
	gl_FragColor.xyz = hv(c);
	gl_FragColor.w = hB.w;
}
