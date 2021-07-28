import { ViewConfig } from '@exile/client/engine/config/view-config';
import '@exile/client/engine/renderer-gl/internal/patches/dynamic-fog';
import { Dimensions } from '@exile/common/types/geometry';
import { InjectableGlobal } from '@exile/common/utils/di';
import '@exile/client/engine/renderer-gl/internal/patches/plugins';
import * as three from 'three';

export class Gl extends InjectableGlobal {

    public readonly renderer: three.WebGLRenderer;

    public readonly extent: Dimensions;

    private readonly viewConfig = this.inject(ViewConfig);

    constructor() {
        super();

        const canvas = this.viewConfig.canvas;

        this.renderer = new three.WebGLRenderer({
            canvas,
            antialias: true,
        });

        this.extent = {
            width: this.viewConfig.canvas.width,
            height: this.viewConfig.canvas.height,
        };
    }
}
