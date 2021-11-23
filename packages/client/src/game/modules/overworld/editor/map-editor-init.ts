import { Store } from '@exile/client/engine/store/store';
import { MapEditorStateModule } from '@exile/client/game/modules/overworld/editor/map-editor-state-module';
import { MapEditorToolType } from '@exile/client/game/modules/overworld/editor/map-editor-tool';
import { MapEditorCmp } from '@exile/client/game/modules/overworld/editor/map-editor.cmp';
import { InjectableGlobal } from '@exile/common/utils/di';

/**
 * Service which registers all necessary dependencies for the overhex editor
 * and return the editor component so it can be added to the application tree.
 */
export class MapEditorInit extends InjectableGlobal {

    public initAndGetComponent(): MapEditorCmp {
        const store = this.inject(Store);

        store.register(MapEditorStateModule, new MapEditorStateModule({
            objects: [],
            currentTool: {
                name: MapEditorToolType.Pan,
            },
        }));

        return this.instantiate(MapEditorCmp);
    }
}
