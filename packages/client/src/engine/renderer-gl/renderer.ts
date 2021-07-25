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
    }

    /**
     * Render all known layers
     */
    public render(): void {
        this.gl.renderer.clear();

        for (const plane of this.planes) {
            this.gl.renderer.render(plane.scene, GlPlane.getCamera(plane));
        }
    }

    /**
     * Project to all layers and find all components on given canvas coordinates.
     */
    public project(pos: Pos): NodeIntersection[] {
        return this.planes.map(plane => plane.project(pos)).reverse().flat();
    }
}
