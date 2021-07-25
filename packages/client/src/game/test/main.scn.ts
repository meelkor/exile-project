import { RootScene } from '@exile/client/engine/scene/root-scene';
import { DialogCmp } from '@exile/client/game/test/dialog.cmp';

export class MainScene extends RootScene {

    protected onAdd(): void {
        const dialog = this.instantiate(DialogCmp);

        this.add(dialog);
    }
}
