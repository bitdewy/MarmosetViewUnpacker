precision mediump float;
#include <matdither.glsl>
uniform sampler2D tAlbedo;
varying mediump vec2 j;

void main()
{
	float k = texture2D(tAlbedo, j).a;
	if (k <= l(j.x))
	{
		discard;
	}
	gl_FragColor = vec4(0.0);
}
