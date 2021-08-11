import * as three from 'three';

export function setUniform(obj: three.Object3D, name: string, value: number): void {
    (obj as any).uniforms.set(name, value);
}
