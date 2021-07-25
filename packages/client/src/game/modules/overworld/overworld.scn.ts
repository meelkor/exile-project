import { RootScene } from '@exile/client/engine/scene/root-scene';
import { CameraTrapCmp } from '@exile/client/game/modules/overworld/partials/camera-trap.cmp';
import { MapTerritoryCmp } from '@exile/client/game/modules/overworld/partials/map-territory.cmp';

export class OverworldScene extends RootScene {

    protected onAdd(): void {
        const map = this.instantiate(MapTerritoryCmp);
        const cameraTrap = this.instantiate(CameraTrapCmp);

        this.add(map);
        this.add(cameraTrap);
    }
}
