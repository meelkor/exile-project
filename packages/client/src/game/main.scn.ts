import { RootScene } from '@exile/client/engine/scene/root-scene';
import { Store } from '@exile/client/engine/store/store';
import { HomeUiScene } from '@exile/client/game/modules/home-ui/home-ui.scn';
import { OverworldScene } from '@exile/client/game/modules/overworld/overworld.scn';
import { GlobalStateModule } from '@exile/client/game/main/global-state-module';
import { MainInit } from '@exile/client/game/main/main-init';
import { PerformanceInfo } from '@exile/client/engine/renderer-gl/debug/performance-info.cmp';

export class MainScene extends RootScene {

    protected onAdd(): void {

        const store = this.inject(Store);
        const mainInit = this.inject(MainInit);

        // This should be handled by some preloading service, which will
        // intiate store modules the scene we want to open depends on
        mainInit.initGlobalState().subscribe(state => {
            store.register(GlobalStateModule, new GlobalStateModule(state));

            const overworld = this.instantiate(OverworldScene);
            const homeUiScene = this.instantiate(HomeUiScene);

            this.add(overworld);
            this.add(homeUiScene);
        });

        this.add(this.instantiate(PerformanceInfo));
    }
}
