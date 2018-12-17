precision mediump float;
uniform sampler2D tInput;
varying vec2 j;
void main(void) 
{ 
	gl_FragColor = texture2D(tInput, j); 
}