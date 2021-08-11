import { ViewConfig } from '@exile/client/engine/config/view-config';
import { InjectableGlobal } from '@exile/common/utils/di';
import { MappedStack } from '@exile/common/structures/mapped-stack';

export class Cursor extends InjectableGlobal {

    private viewConfig = this.inject(ViewConfig);

    private cursorStack: MappedStack<Object, CursorType> = new MappedStack();

    public setCursor(owner: Object, cursor: CursorType): void {
        this.cursorStack.delete(owner);
        this.cursorStack.push(owner, cursor);
        this.update();
    }

    public reset(owner: Object): void {
        this.cursorStack.delete(owner);
        this.update();
    }

    private update(): void {
        const current = this.cursorStack.last();
        this.viewConfig.canvas.style.cursor = current || 'auto';
    }
}

export enum CursorType {
    Default = 'default',
    Pointer = 'pointer',
}
