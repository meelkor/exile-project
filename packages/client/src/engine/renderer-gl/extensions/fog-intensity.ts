import { onBeforeCompile } from '@exile/client/engine/renderer-gl/extensions/on-before-compile';
import * as three from 'three';

export function enableFogIntensity<T extends three.Material>(origMaterial: three.Material): FogIntensityMaterial<T> {
    const material = origMaterial as FogIntensityMaterial<T>;

    let shader: three.Shader;
    let initalValue = 0;

    onBeforeCompile(material, (_shader) => {
        shader = _shader;

        shader.uniforms.fogIntensity = { value: initalValue };

        shader.fragmentShader = /* glsl */`
            uniform float fogIntensity;
            ${shader.fragmentShader}
        `,

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <fog_fragment>',
            three.ShaderChunk.fog_fragment.replace(
                'noiseFactor = 0.5 + 0.5*noiseFactor;',
                /* glsl */`
                    noiseFactor = (1.0 - fogIntensity) * noiseFactor;
                `,
            ).replace(
                'fogFactor - noiseFactor * 2.0',
                /* glsl */`
                    min(fogIntensity + noiseFactor, 1.0)
                `,
            ),
        );
    });

    material.setFogIntensity = int => {
        if (shader) {
            shader.uniforms.fogIntensity!.value = int;
        } else {
            initalValue = int;
        }
    };

    return material;
}

export type FogIntensityMaterial<T = three.Material> = T & {
    setFogIntensity: (intensity: number) => void;
}
