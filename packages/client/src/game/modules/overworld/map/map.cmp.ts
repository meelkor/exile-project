import { Component } from '@exile/client/engine/component/component';
import { Territory } from '@exile/client/game/models/territory';
import { MapTerritoryCmp } from '@exile/client/game/modules/overworld/map/map-territory.cmp';
import { OverhexController } from '@exile/client/game/modules/overworld/map/overhex/overhex-controller';
import { ensure } from '@exile/common/utils/assert';

export class MapCmp extends Component {

    private territories: Map<number, MapTerritoryCmp> = new Map;

    protected overhexController = this.provide(OverhexController);

    public setTerritories(territories: Territory[]): void {
        this.overhexController.register(territories);

        for (const territory of territories) {
            const cmp = this.instantiate(MapTerritoryCmp);
            cmp.setTerritoryInfo(territory);
            this.territories.set(territory.id, cmp);
        }
    }

    public selectTerritory(id: number): void {
        ensure(this.territories.get(id), `Missing territory #${id}`)
            .setSelected(true);
    }

    public deselectTerritory(id: number): void {
        ensure(this.territories.get(id), `Missing territory #${id}`)
            .setSelected(false);
    }


    protected onInit(): void {
        for (const cmp of this.territories.values()) {
            this.add(cmp);
        }
    }

    protected onTick(): void { /** noop */ }

}
