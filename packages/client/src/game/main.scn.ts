import { RootScene } from '@exile/client/engine/scene/root-scene';
import { HomeUiScene } from '@exile/client/game/modules/home-ui/home-ui.scn';
import { OverworldScene } from '@exile/client/game/modules/overworld/overworld.scn';

export class MainScene extends RootScene {

    protected onAdd(): void {
        const overworld = this.instantiate(OverworldScene);
        const homeUiScene = this.instantiate(HomeUiScene);

        this.add(overworld);
        this.add(homeUiScene);
    }
}
