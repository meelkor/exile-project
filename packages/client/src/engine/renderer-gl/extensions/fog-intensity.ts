import { onBeforeCompile } from '@exile/client/engine/renderer-gl/extensions/on-before-compile';
import { setUniform } from '@exile/client/engine/renderer-gl/utils';
import * as three from 'three';

export function setFogIntensity(mesh: three.Mesh, value: number): void {
    setUniform(mesh, 'xuFogIntensity', value);
}

export function enableFogIntensity(material: three.Material): void {

    onBeforeCompile(material, shader => {
        shader.uniforms.fogIntensity = { value: 0 };

        shader.fragmentShader = /* glsl */`
            uniform float xuFogIntensity;
            ${shader.fragmentShader}
        `,

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <fog_fragment>',
            three.ShaderChunk.fog_fragment.replace(
                'noiseFactor = 0.5 + 0.5*noiseFactor;',
                /* glsl */`
                    noiseFactor = (1.0 - xuFogIntensity) * noiseFactor;
                `,
            ).replace(
                'fogFactor - noiseFactor * 2.0',
                /* glsl */`
                    min(xuFogIntensity + noiseFactor, 1.0)
                `,
            ),
        );
    });
}
