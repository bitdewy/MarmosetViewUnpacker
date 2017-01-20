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

vec3 ii(vec3 c)
{
	vec3 ij = sqrt(c);
	return (ij - ij * c) + c * (0.4672 * c + vec3(0.5328));
}

void main(void)
{
	vec4 ik = texture2D(tInput, d);
	vec3 c = ik.xyz;
#ifdef SHARPEN
	vec3 fR = texture2D(tInput, d + uSharpenKernel.xy).xyz;
	fR += texture2D(tInput, d - uSharpenKernel.xy).xyz;
	fR += texture2D(tInput, d + uSharpenKernel.zw).xyz;
	fR += texture2D(tInput, d - uSharpenKernel.zw).xyz;
	vec3 il = uSharpness.x * c - uSharpness.y * fR;
	c += clamp(il, -uSharpness.z, uSharpness.z);
#endif
#ifdef BLOOM
	c += uBloomColor * texture2D(tBloom, d).xyz;
#endif
#ifdef VIGNETTE
	vec2 im = d * uVignetteAspect.xy - uVignetteAspect.zw;
	vec3 id = clamp(vec3(1.0, 1.0, 1.0) - uVignette.xyz * dot(im, im), 0.0, 1.0);
	vec3 io = id * id;
	io *= id;
	c *= mix(id, io, uVignette.w);
#endif
#ifdef SATURATION
	float gray = dot(c, vec3(0.3, 0.59, 0.11));
	c = mix(vec3(gray, gray, gray), c, uSaturation);
#endif
#ifdef CONTRAST
	c = c * uScale + uBias;
#endif
#ifdef GRAIN
	float iu = uGrainScaleBias.x * texture2D(tGrain, d * uGrainCoord.xy + uGrainCoord.zw).x + uGrainScaleBias.y;
	c += c * iu;
#endif
#ifdef REINHARD
	{
		c *= 1.8;
		float iv = dot(c, vec3(0.3333));
		c = clamp(c / (1.0 + iv), 0.0, 1.0);
	}
#elif defined(HEJL)
	{
		const highp float iA = 0.22,
			iB = 0.3,
			iC = .1,
			iD = 0.2,
			iE = .01,
			iF = 0.3;
		const highp float iG = 1.25;
		highp vec3 dU = max(vec3(0.0), c - vec3(.004));
		c = (dU * ((iG * iA) * dU + iG * vec3(iC * iB, iC * iB, iC * iB)) + iG * vec3(iD * iE, iD * iE, iD * iE)) / (dU * (iA * dU + vec3(iB, iB, iB)) + vec3(iD * iF, iD * iF, iD * iF)) - iG * vec3(iE / iF, iE / iF, iE / iF);
	}
#endif
#ifdef COLOR_LUT
	c = clamp(c, 0.0, 1.0);
	c = (255.0 / 256.0) * c + vec3(0.5 / 256.0);
	c.x = texture2D(tLUT, c.xx).x;
	c.y = texture2D(tLUT, c.yy).y;
	c.z = texture2D(tLUT, c.zz).z;
	c *= c;
#endif
	gl_FragColor.xyz = ii(c);
	gl_FragColor.w = ik.w;
}
