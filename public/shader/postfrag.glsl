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
varying vec2 j;
vec3 iY(vec3 c)
{
	vec3 iZ = sqrt(c);
	return (iZ - iZ * c) + c * (0.4672 * c + vec3(0.5328));
}
void main(void)
{
	vec4 jc = texture2D(tInput, j);
	vec3 c = jc.xyz;
#ifdef SHARPEN
	vec3 hM = texture2D(tInput, j + uSharpenKernel.xy).xyz;
	hM += texture2D(tInput, j - uSharpenKernel.xy).xyz;
	hM += texture2D(tInput, j + uSharpenKernel.zw).xyz;
	hM += texture2D(tInput, j - uSharpenKernel.zw).xyz;
	vec3 jd = uSharpness.x * c - uSharpness.y * hM;
	c += clamp(jd, -uSharpness.z, uSharpness.z);
#endif
#ifdef BLOOM
	c += uBloomColor * texture2D(tBloom, j).xyz;
#endif
#ifdef VIGNETTE
	vec2 je = j * uVignetteAspect.xy - uVignetteAspect.zw;
	vec3 v = clamp(vec3(1.0, 1.0, 1.0) - uVignette.xyz * dot(je, je), 0.0, 1.0);
	vec3 jf = v * v;
	jf *= v;
	c *= mix(v, jf, uVignette.w);
#endif
#ifdef SATURATION
	float gray = dot(c, vec3(0.3, 0.59, 0.11));
	c = mix(vec3(gray, gray, gray), c, uSaturation);
#endif
#ifdef CONTRAST
	c = c * uScale + uBias;
#endif
#ifdef GRAIN
	float jh = uGrainScaleBias.x * texture2D(tGrain, j * uGrainCoord.xy + uGrainCoord.zw).x + uGrainScaleBias.y;
	c += c * jh;
#endif
#ifdef REINHARD
	{
		c *= 1.8;
		float ji = dot(c, vec3(0.3333));
		c = clamp(c / (1.0 + ji), 0.0, 1.0);
	}
#elif defined(HEJL)
	{
		const highp float jj = 0.22, jk = 0.3, jl = .1, jm = 0.2, jn = .01, jo = 0.3;
		const highp float ju = 1.25;
		highp vec3 eO = max(vec3(0.0), c - vec3(.004));
		c = (eO * ((ju * jj) * eO + ju * vec3(jl * jk, jl * jk, jl * jk)) + ju * vec3(jm * jn, jm * jn, jm * jn)) / (eO * (jj * eO + vec3(jk, jk, jk)) + vec3(jm * jo, jm * jo, jm * jo)) - ju * vec3(jn / jo, jn / jo, jn / jo);
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
	gl_FragColor.xyz = iY(c);
	gl_FragColor.w = jc.w;
}