import { onBeforeCompile } from '@exile/client/engine/renderer-gl/extensions/on-before-compile';
import * as three from 'three';

const set: Set<WeakRef<three.Material>> = new Set();

export function updateTimeUniforms(hrt: number): void {
    for (const ref of set) {
        const material = ref.deref();

        if (material) {
            material.userData.shader.uniforms.time.value = hrt / 1000;
        } else {
            set.delete(ref);
        }
    }
}

export function enableTimeUniform(material: three.Material): void {
    onBeforeCompile(material, function (shader) {
        shader.uniforms.time = { value: 0 };
        shader.fragmentShader = `uniform float time; ${shader.fragmentShader}`;
        material.userData.shader = shader;
        set.add(new WeakRef(material));
    });
}
