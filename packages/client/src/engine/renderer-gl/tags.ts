import * as three from 'three';

let tagCounter = 0;

export function createTag(): number {
    return tagCounter++;
}

export function addMeshTag(mesh: three.Mesh, tag: number): void {
    if (!mesh.userData.tags) {
        mesh.userData.tags = new Set();
    }

    mesh.userData.tags.add(tag);
}
