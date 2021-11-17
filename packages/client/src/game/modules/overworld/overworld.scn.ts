import { GameEvents } from '@exile/client/engine/game-event/game-events';
import { RootScene } from '@exile/client/engine/scene/root-scene';
import { OverworldEvents } from '@exile/client/game/modules/overworld/overworld-events';
import { CameraTrapCmp } from '@exile/client/game/modules/overworld/map/camera-trap.cmp';
import { MapCmp } from '@exile/client/game/modules/overworld/map/map.cmp';
import { GlobalStateModule, GlobalModuleChange } from '@exile/client/game/main/global-state-module';
import { asNumberOrUndefined } from '@exile/common/utils/assert';

export class OverworldScene extends RootScene {

    private gameEvents = this.inject(GameEvents);

    protected onAdd(): void {
        const map = this.instantiate(MapCmp);
        const cameraTrap = this.instantiate(CameraTrapCmp);

        const globalStateModule = this.store.require(GlobalStateModule);

        map.actions.setTerritories(globalStateModule.getTerritoryList());

        this.add(map);
        this.add(cameraTrap);

        this.registerGameEventListeners();
        this.registerStoreListeners(map);
    }

    private registerGameEventListeners(): void {
        const globalStateModule = this.store.require(GlobalStateModule);

        this.gameEvents.on(OverworldEvents.SelectTerritory, payload => {
            const territoryId = asNumberOrUndefined(payload);

            globalStateModule.selectTerritory(territoryId);
        });
    }

    private registerStoreListeners(map: MapCmp): void {
        const globalStateModule = this.store.require(GlobalStateModule);

        globalStateModule.on(GlobalModuleChange.SelectedTerritory, ({ after, before }) => {
            if (before) {
                map.actions.deselectTerritory(before);
            }

            if (after) {
                map.actions.selectTerritory(after);
            }
        });
    }
}
