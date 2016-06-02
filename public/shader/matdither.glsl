float l(highp float B)
{
	highp float C = 0.5 * fract(gl_FragCoord.x * 0.5) + 0.5 * fract(gl_FragCoord.y * 0.5);
	return 0.4 + 0.6 * fract(C + 3.141592e6 * B);
}
