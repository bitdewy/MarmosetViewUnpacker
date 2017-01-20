vec3 L(vec3 c)
{
	return c * c;
}

vec3 O(vec3 n)
{
	vec3 fA = E;
	vec3 fB = F;
	vec3 fC = gl_FrontFacing ? G : -G;
#ifdef TSPACE_RENORMALIZE
	fC = normalize(fC);
#endif
#ifdef TSPACE_ORTHOGONALIZE
	fA -= dot(fA, fC) * fC;
#endif
#ifdef TSPACE_RENORMALIZE
	fA = normalize(fA);
#endif
#ifdef TSPACE_ORTHOGONALIZE
	fB = (fB - dot(fB, fC) * fC) - dot(fB, fA) * fA;
#endif
#ifdef TSPACE_RENORMALIZE
	fB = normalize(fB);
#endif
#ifdef TSPACE_COMPUTE_BITANGENT
	vec3 fD = cross(fC, fA);
	fB = dot(fD, fB) < 0.0 ? -fD : fD;
#endif
	n = 2.0 * n - vec3(1.0);
	return normalize(fA * n.x + fB * n.y + fC * n.z);
}

vec3 Q(vec3 t)
{
	vec3 fC = gl_FrontFacing ? G : -G;
	return normalize(E * t.x + F * t.y + fC * t.z);
}

vec4 R(vec2 fE, vec4 fF)
{
#if GL_OES_standard_derivatives
	vec2 fG = fract(fE);
	vec2 fH = fwidth(fG);
	float fI = (fH.x + fH.y) > 0.5 ? -6.0 : 0.0;
	return texture2D(tExtras, fG * fF.xy + fF.zw, fI);
#else
	return texture2D(tExtras, fract(fE) * fF.xy + fF.zw);
#endif
}

vec3 fJ(sampler2D fK, vec2 fL, float fM)
{
	vec3 n = texture2D(fK, fL, fM * 2.5).xyz;
	return O(n);
}
