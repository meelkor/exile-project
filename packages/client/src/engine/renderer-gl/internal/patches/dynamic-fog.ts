import * as three from 'three';

three.ShaderChunk.fog_pars_vertex = /* glsl */`
    ${three.ShaderChunk.fog_pars_vertex}

    #ifdef USE_FOG
        varying vec2 fogPos;
    #endif
`;

three.ShaderChunk.fog_vertex = /* glsl */`
    ${three.ShaderChunk.fog_vertex}

    #ifdef USE_FOG
        fogPos = vec2(modelMatrix * vec4(position, 1.0));
    #endif
`;

three.ShaderChunk.fog_pars_fragment = /* glsl */`
    ${three.ShaderChunk.fog_pars_fragment}

    #ifdef USE_FOG

    varying vec2 fogPos;

    // float noise(vec2 n) {
    //     const vec2 d = vec2(0.0, 1.0);
    //     vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    //     return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    // }

    vec2 hash( vec2 p ) // replace this by something better
{
	p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

	vec2  i = floor( p + (p.x+p.y)*K1 );
    vec2  a = p - i + (i.x+i.y)*K2;
    float m = step(a.y,a.x);
    vec2  o = vec2(m,1.0-m);
    vec2  b = a - o + K2;
	vec2  c = a - 1.0 + 2.0*K2;
    vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(70.0) );
}

    // float noise(vec2 co){
    //     return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    // }
    #endif
`;

three.ShaderChunk.fog_fragment = three.ShaderChunk.fog_fragment.replace(
    'gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );',
    /* glsl */`
        vec2 uv = fogPos.xy + time * 0.035;

        mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
        float noiseFactor = 0.5000*noise( uv ); uv = m*uv;
        noiseFactor += 0.2500*noise( uv ); uv = m*uv;
        noiseFactor += 0.1250*noise( uv ); uv = m*uv;
        noiseFactor += 0.0625*noise( uv ); uv = m*uv;

        noiseFactor = 0.5 + 0.5*noiseFactor;

        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor - noiseFactor * 2.0);
    `,
);
