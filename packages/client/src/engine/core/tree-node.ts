import { GlobalTreeNode } from '@exile/client/engine/core/global-tree-node';
import { assert } from '@exile/common/utils/assert';
import { Injectable } from '@exile/common/utils/di';
import { Counter } from '@exile/common/utils/counter';
import { HookAfterConstructed } from '@exile/common/utils/di/hooks';

/**
 * Class representing a node in the game view tree which includes components,
 * scenes and maybe more where all have the same lifecycle: when it's added to
 * a parent, it starts affecting the game and when removed, all its children
 * are removed as well.
 */
export abstract class TreeNode<TChild extends TreeNode<any> = TreeNode<any>> extends Injectable {

    public abstract actions: Record<string, (...args: any[]) => any>;

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

    protected abstract onDestroy(): void;

    protected abstract onAdd(): void;

    protected abstract onTick(): void;

    private readonly instanceId: number = Counter.make();

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

    protected override [HookAfterConstructed](): void {
        for (const [key, fn] of Object.entries(this.actions)) {
            this.actions[key] = this.action(fn);
        }
    }

    /**
     * Mark given function as an action and make it a part of the node's
     * lifecycle.
     */
    private action<T extends (...args: any[]) => any>(fn: T): T {
        return ((...args: Parameters<T>): ReturnType<T> => {
            GlobalTreeNode.set(this);
            const rv = fn(...args);
            GlobalTreeNode.clear(this);
            return rv;
        }) as any as T;
    }

    private tick(hrt: number): void {
        this.onTick();

        for (const child of this.children) {
            TreeNode.runTick(child, hrt);
        }
    }
}
