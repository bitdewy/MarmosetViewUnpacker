precision highp float;
uniform sampler2D tDepth;
uniform vec3 uDepthToZ;
uniform vec4 uUnproject;
uniform mat4 uInvViewMatrix;
uniform float uFogInvDistance;
uniform float uFogOpacity;
uniform float uFogDispersion;
uniform vec3 uFogType;
uniform vec3 uFogColor;
uniform float uFogIllum;
uniform mat4 uLightMatrix;
#ifdef FOG_IBL
uniform vec4 uFogLightSphere[9];
#else
uniform vec4 uSpotParams;
uniform vec4 uLightPosition;
uniform vec3 uLightColor;
uniform vec4 uLightAttenuation;
#ifdef FOG_SHADOWS
uniform mat4 uShadowProj;
uniform sampler2D uShadowMap;
uniform float uDitherOffset;
uniform vec4 uCylinder;
#endif
#endif

vec4 h(mat4 i, vec3 p)
{
    return i[0] * p.x + (i[1] * p.y + (i[2] * p.z + i[3]));
}

vec3 u(mat4 i, vec3 v)
{
    return i[0].xyz * v.x + i[1].xyz * v.y + i[2].xyz * v.z;
}

float A(float B)
{
    B *= uFogInvDistance;
    float C = uFogType.x * min(B, 1.0) + (uFogType.y - uFogType.y / (1.0 + 16.0 * B * B)) + (uFogType.z - uFogType.z * exp(-3.0 * B));
    return C * uFogOpacity;
}
#ifdef FOG_SHADOWS
float D(vec3 E)
{
    vec4 p = h(uShadowProj, E);
    vec3 F = p.xyz / p.w;
    vec4 G = texture2D(uShadowMap, F.xy);
    float H = (G.x + G.y * (1.0 / 255.0)) + G.z * (1.0 / 65025.0);
    return F.z < H || H >= 1.0 ? 1.0 : 0.0;
}

float f(vec2 I)
{
    return fract(sin(dot(I, vec2(12.9898, 78.233))) * 43758.5453 + uDitherOffset);
}

