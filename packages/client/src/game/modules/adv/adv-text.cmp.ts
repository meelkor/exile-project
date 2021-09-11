import { Component } from '@exile/client/engine/component/component';
import { UiPlane } from '@exile/client/engine/renderer-gl/planes/ui-plane';

import ptserif from '@exile/client/resources/fonts/ptserif-regular.ttf';
import { assert } from '@exile/common/utils/assert';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
// import { NodeText } from '@exile/client/engine/renderer-gl/text';
import { Text } from 'troika-three-text';
import { TreeNode } from '@exile/client/engine/core/tree-node';

export class AdvTextCmp extends Component {

    private textMesh: Text;

    private uiPlane = this.inject(UiPlane);

    private drawStart: number = 0;

    private drawLength: number = 0;

    private drawing: boolean = false;

    private charsPerSecond = 80;

    private margin = 48;

    public actions = {
        updateText: (newText: string): void => this.updateText(newText),
    };

    constructor() {
        super();

        const width = this.uiPlane.getWidth('100%') - 2 * this.uiPlane.getWidth(this.margin);

        this.textMesh = new Text();

        this.textMesh.userData.interactive = true;
        this.textMesh.userData.nodeId = TreeNode.getId(this);

        this.textMesh.position.x = this.margin;
        this.textMesh.position.y = this.uiPlane.bottom(this.margin);
        this.textMesh.position.z = 2;
        this.textMesh.fontSize = 22;
        this.textMesh.font = ptserif;
        this.textMesh.color = 0xBBBBBB;
        this.textMesh.maxWidth = width;
        this.textMesh.overflowWrap = 'break-word';
        this.textMesh.anchorY = 'bottom';
    }

    protected onInit(): void {
        this.updateText('Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text,');

        this.viewEvents.on(ViewEventType.Click, () => {
            console.log("lol")
            this.updateText('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
        });

        this.uiPlane.scene.add(this.textMesh);

        this.textMesh.sync(() => this.drawing = true);
    }

    protected override onDestroy(): void {
        super.onDestroy();

        if (this.textMesh) {
            this.uiPlane.scene.remove(this.textMesh);
        }
    }

    protected onTick(hrt: number): void {
        if (this.textMesh) {
            if (this.drawing) {
                if (!this.drawStart) {
                    this.drawStart = hrt;
                } else {
                    const length = ((hrt - this.drawStart) / 1000) * this.charsPerSecond;

                    // this.textMesh.setTextLength(length);

                    if (length >= this.drawLength) {
                        this.drawing = false;
                    }
                }
            }
        }
    }

    private updateText(text: string): void {
        assert(this.textMesh);

        const textUnchanged = this.textMesh.text === text;

        this.textMesh.text = text;
        this.drawLength = text.length;
        this.drawStart = 0;
        this.drawing = false;

        // this.textMesh.setTextLength(0);

        if (textUnchanged) {
            this.drawing = true;
        } else {
            this.textMesh.sync(() => this.drawing = true);
        }
    }
}
