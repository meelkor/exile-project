import { ViewConfig } from '@exile/client/engine/config/view-config';
import { InjectableGlobal } from '@exile/common/utils/di';
import { MappedStack } from '@exile/common/structures/mapped-stack';
import { GlobalTreeNode } from '@exile/client/engine/core/global-tree-node';
import { TreeNode } from '@exile/client/engine/core/tree-node';

export class Cursor extends InjectableGlobal {

    private viewConfig = this.inject(ViewConfig);

    private cursorStack: MappedStack<TreeNode | null, CursorType> = new MappedStack();

    public setCursor(cursor: CursorType): void {
        const owner = GlobalTreeNode.get();
        this.cursorStack.delete(owner);
        this.cursorStack.push(owner, cursor);
        this.update();
    }

    public reset(): void {
        const owner = GlobalTreeNode.get();
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
