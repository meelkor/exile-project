import { Text } from 'troika-three-text';
import { UiPlane } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import { DialogFeature } from '@exile/client/game/modules/dialogs/dialog-feature';
import { assert } from '@exile/common/utils/assert';
import * as three from 'three';
import felipa from '@exile/client/resources/fonts/felipa-regular.ttf';

export class DialogTitleCmp extends DialogFeature {

    public text = '';

    private uiPlane = this.inject(UiPlane);

    protected onInit(): void {
        assert(this.offset, 'No offset defined, was title provided as feature?');

        const text = new Text();

        text.text = this.text;

        text.position.x = this.offset.x + 16;
        text.position.y = this.uiPlane.top(this.offset.y + 16);
        text.position.z = 1;
        text.fontSize = 30;
        text.font = felipa;
        text.color = 0xE5CD7A;

        this.uiPlane.scene.add(text);

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

        text.sync();
    }

    protected onTick(): void { /** noop */ }
}
