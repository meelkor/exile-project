import { Component } from '@exile/client/engine/component/component';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import * as three from 'three';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';

export class CameraTrapCmp extends Component {

    public actions = {};

    private worldPlane = this.inject(WorldPlane);

    private moving = false;

    protected onInit(): void {
        const trapGeometry = new three.PlaneBufferGeometry(1000, 1000, 1, 1);

        const mesh = new NodeMesh(trapGeometry, undefined, true);

        mesh.visible = false;

        mesh.position.set(0, 0, -0.001);

        this.io.add(PlaneName.World, mesh);

        this.io.onInput(ViewEventType.MouseDown, () => {
            this.moving = true;
            return true;
        });

        this.io.onInput(ViewEventType.MouseUp, () => {
            this.moving = false;
            return true;
        });

        this.io.onInput(ViewEventType.MouseOut, () => {
            this.moving = false;
            return true;
        });

        this.io.onInput(ViewEventType.MouseMove, (e) => {
            if (this.moving) {
                this.worldPlane.pan(e.info.from, e.info.to);
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
