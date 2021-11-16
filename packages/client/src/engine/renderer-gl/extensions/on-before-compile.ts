import * as three from 'three';

export function onBeforeCompile(
    _material: three.Material,
    fn: OnBeforeCompile,
): void {
    const material = _material as unknown as PatchedOnBeforeCompileMaterial;

    if (!material.onBeforeCompileFns) {
        material.onBeforeCompileFns = [];

        material.onBeforeCompile = function (shader, rdr) {
            for (const obc of this.onBeforeCompileFns!) {
                obc(shader, rdr, this);
            }
        };
    }

    material.onBeforeCompileFns.push(fn);
}

interface PatchedOnBeforeCompileMaterial extends three.Material {
    onBeforeCompileFns?: OnBeforeCompile[];
}

type OnBeforeCompile = (shader: three.Shader, renderer: three.WebGLRenderer, material: three.Material) => void;
