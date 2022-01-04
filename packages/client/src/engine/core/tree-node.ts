import { assert } from '@exile/common/utils/assert';
import { Injectable } from '@exile/common/utils/di';
import { Counter } from '@exile/common/utils/counter';
import { SignedHandler } from '@exile/client/engine/core/signed-handler';

/**
 * Class representing a node in the game view tree which includes components,
 * scenes and maybe more where all have the same lifecycle: when it's added to
 * a parent, it starts affecting the game and when removed, all its children
 * are removed as well.
 */
export abstract class TreeNode<TChild extends TreeNode<any> = TreeNode<any>> extends Injectable {

    protected children: Set<TChild> = new Set();

    /**
     * Human readable name used for debugging
     */
    private static _name: string = 'TreeNode';

    private readonly instanceId: number = Counter.make();

    public static getId(node: TreeNode): number {
        return node.instanceId;
    }

    public static getName(node: TreeNode): string {
        const Ctr = node.constructor as typeof TreeNode;
        return `${Ctr._name}#${node.instanceId}`;
    }

    public static runTick(node: TreeNode, hrt: number): void {
        node.tick(hrt);
    }

    protected abstract onDestroy(): void;

    protected abstract onAdd(): void;

    protected abstract onTick(hrt: number): void;

    /**
     * Sign function so it can be passed as handler
     */
    protected sign<T extends Function>(method: T): SignedHandler<T> {
        return {
            handler: method,
            nodeId: this.instanceId,
        };
    }

    protected add(child: TChild): void {
        assert(!this.children.has(child), `Node of type ${TreeNode.getName(child)} is already a child of node of type ${TreeNode.getName(this)}`);

        this.children.add(child);
        child.onAdd();
    }

    protected destroy(child: TChild): void {
        assert(this.children.has(child), `Node of type ${TreeNode.getName(child)} is not a child of node of type ${TreeNode.getName(this)}`);

        for (const childChild of child.children) {
            child.destroy(childChild);
        }

        child.onDestroy();
        this.children.delete(child);
    }

    private tick(hrt: number): void {
        this.onTick(hrt);

        for (const child of this.children) {
            TreeNode.runTick(child, hrt);
        }
    }
}
