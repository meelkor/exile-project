import { Text } from 'troika-three-text';
import { Component } from '@exile/client/engine/component/component';
import { UiPlane } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import ptserif from '@exile/client/resources/fonts/ptserif-regular.ttf';
import { assert } from '@exile/common/utils/assert';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
import { enableTextLength, setTextLength } from '@exile/client/engine/renderer-gl/extensions/text-length';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';

export class AdvTextCmp extends Component {

    private textMesh: Text;

    private uiPlane = this.inject(UiPlane);

    private drawStart: number = 0;

    private drawLength: number = 0;

    private drawing: boolean = false;

    private charsPerSecond = 80;

    private margin = 48;

    constructor() {
        super();

        const width = this.uiPlane.getWidth('100%') - 2 * this.uiPlane.getWidth(this.margin);

        this.textMesh = new Text();

        enableTextLength(this.textMesh);

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

    public updateText(text: string): void {
        assert(this.textMesh);

        const textUnchanged = this.textMesh.text === text;

        this.textMesh.text = text;
        this.drawLength = text.length;
        this.drawStart = 0;
        this.drawing = false;

        setTextLength(this.textMesh, 0);

        if (textUnchanged) {
            this.drawing = true;
        } else {
            this.textMesh.sync(() => this.drawing = true);
        }
    }

    protected onInit(): void {
        this.updateText('Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text, Some very long and important text,');

        this.io.onInput(ViewEventType.Click, () => {
            this.updateText('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
        });

        this.io.add(PlaneName.Ui, this.textMesh);

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

                    setTextLength(this.textMesh, length);

                    if (length >= this.drawLength) {
                        this.drawing = false;
                    }
                }
            }
        }
    }
}