void J(vec3 K, vec3 L, out float M, out float N)
{
    vec3 v = uSpotParams.xyz, p = uCylinder.xyz;
    vec3 O = L - dot(L, v) * v;
    vec3 P = (K - p) - dot(K - p, v) * v;
    float a = dot(O, O);
    float b = 2.0 * dot(O, P);
    float c = dot(P, P) - uCylinder.w;
    float Q = b * b - 4.0 * a * c;
    if (Q >= 0.0)
    {
        Q = sqrt(Q);
        M = (-b - Q)/(2.0 * a);
        N = (-b + Q)/(2.0 * a);
    }
    else
    {
        M = N = 0.0;
    }
}
#endif
varying vec2 j;
void main(void)
{
    vec3 R = uInvViewMatrix[3].xyz;
    float H = texture2D(tDepth, j).x;
    H = min(H, 0.9999);
    vec3 S;
    S.z = uDepthToZ.y / (uDepthToZ.z * H + uDepthToZ.x);
    S.xy = S.z * (j * uUnproject.xy + uUnproject.zw);
    S = h(uInvViewMatrix, S).xyz;
    vec3 T;
    T.xy = (j * uUnproject.xy + uUnproject.zw);
    T.z = 1.0;
    T = normalize(u(uInvViewMatrix, -T).xyz);
    vec3 U = uFogColor;
#if defined(FOG_IBL)
    vec3 G = u(uLightMatrix, T);
    vec3 V = uFogLightSphere[0].xyz;
    V += uFogLightSphere[1].xyz * G.y;
    V += uFogLightSphere[2].xyz * G.z;
    V += uFogLightSphere[3].xyz * G.x;
    vec3 swz = G.yyz * G.xzx;
    V += uFogLightSphere[4].xyz * swz.x;
    V += uFogLightSphere[5].xyz * swz.y;
    V += uFogLightSphere[7].xyz * swz.z;
    vec3 sqr = G * G;
    V += uFogLightSphere[6].xyz * (3.0 * sqr.z - 1.0);
    V += uFogLightSphere[8].xyz * (sqr.x - sqr.y);
    U = mix(U, U * V,uFogIllum);
    float C = A(length(S - R));
    gl_FragColor.xyz = U * C;
    gl_FragColor.w = C;
    return;
#else
#if defined(FOG_SPOT) || defined(FOG_OMNI)
    float W = 0.0, X = 0.0;
    {
        float r = 1.0 / (uLightAttenuation.z);
        float a = 1.0;
        float b = 2.0 * dot(T, R - uLightPosition.xyz);
        float c = dot(uLightPosition.xyz, uLightPosition.xyz) + dot(R, R) + -2.0 * dot(uLightPosition.xyz, R) + -r * r;
        float Q = b * b - 4.0 * a * c;
        if (Q >= 0.0)
        {
            Q = sqrt(Q);
            W = (-b - Q)/(2.0 * a);
            X = (-b + Q)/(2.0 * a);
        }
    }
#if defined(FOG_SPOT)
    {
        float Y = uSpotParams.w, Z = 1.0 - Y;
        vec3 v = T;
        vec3 dc = uSpotParams.xyz;
        vec3 dd = R - uLightPosition.xyz;
        vec3 de = v - dot(v, dc) * dc, df = dd - dot(dd, dc) * dc;
        float a = Y * dot(de, de) - Z * dot(v, dc) * dot(v, dc);
        float b = 2.0 * Y * dot(de, df) - 2.0 * Z * dot(v, dc) * dot(dd, dc);
        float c = Y * dot(df, df) - Z * dot(dd, dc) * dot(dd, dc);
        float Q = b * b - 4.0 * a * c;
        if (Q >= 0.0)
        {
            float dh = (-b - sqrt(Q)) / (2.0 * a);
            float di = (-b + sqrt(Q)) / (2.0 * a);
            if (di < dh)
            {
                float de = dh;
                dh = di;
                di = de;
            }
            bool dj = dot(-uLightPosition.xyz + R + T * dh, uSpotParams.xyz) <= 0.0;
            bool dk = dot(-uLightPosition.xyz + R + T * di, uSpotParams.xyz) <= 0.0;
            if (!dj ||!dk)
            {
                if(dj)
                {
                    dh = di;
                    di = X;
                }
                else if (dk)
                {
                    di = dh;
                    dh = W;
                }
                W = max(W, dh);
                X = min(X, di);
            }
            else
            {
                X = W = 0.0;
            }
        }
        else
        {
            X = W = 0.0;
        }
    }
#endif
    float tx = dot(T, S - R);
    W = clamp(W, 0.0, tx);
    X = clamp(X, 0.0, tx);
    float dl = 0.0;
    if (X > W)
    {
    #ifdef FOG_SHADOWS
    #ifdef MOBILE
        #define SAMPLES 16
    #else
        #define SAMPLES 32
    #endif
        float dm = f(j) * (X - W) / float(SAMPLES - 2);
    #else
        #define SAMPLES 8
        float dm = 0.0;
    #endif
        for (int k = 0; k < SAMPLES; ++k)
        {
            float t = W + (X - W) * float(k) / float(SAMPLES - 1);
            vec3 p = R + (t + dm) * T;
            float a = clamp(length(p - uLightPosition.xyz) * uLightAttenuation.z, 0.0, 1.0);
            a = 1.0 + uLightAttenuation.x * a + uLightAttenuation.y * a * a;
        #ifdef FOG_SHADOWS
            a *= D(p);
        #endif
            dl += a - a * A(t);
        }
        dl *= 1.0 / float(SAMPLES);
        dl *= (X - W) * uLightAttenuation.z;
        dl *= A(X - W);
    }
    U *= dl * uFogIllum;
#elif defined(FOG_DIR)
    float C = A(dot(T, S - R));
#ifdef FOG_SHADOWS
    float W, X;
    J(R, T, W, X);
    float tx = dot(T, S - R);
    W = clamp(W, 0.0, tx);
    X = clamp(X, 0.0, tx);
    if (X > W)
    {
    #ifdef MOBILE
        #define SAMPLES 16
    #else
        #define SAMPLES 32
    #endif
        float dl = 0.0;
        float dm = f(j) * (X - W) / float(SAMPLES - 2);
        float dn = (X - W) * (1.0 / float(SAMPLES));
        for (int k = 0; k < SAMPLES; ++k)
        {
            float t = W + float(k) * dn + dm;
            vec3 p = R + t * T;
            float s = D(p);
            C -= (1.0 - s) * (A(t + dn) - A(t));
        }
    }
#endif
    float du = 0.5 + 0.5 * dot(T, -uSpotParams.xyz);
    du = 1.0 + uFogDispersion * (2.0 * du * du - 1.0);
    U *= (0.1 * C) * (du * uFogIllum);
#endif
    gl_FragColor.xyz = U * uLightColor;
    gl_FragColor.w = 0.0;
#endif
}