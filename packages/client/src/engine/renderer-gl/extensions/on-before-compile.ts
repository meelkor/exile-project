import * as three from 'three';

export function onBeforeCompile<T extends { onBeforeCompile: (shader: three.Shader, renderer: three.WebGLRenderer) => void }>(
    material: T,
    fn: (shader: three.Shader, renderer: three.WebGLRenderer, material: T) => void,
): void {
    // const old = material.onBeforeCompile;

    material.onBeforeCompile = function (shader, rdr) {
        fn(shader, rdr, this);

        // if (old) {
        //     (old as any).call(this, shader, rdr, this);
        // }
    };
}
