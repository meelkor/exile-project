import { Store } from '@exile/client/engine/store/store';
import { EditableMapTerritoryCmp } from '@exile/client/game/modules/overworld/editor/editable-map-territory.cmp';
import { MapEditorEvent, MapEditorStateModule } from '@exile/client/game/modules/overworld/editor/map-editor-state-module';
import { MapTerritoryCmp } from '@exile/client/game/modules/overworld/map/map-territory.cmp';
import { MapCmp } from '@exile/client/game/modules/overworld/map/map.cmp';

export class EditableMapCmp extends MapCmp {

    public override onInit(): void {
        // Create editable territories instead of regular ones
        EditableMapCmp.substitute(this, MapTerritoryCmp, EditableMapTerritoryCmp);

        super.onInit();

        const stateModule = this.inject(Store).require(MapEditorStateModule);

        stateModule.on(MapEditorEvent.ObjectAdded, this.sign(obj => {
            this.overhexController.renderStandaloneObject(obj);
        }));
    }
}
