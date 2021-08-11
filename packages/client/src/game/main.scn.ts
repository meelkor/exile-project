import { RootScene } from '@exile/client/engine/scene/root-scene';
import { Store } from '@exile/client/engine/store/store';
import { ClaimState } from '@exile/client/game/models/territory';
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
            territories: territoryListToDict([
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 0,
                    y: 0,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 0,
                    y: 1,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 0,
                    y: 2,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 0,
                    y: 3,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 1,
                    y: 0,
                },
                {
                    claim: ClaimState.Free,
                    slots: [],
                    x: 1,
                    y: 1,
                },
                {
                    claim: ClaimState.Free,
                    slots: [],
                    x: 1,
                    y: 2,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 1,
                    y: 3,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 2,
                    y: 0,
                },
                {
                    claim: ClaimState.Free,
                    slots: [],
                    x: 2,
                    y: 1,
                },
                {
                    claim: ClaimState.Free,
                    slots: [],
                    x: 2,
                    y: 2,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 2,
                    y: 3,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 3,
                    y: 0,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 3,
                    y: 1,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 3,
                    y: 2,
                },
                {
                    claim: ClaimState.Unknown,
                    slots: [],
                    x: 3,
                    y: 3,
                },
            ]),
        }));

        this.add(overworld);
        this.add(homeUiScene);
    }
}
