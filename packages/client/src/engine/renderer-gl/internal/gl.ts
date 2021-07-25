import { ViewConfig } from '@exile/client/engine/config/view-config';
import { Dimensions } from '@exile/common/types/geometry';
import { InjectableGlobal } from '@exile/common/utils/di';
import { WebGLRenderer } from 'three';

export class Gl extends InjectableGlobal {

    public readonly renderer: WebGLRenderer;

    public readonly extent: Dimensions;

    private readonly viewConfig = this.inject(ViewConfig);

    constructor() {
        super();

        const canvas = this.viewConfig.canvas;

        this.renderer = new WebGLRenderer({
            canvas,
        });

        this.extent = {
            width: this.viewConfig.canvas.width,
            height: this.viewConfig.canvas.height,
        };
    }
}
