import { RootScene } from '@exile/client/engine/scene/root-scene';
import { Store } from '@exile/client/engine/store/store';
import { HomeUiScene } from '@exile/client/game/modules/home-ui/home-ui.scn';
import { OverworldScene } from '@exile/client/game/modules/overworld/overworld.scn';
import { GlobalStateModule } from '@exile/client/game/main/global-state-module';
import { MainInit } from '@exile/client/game/main/main-init';

export class MainScene extends RootScene {

    protected onAdd(): void {
        const overworld = this.instantiate(OverworldScene);
        const homeUiScene = this.instantiate(HomeUiScene);

        const store = this.inject(Store);
        const mainInit = this.inject(MainInit);

        // This should be handled by some preloading service, which will
        // intiate store modules the scene we want to open depends on
        mainInit.initGlobalState().subscribe(state => {
            store.register(GlobalStateModule, new GlobalStateModule(state));

            this.add(overworld);
            this.add(homeUiScene);
        });

    }
}
