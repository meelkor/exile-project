import { RootScene } from '@exile/client/engine/scene/root-scene';
import { RefChange } from '@exile/client/engine/store/state-module';
import { DialogCmp } from '@exile/client/game/modules/dialogs/dialog.cmp';
import { DialogService } from '@exile/client/game/modules/dialogs/dialog.svc';
import { GlobalStateModule, GlobalModuleChange } from '@exile/client/game/main/global-state-module';

export class HomeUiScene extends RootScene {

    private dialogService = this.inject(DialogService);

    private currentTerritoryDialog?: DialogCmp;

    public onSelectedTerritory({ after }: RefChange<number>, globalModule: GlobalStateModule): void {
        if (this.currentTerritoryDialog) {
            this.destroy(this.currentTerritoryDialog);
            this.currentTerritoryDialog = undefined;
        }

        if (after) {
            const t = globalModule.findTerritory(after);

            this.currentTerritoryDialog = this.dialogService.open({
                title: `Territory ${t.id}`,
                width: 380,
                zIndex: 0.9,
            });

            this.add(this.currentTerritoryDialog);
        }
    }

    protected onAdd(): void {
        const globalModule = this.store.require(GlobalStateModule);

        globalModule.on(GlobalModuleChange.SelectedTerritory, this.sign(this.onSelectedTerritory));
    }
}
