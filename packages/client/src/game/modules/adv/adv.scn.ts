import { RootScene } from '@exile/client/engine/scene/root-scene';
import { AdvTextCmp } from '@exile/client/game/modules/adv/adv-text.cmp';
import { AdvUiCmp } from '@exile/client/game/modules/adv/adv-ui.cmp';

export class AdvScene extends RootScene {

    protected onAdd(): void {
        this.add(this.instantiate(AdvTextCmp));
        this.add(this.instantiate(AdvUiCmp));
    }
}
