float f(highp float I)
{
	highp float G = 0.5 * fract(gl_FragCoord.x * 0.5) + 0.5 * fract(gl_FragCoord.y * 0.5);
	return 0.4 + 0.6 * fract(G + 3.141592e6 * I);
}