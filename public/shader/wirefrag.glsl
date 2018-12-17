precision highp float;
uniform vec4 uStripParams;
void main(void)
{
	vec2 c = gl_FragCoord.xy * uStripParams.xy - vec2(1.0, 1.0);
	c.x += 0.25 * c.y;
	float a = c.x < uStripParams.z ? 0.0 : 0.9;
	a = c.x < uStripParams.w ? a : 0.0;
	gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}