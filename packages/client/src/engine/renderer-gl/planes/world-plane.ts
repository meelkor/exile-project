import { GlPlane } from '@exile/client/engine/renderer-gl/internal/gl-plane';
import { Pos } from '@exile/common/types/geometry';
import * as three from 'three';

const DEFAULT_Z = 4.949645756898373;

/**
 * Plane used for displaying world in perspective camera. The camera should not be
 */
export class WorldPlane extends GlPlane {

    public readonly scene: three.Scene;

    protected readonly camera: three.PerspectiveCamera;

    constructor() {
        super();

        const aspect = this.gl.extent.width / this.gl.extent.height;

        this.scene = new three.Scene();
        // this.scene.fog = new three.Fog(0xddddff, 0, 8);

        this.camera = new three.PerspectiveCamera(41, aspect);

        this.camera.position.set(0, 0, DEFAULT_Z);
        this.camera.lookAt(0, 0, 0);
        this.camera.rotateX(Math.PI * 0.14);
    }

    public pan(from: Pos, to: Pos): void {
        const fromVec = new three.Vector3(from.x, from.y, 0);
        const toVec = new three.Vector3(to.x, to.y, 0);

        const panVec = fromVec.sub(toVec);

        this.camera.position.add(panVec);
    }

    public zoom(delta: number): void {
        this.camera.position.setZ(this.camera.position.z * delta);
    }
}

declare module '../mesh' {
    export interface MeshUserData {
        /**
         * If true, mouse events on this mesh will control camera
         */
        worldCameraOwner?: boolean;
    }
}
