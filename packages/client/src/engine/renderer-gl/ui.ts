import { GlLayer } from '@exile/client/engine/renderer-gl/internal/gl-layer';
import * as three from 'three';

export class Ui extends GlLayer {

    public readonly scene: three.Scene;

    public readonly camera: three.OrthographicCamera;

    constructor() {
        super();

        this.scene = new three.Scene();

        this.camera = new three.OrthographicCamera(0, this.gl.extent.width, this.gl.extent.height, 0, -10, 10);

        this.camera.position.set(0, 0, 1);
    }

}
