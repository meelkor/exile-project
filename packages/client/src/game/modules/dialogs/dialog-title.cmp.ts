import { UiPlane } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import { DialogFeature } from '@exile/client/game/modules/dialogs/dialog-feature';
import { assert } from '@exile/common/utils/assert';
import * as three from 'three';
import felipa from '@exile/client/resources/fonts/felipa-regular.ttf';
import { NodeText } from '@exile/client/engine/renderer-gl/text';

export class DialogTitleCmp extends DialogFeature {

    public text = '';

    public actions = {};

    private textMesh?: NodeText;

    private uiPlane = this.inject(UiPlane);

    protected onInit(): void {
        assert(this.offset, 'No offset defined, was title provided as feature?');

        this.textMesh = new NodeText();

        this.textMesh.text = this.text;

        this.textMesh.position.x = this.offset.x + 16;
        this.textMesh.position.y = this.uiPlane.top(this.offset.y + 16);
        this.textMesh.position.z = 1;
        this.textMesh.fontSize = 30;
        this.textMesh.font = felipa;
        this.textMesh.color = 0xE5CD7A;

        this.uiPlane.scene.add(this.textMesh);

        const lineMaterial = new three.LineBasicMaterial({
            color: 0x514b32,
            linewidth: 3,
        });

        const lineGeometry = new three.BufferGeometry().setFromPoints([
            new three.Vector3(this.offset.x + 16, this.uiPlane.top(this.offset.y + 16 + 30 + 14), 1),
            new three.Vector3(this.offset.x + 380 - 16, this.uiPlane.top(this.offset.y + 16 + 30 + 14), 1),
        ]);

        const line = new three.Line(lineGeometry, lineMaterial);

        this.uiPlane.scene.add(line);

        this.textMesh.sync();
    }

    protected override onDestroy(): void {
        super.onDestroy();

        if (this.textMesh) {
            this.uiPlane.scene.remove(this.textMesh);
        }
    }

    protected onTick(): void { /** noop */ }
}
