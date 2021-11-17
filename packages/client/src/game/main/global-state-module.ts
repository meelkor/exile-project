import { RefChange, StateModule } from '@exile/client/engine/store/state-module';
import { Territory } from '@exile/client/game/models/territory';
import { assert } from '@exile/common/utils/assert';

export class GlobalStateModule extends StateModule<GlobalState, GlobalModuleChange, GlobalModulePayloads> {

    /// Getters and utilities ///

    public getTerritoryList(): Territory[] {
        return Object.values(this.state.territories);
    }

    public findTerritory(tId: number): Territory {
        const t =this.state.territories[tId];

        assert(t, `Territory ${tId} doesn't exist`);

        return t;
    }

    /// Actions ///

    public selectTerritory(territoryId?: number): void {
        const selected = this.state.selectedTerritory;

        if (territoryId !== selected) {
            this.state.selectedTerritory = territoryId;

            this.enqueue(
                GlobalModuleChange.SelectedTerritory,
                {
                    before: selected,
                    after: territoryId,
                },
            );
        }
    }
}

export interface GlobalState {
    selectedTerritory?: number;
    territories: Record<number, Territory>;
}

export enum GlobalModuleChange {
    SelectedTerritory,
}

interface GlobalModulePayloads {
    [GlobalModuleChange.SelectedTerritory]: RefChange<number>;
}
