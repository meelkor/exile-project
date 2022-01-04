import { TreeNode } from '@exile/client/engine/core/tree-node';
import { Store } from '@exile/client/engine/store/store';

export abstract class Scene extends TreeNode {

    protected store = this.inject(Store);

    protected onTick(): void {
        // Scenes won't probably need this in most of the cases
    }

    protected onDestroy(): void {
        this.store.offNode(TreeNode.getId(this));
    }
}
