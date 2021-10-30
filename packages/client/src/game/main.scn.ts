import { RootScene } from '@exile/client/engine/scene/root-scene';
import { Store } from '@exile/client/engine/store/store';
import { strMapToTerritories } from "@exile/client/game/fun/territoryMap";
import { territoryListToDict } from '@exile/client/game/models/territoryUtils';
import { HomeUiScene } from '@exile/client/game/modules/home-ui/home-ui.scn';
import { OverworldScene } from '@exile/client/game/modules/overworld/overworld.scn';
import { GlobalStateModule } from '@exile/client/game/store/global-state-module';

export class MainScene extends RootScene {

    protected onAdd(): void {
        const overworld = this.instantiate(OverworldScene);
        const homeUiScene = this.instantiate(HomeUiScene);

        const store = this.inject(Store);

        // This should be handled by some preloading service, which will
        // intiate store modules the scene we want to open depends on
        store.register(GlobalStateModule, new GlobalStateModule({
            territories: territoryListToDict(strMapToTerritories([
                [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", "b", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", "b", "b", "g", "g", "g", "g", "g", "g", " ", " ", " ", " ", " "],
                [" ", " ", " ", "b", "b", "f", "f", "f", "f", "s", "g", " ", " ", " ", " ", " "],
                [" ", " ", " ", "b", "b", "f", "f", "f", "f", "s", "s", "g", " ", " ", " ", " "],
                [" ", " ", " ", "b", "b", "b", "f", "f", "f", "f", "s", "g", " ", " ", " ", " "],
                [" ", " ", " ", "b", "b", "b", "f", "f", "f", "f", "g", " ", " ", " ", " ", " "],
                [" ", " ", " ", "b", "g", "g", "f", "s", "s", "g", "g", " ", " ", " ", " ", " "],
                [" ", " ", " ", "b", "b", "b", "g", "g", "g", "g", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", "b", "b", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
                [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
            ])),
        }));

        this.add(overworld);
        this.add(homeUiScene);
    }
}
