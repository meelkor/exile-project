import { Component } from '@exile/client/engine/component/component';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
import { UiPlane } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import * as three from 'three';
import { assert } from '@exile/common/utils/assert';

export class DialogCmp extends Component {

    private dialogMesh?: NodeMesh<three.PlaneBufferGeometry, three.MeshBasicMaterial>;

    private texture = this.loader.load('./sk.jpg');

    private uiPlane = this.inject(UiPlane);

    protected onInit(): void {
        const plane = new three.PlaneBufferGeometry(200, 200, 1, 1);
        const material = new three.MeshBasicMaterial({
            map: this.texture,
            combine: three.MixOperation,
        });

        this.dialogMesh = new NodeMesh(plane, material, true);

        this.dialogMesh.position.set(100, 100, 0);

        this.uiPlane.scene.add(this.dialogMesh);

        this.viewEvents.on(ViewEventType.Click, () => this.toggle());
        this.viewEvents.on(ViewEventType.MouseIn, () => this.setColor(0xff0000));
        this.viewEvents.on(ViewEventType.MouseOut, () => this.setColor(0x00ff00));
    }

    protected onTick(): void { /** noop */ }

    private toggle(): boolean {
        assert(this.dialogMesh, 'Dialog component not initialized');

        if (this.dialogMesh.material.map) {
            this.dialogMesh.material.map = null;
        } else {
            this.dialogMesh.material.map = this.texture;
        }

        this.dialogMesh.material.needsUpdate = true;

        return true;
    }

    private setColor(color: three.ColorRepresentation): boolean {
        assert(this.dialogMesh, 'Dialog component not initialized');

        this.dialogMesh.material.color.set(color);

        return true;
    }
}
