import * as three from 'three';

export function isMesh(obj: three.Object3D | three.Mesh): obj is three.Mesh {
    if ('isMesh' in obj) {
        return obj.isMesh;
    } else {
        return false;
    }
}
