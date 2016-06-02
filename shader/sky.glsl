precision highp float;
uniform sampler2D tSkyTexture;
uniform float uAlpha;
varying vec2 j;

void main(void)
{
	vec3 r = texture2D(tSkyTexture, j).xyz;
	gl_FragColor.xyz = r*r;
	gl_FragColor.w = uAlpha;
}
