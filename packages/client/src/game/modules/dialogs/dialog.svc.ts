import { UiSize } from '@exile/client/engine/renderer-gl/planes/ui-plane';
import { DialogTitleCmp } from '@exile/client/game/modules/dialogs/dialog-title.cmp';
import { DialogCmp } from '@exile/client/game/modules/dialogs/dialog.cmp';
import { InjectableGlobal } from '@exile/common/utils/di';

/**
 * Service making cretion of new dialog components easier
 */
export class DialogService extends InjectableGlobal {

    public open(options: OpenDialogService = {}): DialogCmp {
        const width = options.width || 380;
        const dialog =  this.instantiate(DialogCmp);

        dialog.offset = {
            x: options.offset || 'auto',
            y: 0,
        };

        dialog.width = width;

        dialog.zIndex = options.zIndex || 0;

        dialog.color = options.color ?? dialog.color;

        if (options.title) {
            const title = this.instantiate(DialogTitleCmp);

            title.text = options.title;

            dialog.actions.addFeature(title);
        }

        return dialog;
    }
}

export interface OpenDialogService {
    title?: string;
    width?: UiSize;
    offset?: number;
    zIndex?: number;
    color?: number;
}
