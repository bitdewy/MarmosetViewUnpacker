vec3 dG(vec3 c)
{
	return c * c;
}

vec3 dJ(vec3 n)
{
	vec3 hn = dA;
	vec3 ho = dB;
	vec3 hu = gl_FrontFacing ? dC : -dC;
#ifdef TSPACE_RENORMALIZE
	hu=normalize(hu);
#endif
#ifdef TSPACE_ORTHOGONALIZE
	hn -= dot(hn, hu) * hu;
#endif
#ifdef TSPACE_RENORMALIZE
	hn = normalize(hn);
#endif
#ifdef TSPACE_ORTHOGONALIZE
	ho = (ho - dot(ho, hu) * hu) - dot(ho, hn) * hn;
#endif
#ifdef TSPACE_RENORMALIZE
	ho = normalize(ho);
#endif
#ifdef TSPACE_COMPUTE_BITANGENT
	vec3 hv = cross(hu, hn);
	ho = dot(hv, ho) < 0.0 ? -hv : hv;
#endif
	n = 2.0 * n - vec3(1.0);
	return normalize(hn * n.x + ho * n.y + hu * n.z);
}

vec3 dL(vec3 t)
{
	vec3 hu = gl_FrontFacing ? dC : -dC;
	return normalize(dA * t.x + dB * t.y + hu * t.z);
}

vec4 dM(vec2 hA, vec4 hB)
{
#if GL_OES_standard_derivatives
	vec2 hC = fract(hA);
	vec2 hD = fwidth(hC);
	float hE = (hD.x + hD.y) > 0.5 ? -6.0 : 0.0;
	return texture2D(tExtras, hC * hB.xy + hB.zw, hE);
#else
	return texture2D(tExtras, fract(hA) * hB.xy + hB.zw);
#endif
}

vec3 hF(sampler2D hG, vec2 hH, float hI)
{
	vec3 n = texture2D(hG, hH, hI * 2.5).xyz;
	return dJ(n);
}