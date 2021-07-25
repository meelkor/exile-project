import { TreeNode } from '@exile/client/engine/core/tree-node';
import { assert } from '@exile/common/utils/assert';

/**
 * Whenever tree node's lifecycle action (init, event handler etc.) is called,
 * it should be registered with the GlobalTreeNode first, so the subsequent
 * calls can be assigned to that node.
 */
export namespace GlobalTreeNode {

    const nodeStack: TreeNode[] = [];

    export function set(newNode: TreeNode): void {
        nodeStack.push(newNode);
    }

    export function clear(oldNode: TreeNode): void {
        assert(oldNode === nodeStack[nodeStack.length - 1], 'Deleting another node');
        nodeStack.pop();
    }

    export function get(): TreeNode | null {
        return nodeStack[nodeStack.length - 1] || null;
    }
}
