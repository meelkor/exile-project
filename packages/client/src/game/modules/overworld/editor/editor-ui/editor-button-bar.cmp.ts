import { Component } from '@exile/client/engine/component/component';
import { EditorButtonCmp } from '@exile/client/game/modules/overworld/editor/editor-ui/editor-button.cmp';
import { Pos } from '@exile/common/types/geometry';
import { Immutable } from '@exile/common/types/immutable';

/**
 * Component for grouping and positioning buttons into bars
 */
export class EditorButtonBarCmp extends Component {

    public readonly options: Immutable<EditorButtonBarOptions> = {
        position: {
            x: 0,
            y: 0,
        },
        active: null,
    };

    private buttons: Map<string, EditorButtonCmp> = new Map;

    private activeButton: string | null = null;

    public actions = {
        addButton: (key: string, button: EditorButtonCmp): void => {
            this.buttons.set(key, button);

            const offset = (this.buttons.size - 1) * 40;

            button.update({
                position: {
                    x: this.options.position.x + offset,
                    y: this.options.position.y,
                },
            });

            this.add(button);
        },
        setActive: (key: string): void => {
            if (this.activeButton) {
                this.buttons.get(this.activeButton)!.update({ active: false });
            }

            this.buttons.get(key)!.update({ active: true });
            this.activeButton = key;
        },
    }

    public update(options: Partial<EditorButtonBarOptions>): void {
        Object.assign(this.options, options);
    }

    public onInit(): void { /* */ }

    public onTick(): void { /* */ }
}

export interface EditorButtonBarOptions {
    position: Pos;
    active: string | null;
}
