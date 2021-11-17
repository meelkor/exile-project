import { RootScene } from '@exile/client/engine/scene/root-scene';
import { Store } from '@exile/client/engine/store/store';
import { GlobalStateModule } from '@exile/client/game/main/global-state-module';
import { MainInit } from '@exile/client/game/main/main-init';
import { PerformanceInfo } from '@exile/client/engine/renderer-gl/debug/performance-info.cmp';
import { MapEditorScn } from '@exile/client/game/modules/overworld/editor/map-editor.scn';

export class MainEditorScene extends RootScene {

    protected onAdd(): void {
        const store = this.inject(Store);

        this.inject(MainInit).initGlobalState().subscribe(state => {
            store.register(GlobalStateModule, new GlobalStateModule(state));

            const editor = this.instantiate(MapEditorScn);

            this.add(editor);
        });

        this.add(this.instantiate(PerformanceInfo));
    }
}
