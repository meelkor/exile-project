import { GameEvents } from '@exile/client/engine/game-event/game-events';
import { RootScene } from '@exile/client/engine/scene/root-scene';
import { OverworldEvents } from '@exile/client/game/modules/overworld/overworld-events';
import { CameraTrapCmp } from '@exile/client/game/modules/overworld/partials/camera-trap.cmp';
import { MapCmp } from '@exile/client/game/modules/overworld/partials/map.cmp';
import { GlobalStateModule, GlobalModuleChange } from '@exile/client/game/store/global-state-module';
import { asNumberOrUndefined } from '@exile/common/utils/assert';

export class OverworldScene extends RootScene {

    private gameEvents = this.inject(GameEvents);

    private map = this.instantiate(MapCmp);
    private cameraTrap = this.instantiate(CameraTrapCmp);

    protected onAdd(): void {

        const globalStateModule = this.store.require(GlobalStateModule);

        this.map.setTerritories(globalStateModule.getTerritoryList());

        this.add(this.map);
        this.add(this.cameraTrap);

        this.registerGameEventListeners();
        this.registerStoreListeners();
    }

    private registerGameEventListeners(): void {
        const globalStateModule = this.store.require(GlobalStateModule);

        this.gameEvents.on(OverworldEvents.SelectTerritory, payload => {
            const territoryId = asNumberOrUndefined(payload);

            globalStateModule.actions.selectTerritory(territoryId);
        });
    }

    private registerStoreListeners(): void {
        const globalStateModule = this.store.require(GlobalStateModule);

        globalStateModule.on(GlobalModuleChange.SelectedTerritory, ({ after, before }) => {
            if (before) {
                this.map.actions.deselectTerritory(before);
            }

            if (after) {
                this.map.actions.selectTerritory(after);
            }
        });
    }
}
