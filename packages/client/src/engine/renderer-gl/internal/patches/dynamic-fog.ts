import * as three from 'three';

three.ShaderChunk.fog_pars_vertex = `
    ${three.ShaderChunk.fog_pars_vertex}

    #ifdef USE_FOG
        varying vec2 fogPos;
    #endif
`;

three.ShaderChunk.fog_vertex = `
    ${three.ShaderChunk.fog_vertex}

    #ifdef USE_FOG
        fogPos = vec2(modelMatrix * vec4(position, 1.0));
    #endif
`;

three.ShaderChunk.fog_pars_fragment = `
    ${three.ShaderChunk.fog_pars_fragment}

    #ifdef USE_FOG

    varying vec2 fogPos;

    float noise(vec2 n) {
        const vec2 d = vec2(0.0, 1.0);
        vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
        return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
    }
    #endif
`;

three.ShaderChunk.fog_fragment = three.ShaderChunk.fog_fragment.replace(
    'gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );',
    `

        float noiseFactor = noise(fogPos) * 0.4;

        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, max(0.0, fogFactor - noiseFactor) );
    `,
);
