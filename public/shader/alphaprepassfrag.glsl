precision mediump float;
#include <matdither.glsl>
uniform sampler2D tAlbedo;
varying mediump vec2 d;
void main()
{
	float e = texture2D(tAlbedo, d).a;
	if ( e<= f(d.x))
	{
		discard;
	}
	gl_FragColor = vec4(0.0);
}