import { Gl } from '@exile/client/engine/renderer-gl/internal/gl';
import { NodeIntersection } from '@exile/client/engine/renderer-gl/internal/intersection';
import { Pos } from '@exile/common/types/geometry';
import { InjectableGlobal } from '@exile/common/utils/di';
import * as three from 'three';

export abstract class GlLayer extends InjectableGlobal {

    public abstract readonly scene: three.Scene;

    public abstract readonly camera: three.Camera;

    private raycaster = new three.Raycaster();

    protected gl = this.inject(Gl);

    public project(pos: Pos): NodeIntersection[] {
        const normalizedPos = {
            x: pos.x / this.gl.extent.width * 2 - 1,
            y: pos.y / this.gl.extent.height * -2 + 1,
        };

        this.raycaster.setFromCamera(normalizedPos, this.camera);
        const intersections = this.raycaster.intersectObjects(this.scene.children);

        return intersections
            .filter(int => int.object.userData.interactive)
            .map(int => ({
                nodeId: int.object.userData.nodeId as number,
                position: {
                    x: int.point.x,
                    y: int.point.y,
                },
            }));
    }
}
