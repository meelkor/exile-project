import { GlobalTreeNode } from '@exile/client/engine/core/global-tree-node';
import { assert } from '@exile/common/utils/assert';
import { Injectable } from '@exile/common/utils/di';
import { Counter } from '@exile/common/utils/counter';

/**
 * Class representing a node in the game view tree which includes components,
 * scenes and maybe more where all have the same lifecycle: when it's added to
 * a parent, it starts affecting the game and when removed, all its children
 * are removed as well.
 */
export abstract class TreeNode<TChild extends TreeNode<any> = TreeNode<any>> extends Injectable {

    /**
     * Human readable name used for debugging
     */
    private static _name: string = 'TreeNode';

    public static getId(node: TreeNode): number {
        return node.instanceId;
    }

    public static getName(node: TreeNode): string {
        const Ctr = node.constructor as typeof TreeNode;
        return `${Ctr._name}#${node.instanceId}`;
    }

    public static runTick(node: TreeNode, hrt: number): void {
        GlobalTreeNode.set(node);
        node.tick(hrt);
        GlobalTreeNode.clear(node);
    }

    protected children: Set<TChild> = new Set();

    protected readonly instanceId: number = Counter.make();

    protected abstract onDestroy(): void;

    protected abstract onAdd(): void;

    protected abstract onTick(): void;

    protected add(child: TChild): void {
        assert(!this.children.has(child), `Node of type ${TreeNode.getName(child)} is already a child of node of type ${TreeNode.getName(this)}`);

        GlobalTreeNode.set(child);

        this.children.add(child);
        child.onAdd();

        GlobalTreeNode.clear(child);
    }

    protected destroy(child: TChild): void {
        assert(this.children.has(child), `Node of type ${TreeNode.getName(child)} is not a child of node of type ${TreeNode.getName(this)}`);

        GlobalTreeNode.set(child);

        for (const childChild of child.children) {
            child.destroy(childChild);
        }

        child.onDestroy();
        this.children.delete(child);

        GlobalTreeNode.clear(child);
    }

    private tick(hrt: number): void {
        this.onTick();

        for (const child of this.children) {
            TreeNode.runTick(child, hrt);
        }
    }
}
