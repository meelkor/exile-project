import { CameraConfig } from '@exile/client/engine/config/camera-config';
import { GlPlane } from '@exile/client/engine/renderer-gl/internal/gl-plane';
import { Pos } from '@exile/common/types/geometry';
import { DebugName } from '@exile/common/utils/debug/class';
import * as three from 'three';

/**
 * Plane used for displaying world in perspective camera. The camera should not be
 */
@DebugName('WorldPlane')
export class WorldPlane extends GlPlane {

    private cameraConfig = this.inject(CameraConfig);

    public readonly scene: three.Scene;

    protected readonly camera: three.PerspectiveCamera;

    constructor() {
        super();

        const aspect = this.gl.extent.width / this.gl.extent.height;

        this.scene = new three.Scene();
        // this.scene.fog = new three.Fog(0xddddff, 0, 8);

        this.camera = new three.PerspectiveCamera(this.cameraConfig.fieldOfView, aspect);

        this.camera.position.set(0, 0, this.cameraConfig.height);
        this.camera.lookAt(0, 0, 0);
        this.camera.rotateX(this.cameraConfig.angle);
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
