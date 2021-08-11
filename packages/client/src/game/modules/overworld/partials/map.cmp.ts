import { Component } from '@exile/client/engine/component/component';
import { Territory } from '@exile/client/game/models/territory';
import { MapTerritoryCmp } from '@exile/client/game/modules/overworld/partials/map-territory.cmp';
import { ensure } from '@exile/common/utils/assert';

export class MapCmp extends Component {

    private territories: Map<number, MapTerritoryCmp> = new Map;

    public actions = {
        selectTerritory: (id: number): void => {
            ensure(this.territories.get(id)).actions.setSelected(true);
        },

        deselectTerritory: (id: number): void => {
            ensure(this.territories.get(id)).actions.setSelected(false);
        },
    };

    public setTerritories(territories: Territory[]): void {
        for (const territory of territories) {
            const cmp = this.instantiate(MapTerritoryCmp);
            cmp.actions.setTerritoryInfo(territory);
            this.territories.set(territory.id, cmp);
        }
    }

    protected onInit(): void {
        for (const cmp of this.territories.values()) {
            this.add(cmp);
        }
    }

    protected onTick(): void { /** noop */ }

}
