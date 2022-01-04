import { ViewConfig } from '@exile/client/engine/config/view-config';
import { InjectableGlobal } from '@exile/common/utils/di';
import { MappedStack } from '@exile/common/structures/mapped-stack';

export class Cursor extends InjectableGlobal {

    private viewConfig = this.inject(ViewConfig);

    public cursorStack: MappedStack<number, CursorType> = new MappedStack();

    public update(): void {
        const current = this.cursorStack.last();
        this.viewConfig.canvas.style.cursor = current || 'auto';
    }
}

export enum CursorType {
    Default = 'default',
    Pointer = 'pointer',
}
