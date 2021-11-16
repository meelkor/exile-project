import { GlPlane } from '@exile/client/engine/renderer-gl/internal/gl-plane';
import { assert } from '@exile/common/utils/assert';
import { DebugName } from '@exile/common/utils/debug/class';
import * as three from 'three';

@DebugName('UiPlane')
export class UiPlane extends GlPlane {

    public readonly scene: three.Scene;

    protected readonly camera: three.OrthographicCamera;

    private uiUnitExp = /([\d.]+)(px|%)/;

    constructor() {
        super();

        this.scene = new three.Scene();

        this.camera = new three.OrthographicCamera(0, this.gl.extent.width, this.gl.extent.height, 0, -10, 10);

        this.camera.position.set(0, 0, 10);
    }

    public getHeight(size: UiSize): number {
        return this.getSize(size, this.gl.extent.height);
    }

    public getWidth(size: UiSize): number {
        return this.getSize(size, this.gl.extent.width);
    }

    public top(val: number): number {
        return this.gl.extent.height - val;
    }

    public bottom(val: number): number {
        return val;
    }

    private getSize(size: UiSize, max: number): number {
        if (typeof size === 'number') {
            return size;
        } else {
            const res = this.uiUnitExp.exec(size);

            assert(res?.[1] && res?.[2], `Invalid UI size "${size}"`);

            const val = parseFloat(res[1]);
            const unit = res[2];

            if (unit === '%') {
                return val / 100 * max;
            } else {
                return val;
            }
        }
    }
}

export type UiSize = string | number;
