import { RootScene } from '@exile/client/engine/scene/root-scene';
import { DialogService } from '@exile/client/game/modules/dialogs/dialog.svc';

export class HomeUiScene extends RootScene {

    private dialogService = this.inject(DialogService);

    protected onAdd(): void {
        this.add(this.dialogService.open({
            title: 'Very Important Thing',
            width: 420,
            zIndex: 0.9,
        }));
    }
}
