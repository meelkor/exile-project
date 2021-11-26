import { Component } from '@exile/client/engine/component/component';
import { UiPlane, UiSize } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import * as three from 'three';
import { assert } from '@exile/common/utils/assert';
import { DialogCounter } from '@exile/client/game/modules/dialogs/dialogCounter';
import { DialogFeature } from '@exile/client/game/modules/dialogs/dialog-feature';
import { Pos } from '@exile/common/types/geometry';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
import dialogBgUrl from '@exile/client/resources/textures/ui/panel-bg.png';
import borderAlphaUrl from '@exile/client/resources/textures/ui/panel-border-alpha.png';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';

export class DialogCmp extends Component {

    public width?: UiSize;

    public zIndex: number = 0;

    public color: number = 0xffe0ee;

    private _offset: Pos = {
        x: 0,
        y: 0,
    };

    private dialogMesh?: NodeMesh<three.PlaneBufferGeometry, three.MeshBasicMaterial>;

    private uiPlane = this.inject(UiPlane);

    private dialogCounter = this.inject(DialogCounter);

    private writtenOffset: number = 0;

    public set offset(offset: Pos<DialogOffset>) {
        this._offset = {
            x: offset.x === 'auto' ? this.dialogCounter.currentWidth : this.uiPlane.getWidth(offset.x),
            y: this.uiPlane.getHeight(offset.y),
        };
    }

    public actions = {
        addFeature: (featCmp: DialogFeature): void => {
            featCmp.offset = this._offset;

            this.add(featCmp);
        },
    };

    protected onInit(): void {
        assert(this.width, 'No width set');

        const height = this.uiPlane.getHeight('100%');
        const width = this.uiPlane.getWidth(this.width);

        this.writtenOffset = width - 64;

        this.dialogCounter.announce(this.writtenOffset);

        const plane = new three.PlaneBufferGeometry(width, height, 1, 1);
        const texture = this.loader.load(dialogBgUrl);

        texture.wrapS = three.RepeatWrapping;
        texture.wrapT = three.RepeatWrapping;

        texture.repeat.set(width / 512, height / 512);
        texture.offset.set(width / -512, 0);

        const alphaTexture = this.loader.load(borderAlphaUrl);

        alphaTexture.wrapS = three.RepeatWrapping;
        alphaTexture.wrapT = three.RepeatWrapping;

        const material = new three.MeshBasicMaterial({
            map: texture,
            alphaMap: alphaTexture,
            color: this.color,
        });

        material.transparent = true;

        this.dialogMesh = new NodeMesh(plane, material, true);

        this.dialogMesh.position.set(
            this._offset.x + width / 2,
            this._offset.y + height / 2,
            this.zIndex,
        );

        this.io.add(PlaneName.Ui, this.dialogMesh);

        this.io.onInput(ViewEventType.Click, () => true);
        this.io.onInput(ViewEventType.MouseDown, () => true);
    }

    protected override onDestroy(): void {
        super.onDestroy();

        if (this.dialogMesh) {
            this.uiPlane.scene.remove(this.dialogMesh);
        }

        this.dialogCounter.remove(this.uiPlane.getWidth(this.writtenOffset));
    }

    protected onTick(): void { /** noop */ }
}

type DialogOffset = UiSize | 'auto';
