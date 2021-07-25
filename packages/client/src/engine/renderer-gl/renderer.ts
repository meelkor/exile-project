import { Gl } from '@exile/client/engine/renderer-gl/internal/gl';
import { NodeIntersection as NodeIntersection } from '@exile/client/engine/renderer-gl/internal/intersection';
import { Ui } from '@exile/client/engine/renderer-gl/ui';
import { Pos } from '@exile/common/types/geometry';
import { InjectableGlobal } from '@exile/common/utils/di';

export class Renderer extends InjectableGlobal {

    private readonly gl = this.inject(Gl);
    private readonly ui = this.inject(Ui);

    /**
     * Render all known layers
     */
    public render(): void {
        this.gl.renderer.render(this.ui.scene, this.ui.camera);
    }

    /**
     * Project to all layers and find all components on given canvas coordinates.
     */
    public project(pos: Pos): NodeIntersection[] {
        return this.ui.project(pos);
    }
}
