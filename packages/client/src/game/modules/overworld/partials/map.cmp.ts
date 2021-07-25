import { Component } from '@exile/client/engine/component/component';
import { MapTerritoryCmp } from '@exile/client/game/modules/overworld/partials/map-territory.cmp';

export class MapCmp extends Component {

    public setTerritories(): void {
        // todo
    }

    public updateTerritory(): void {
        // todo
    }

    protected onInit(): void {
        const territory = this.instantiate(MapTerritoryCmp);
        this.add(territory);
    }

    protected onTick(): void { /** noop */ }

}
