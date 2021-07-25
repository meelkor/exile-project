import { RootScene } from '@exile/client/engine/scene/root-scene';
import { OverworldScene } from '@exile/client/game/modules/overworld/overworld.scn';

export class MainScene extends RootScene {

    protected onAdd(): void {
        const overworld = this.instantiate(OverworldScene);

        this.add(overworld);
    }
}
