import { Component } from '@exile/client/engine/component/component';
import * as three from 'three';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';
import { Pos } from '@exile/common/types/geometry';

export class CameraTrapCmp extends Component {

    private worldPlane = this.inject(WorldPlane);

    private movingFrom?: Pos;

    protected onInit(): void {
        const trapGeometry = new three.PlaneBufferGeometry(1000, 1000, 1, 1);

        const mesh = new three.Mesh(trapGeometry, undefined);

        mesh.visible = false;

        mesh.position.set(0, 0, -0.001);

        this.io.add(PlaneName.World, mesh);

        this.io.onInput(ViewEventType.MouseDown, e => {
            this.movingFrom = e.info.pos;
            return true;
        });

        this.io.onInput(ViewEventType.MouseUp, () => {
            this.movingFrom = undefined;
            return true;
        });

        this.io.onInput(ViewEventType.MouseOut, () => {
            this.movingFrom = undefined;
            return true;
        });

        this.io.onInput(ViewEventType.MouseMove, (e) => {
            if (this.movingFrom) {
                this.worldPlane.pan(this.movingFrom, e.info.to);
                return true;
            }
        });

        this.io.onInput(ViewEventType.Wheel, (e) => {
            const normalizedDelta = e.info.delta / 40;
            const baseZoomStep = 0.05;
            const plusDelta = 1 + Math.abs(normalizedDelta * baseZoomStep);

            const delta = normalizedDelta > 0 ? plusDelta : 1 / plusDelta;

            this.worldPlane.zoom(delta);
        });
    }

    protected onTick(): void { /* noop */ }
}
