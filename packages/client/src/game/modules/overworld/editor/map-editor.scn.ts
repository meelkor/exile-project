import { CameraTrapCmp } from '@exile/client/game/modules/overworld/map/camera-trap.cmp';
import { GlobalStateModule } from '@exile/client/game/main/global-state-module';
import { MapEditorInit } from '@exile/client/game/modules/overworld/editor/map-editor-init';
import { Scene } from '@exile/client/engine/scene/scene';
import { EditableMapCmp } from '@exile/client/game/modules/overworld/editor/editable-map.cmp';

export class MapEditorScn extends Scene {

    protected onAdd(): void {
        const editor = this.inject(MapEditorInit).initAndGetComponent();
        const map = this.instantiate(EditableMapCmp);
        const cameraTrap = this.instantiate(CameraTrapCmp);

        const globalStateModule = this.store.require(GlobalStateModule);

        map.actions.setTerritories(globalStateModule.getTerritoryList());

        this.add(editor);
        this.add(cameraTrap);
        this.add(map);
    }
}
