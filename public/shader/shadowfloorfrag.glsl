precision mediump float;
varying highp vec3 dv;
varying mediump vec2 jv;
varying mediump vec3 dC;
uniform vec3 uShadowCatcherParams;
#ifdef LIGHT_COUNT
uniform vec4 uLightPositions[LIGHT_COUNT];
uniform vec3 uLightDirections[LIGHT_COUNT];
uniform vec3 uLightColors[LIGHT_COUNT];
uniform vec3 uLightParams[LIGHT_COUNT];
uniform vec3 uLightSpot[LIGHT_COUNT];
#endif
#define saturate(x) clamp(x, 0.0, 1.0)
#define SHADOW_COMPARE(a, b) ((a) < (b) || (b) >= 1.0 ? 1.0 : 0.0)
#define SHADOW_CLIP(c, v) ((c.x < 0.0 || c.x > 1.0 || c.y < 0.0 || c.y > 1.0) ? 1.0 : v)
#include <matshadows.glsl>

void main(void)
{
    ev eA;
    eB(eA, SHADOW_KERNEL);
    vec3 jA = vec3(0.0, 0.0, 0.0);
    vec3 jB = vec3(0.0, 0.0, 0.0);
    for (int k = 0; k < SHADOW_COUNT; ++k)
    {
        vec3 eH = uLightPositions[k].xyz - dv * uLightPositions[k].w;
        float eI = inversesqrt(dot(eH, eH));
        eH *= eI;
        float a = saturate(uLightParams[k].z / eI);
        a = 1.0 + a * (uLightParams[k].x + uLightParams[k].y * a);
        float s = saturate(dot(eH, uLightDirections[k]));
        s = saturate(uLightSpot[k].y - uLightSpot[k].z * (1.0 - s * s));
        vec3 jC = mix(uLightColors[k].xyz, vec3(1.0, 1.0, 1.0), uShadowCatcherParams.x);
        vec3 jD = (a * s) * jC;
        jD *= saturate(dot(eH, dC));
        jB += jD;
        jA += jD * eA.eL[k];
    }
    float jE = 1.0e-4;
    vec3 r = (jA + jE) / (jB + jE);
    float jF = saturate(dot(jv, jv)) * uShadowCatcherParams.z;
    r = mix(r, vec3(1.0, 1.0, 1.0), jF);
    r = mix(vec3(1.0, 1.0, 1.0), r, uShadowCatcherParams.y);
    gl_FragColor.xyz = r;
    gl_FragColor.w = 1.0;
}