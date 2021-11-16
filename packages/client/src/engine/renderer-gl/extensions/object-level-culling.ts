import * as three from 'three';

let enabled = false;

export function frustumCullMesh(
    mesh: three.Mesh,
    bbox: three.Box3,
): void {
    enableObjectLevelCulling();

    const cullableMesh = mesh as three.Mesh & CullableObject;

    cullableMesh.boundingSphere = bbox.getBoundingSphere(new three.Sphere());
    cullableMesh.frustumCulled = true;
    cullableMesh.cullable = true;
}

/**
 * Taken from https://discourse.threejs.org/t/how-to-do-frustum-culling-with-instancedmesh/22633/5
 */
function enableObjectLevelCulling(): void {
    if (enabled) {
        return;
    }

    const sphere = new three.Sphere();

    const prevImpl = three.Frustum.prototype.intersectsObject;

    three.Frustum.prototype.intersectsObject = function (object: three.Object3D & CullableObject) {
        if (object.boundingSphere) {
            sphere.copy( object.boundingSphere ).applyMatrix4( object.matrixWorld );
            return this.intersectsSphere(sphere);
        }

        return prevImpl.call(this, object);
    };

    enabled = true;
}

export interface CullableObject {
  boundingSphere?: three.Sphere;
  cullable?: boolean;
}
