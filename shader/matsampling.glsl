vec3 L(vec3 c)
{
	return c*c;
}

vec3 O(vec3 n)
{
	vec3 eX = E;
	vec3 eY = F;
	vec3 eZ = gl_FrontFacing ? G : -G;
#ifdef TSPACE_RENORMALIZE
	eZ = normalize(eZ);
#endif
#ifdef TSPACE_ORTHOGONALIZE
	eX -= dot(eX, eZ)*eZ;
#endif
#ifdef TSPACE_RENORMALIZE
	eX = normalize(eX);
#endif
#ifdef TSPACE_ORTHOGONALIZE
	eY = (eY - dot(eY, eZ)*eZ) - dot(eY, eX)*eX;
#endif
#ifdef TSPACE_RENORMALIZE
	eY = normalize(eY);
#endif
#ifdef TSPACE_COMPUTE_BITANGENT
	vec3 fc = cross(eZ, eX); eY = dot(fc, eY)<0.0 ? -fc : fc;
#endif
	n = 2.0*n - vec3(1.0);
	return normalize(eX*n.x + eY*n.y + eZ*n.z);
}

vec3 Q(vec3 t)
{
	vec3 eZ = gl_FrontFacing ? G : -G;
	return normalize(E*t.x + F*t.y + eZ*t.z);
}

vec4 R(vec2 fd, vec4 fe)
{
#if GL_OES_standard_derivatives
	vec2 ff = fract(fd);
	vec2 fh = fwidth(ff);
	float fi = (fh.x + fh.y)>0.5 ? -6.0 : 0.0;
	return texture2D(tExtras, ff*fe.xy + fe.zw, fi);
#else
	return texture2D(tExtras, fract(fd)*fe.xy + fe.zw);
#endif
}
vec3 fj(sampler2D fk, vec2 fl, float fm)
{
	vec3 n = texture2D(fk, fl, fm*4.0).xyz;
	return O(n);
}
