import * as three from 'three';
import { Text } from 'troika-three-text';
import { Component } from '@exile/client/engine/component/component';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import iconFont from '@exile/client/resources/fonts/icons/font.ttf';
import { Pos } from '@exile/common/types/geometry';
import { ButtonViewEvent, ViewEventType } from '@exile/client/engine/input/view-event-type';
import { Cursor, CursorType } from '@exile/client/engine/view/cursor';
import { assert } from '@exile/common/utils/assert';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';

/**
 * Naive implementation of button without any optimalization, should be only
 * used for devtools or extremely rare buttons. Also it looks very basic and
 * ugly.
 */
export class EditorButtonCmp extends Component {

    private static bgGeometry = new three.PlaneBufferGeometry(32, 32);

    private cursor = this.inject(Cursor);

    private options: EditorButtonOptions = {
        icon: '',
        position: {
            x: 0,
            y: 32,
        },
        active: false,
        onClick: () => void 0,
    };

    private hovered: boolean = false;

    private needsUpdate: boolean = false;

    private bgMesh?: NodeMesh<three.BufferGeometry, three.MeshBasicMaterial>;
    private iconMesh?: Text;

    public readonly actions = {};

    public update(options: Partial<EditorButtonOptions>): this {
        Object.assign(this.options, options);

        this.needsUpdate = true;

        return this;
    }

    public onInit(): void {
        this.bgMesh = new NodeMesh(
            EditorButtonCmp.bgGeometry,
            new three.MeshBasicMaterial(),
            true,
        );
        this.iconMesh = new Text();

        this.applyOptions();

        this.io.add(PlaneName.Ui, this.bgMesh);
        this.io.add(PlaneName.Ui, this.iconMesh);

        this.io.onInput(ViewEventType.Click, (e) => {
            this.options.onClick(e);
            return true;
        });

        this.io.onInput(ViewEventType.MouseIn, () => {
            this.hovered = true;
            this.needsUpdate = true;
            this.cursor.setCursor(CursorType.Pointer);
            return true;
        });

        this.io.onInput(ViewEventType.MouseOut, () => {
            this.hovered = false;
            this.needsUpdate = true;
            this.cursor.reset();
            return true;
        });
    }

    public onTick(): void {
        if (this.needsUpdate) {
            this.applyOptions();
        }
    }

    private applyOptions(): void {
        assert(this.iconMesh && this.bgMesh, 'Editor button not initialized');

        const x = this.options.position.x + 16;
        const y = this.options.position.y - 16;

        this.iconMesh.text = this.options.icon;
        this.iconMesh.fontSize = 24;
        this.iconMesh.textAlign = 'center';
        this.iconMesh.color = this.options.active ? 0xFFFFFF : 0x000000;
        this.iconMesh.anchorX = 'center';
        this.iconMesh.anchorY = 'middle';
        this.iconMesh.font = iconFont;
        this.iconMesh.position.set(x, y, 1);

        this.bgMesh.material.color.setHex(this.options.active ? 0x19A958 : this.hovered ? 0xDDDDDD : 0xEAEAEA);
        this.bgMesh.position.set(x, y, 0);

        this.needsUpdate = false;
    }
}

interface EditorButtonOptions {
    icon: string;
    position: Pos;
    active: boolean;
    onClick: (e: ButtonViewEvent) => void,
}
