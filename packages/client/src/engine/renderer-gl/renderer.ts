import * as three from 'three';
import { updateTimeUniforms } from '@exile/client/engine/renderer-gl/extensions/time';
import { Gl } from '@exile/client/engine/renderer-gl/internal/gl';
import { GlPlane } from '@exile/client/engine/renderer-gl/internal/gl-plane';
import { NodeIntersection } from '@exile/client/engine/renderer-gl/internal/intersection';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';
import { UiPlane } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { Pos } from '@exile/common/types/geometry';
import { InjectableGlobal } from '@exile/common/utils/di';
import { Object3D } from 'three';

export class Renderer extends InjectableGlobal {

    private readonly gl = this.inject(Gl);

    private readonly planes = {
        [PlaneName.Ui]: this.inject(UiPlane),
        [PlaneName.World]: this.inject(WorldPlane),
    };

    /**
     * Thre planes should be ordered in the order in which they are rendered
     * with first element being first rendered and second being rendered atop
     * of it.
     */
    private readonly planeRenderOrder: GlPlane[] = [
        this.planes[PlaneName.World],
        this.planes[PlaneName.Ui],
    ];

    constructor() {
        super();
        this.gl.renderer.autoClear = false;
        this.gl.renderer.info.autoReset = false;
    }

    public getScene(planeName: PlaneName): three.Scene {
        return this.planes[planeName].scene;
    }

    /**
     * Render all known layers
     */
    public render(hrt: number): void {
        this.gl.renderer.info.reset();
        this.gl.renderer.clear();

        updateTimeUniforms(hrt);

        for (const plane of this.planeRenderOrder) {
            this.gl.renderer.render(plane.scene, GlPlane.getCamera(plane));
            this.gl.renderer.clearDepth();
        }
    }

    /**
     * Project to all layers and find all components on given canvas coordinates.
     */
    public project(pos: Pos): NodeIntersection[] {
        return this.planeRenderOrder.map(plane => plane.project(pos)).reverse().flat();
    }

    /**
     * Remove all children from every scene that were created by node of given
     * ID.
     */
    public deleteNodesChildren(id: number): void {
        for (const plane of this.planeRenderOrder) {
            const ownedChildren = plane.scene.children.filter(child => child.userData.nodeId === id);

            for (const child of ownedChildren) {
                plane.scene.remove(child);
            }
        }
    }

    /**
     * Get "top-level" objects from all scenes
     */
    public getAllObjects(): Object3D[] {
        return this.planeRenderOrder.flatMap(p => p.scene.children);
    }
}
