import { Component } from '@exile/client/engine/component/component';
import { Territory } from '@exile/client/game/models/territory';
import { MapTerritoryCmp } from '@exile/client/game/modules/overworld/partials/map-territory.cmp';
import { TerritoryController } from '@exile/client/game/modules/overworld/partials/territory-controller';
import { ensure } from '@exile/common/utils/assert';

export class MapCmp extends Component {

    private territories: Map<number, MapTerritoryCmp> = new Map;

    private territoryController = this.inject(TerritoryController);

    public actions = {
        setTerritories: (territories: Territory[]): void => {
            this.territoryController.register(territories);

            for (const territory of territories) {
                const cmp = this.instantiate(MapTerritoryCmp);
                cmp.actions.setTerritoryInfo(territory);
                this.territories.set(territory.id, cmp);
            }
        },

        selectTerritory: (id: number): void => {
            ensure(this.territories.get(id), `Missing territory #${id}`)
                .actions.setSelected(true);
        },

        deselectTerritory: (id: number): void => {
            ensure(this.territories.get(id), `Missing territory #${id}`)
                .actions.setSelected(false);
        },
    };


    protected onInit(): void {
        for (const cmp of this.territories.values()) {
            this.add(cmp);
        }
    }

    protected onTick(): void { /** noop */ }

}
