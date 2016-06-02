precision highp float;
attribute vec2 vCoord;
varying vec2 d;

void main(void)
{
	d = vCoord;
	gl_Position.xy = 2.0*vCoord - vec2(1.0, 1.0);
	gl_Position.zw = vec2(0.0, 1.0);
}
