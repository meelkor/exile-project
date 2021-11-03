import { updateTimeUniforms } from '@exile/client/engine/renderer-gl/extensions/time';
import { Gl } from '@exile/client/engine/renderer-gl/internal/gl';
import { GlPlane } from '@exile/client/engine/renderer-gl/internal/gl-plane';
import { NodeIntersection as NodeIntersection } from '@exile/client/engine/renderer-gl/internal/intersection';
import { UiPlane } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { Pos } from '@exile/common/types/geometry';
import { InjectableGlobal } from '@exile/common/utils/di';

export class Renderer extends InjectableGlobal {

    private readonly gl = this.inject(Gl);
    /**
     * Thre planes should be ordered in the order in which they are rendered
     * with first element being first rendered and second being rendered atop
     * of it.
     */
    private readonly planes: GlPlane[] = [
        this.inject(WorldPlane),
        this.inject(UiPlane),
    ];

    constructor() {
        super();
        this.gl.renderer.autoClear = false;
        this.gl.renderer.info.autoReset = false;
    }

    /**
     * Render all known layers
     */
    public render(hrt: number): void {
        this.gl.renderer.info.reset();
        this.gl.renderer.clear();

        for (const plane of this.planes) {
            updateTimeUniforms(hrt);

            this.gl.renderer.render(plane.scene, GlPlane.getCamera(plane));
        }
    }

    /**
     * Project to all layers and find all components on given canvas coordinates.
     */
    public project(pos: Pos): NodeIntersection[] {
        return this.planes.map(plane => plane.project(pos)).reverse().flat();
    }

    /**
     * Remove all children from every scene that were created by node of given
     * ID.
     */
    public deleteNodesChildren(id: number): void {
        for (const plane of this.planes) {
            const ownedChildren = plane.scene.children.filter(child => child.userData.nodeId === id);

            for (const child of ownedChildren) {
                plane.scene.remove(child);
            }
        }
    }
}
