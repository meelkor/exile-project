import { GlobalTreeNode } from '@exile/client/engine/core/global-tree-node';
import { TreeNode } from '@exile/client/engine/core/tree-node';
import { assert } from '@exile/common/utils/assert';
import { InjectableGlobal } from '@exile/common/utils/di';

export abstract class Events<TEvent extends SupportedEventType, TPayloads extends PayloadMap<TEvent> = { [k in TEvent]: null }, TReturn = undefined> extends InjectableGlobal {

    private listeners: Map<TEvent, Set<EventHandlerInfo<this, TEvent, TPayloads, TReturn>>> = new Map();

    private listenersByNode: Map<TreeNode | null, Map<TEvent, EventHandlerInfo<this, TEvent, TPayloads, TReturn>[]>> = new Map();

    public on<T extends TEvent>(event: T, handler: (payload: TPayloads[T], from: this) => TReturn): void {
        const currentNode = GlobalTreeNode.get();

        const handlerInfo = {
            handler,
            node: currentNode,
        } as EventHandlerInfo<this, TEvent, TPayloads, TReturn>;

        let set = this.listeners.get(event);

        if (!set) {
            set = new Set();
            this.listeners.set(event, set);
        }

        set.add(handlerInfo);

        let nodeEventMap = this.listenersByNode.get(currentNode);

        if (!nodeEventMap) {
            nodeEventMap = new Map();
            this.listenersByNode.set(currentNode, nodeEventMap);
        }

        let evArray = nodeEventMap.get(event);

        if (!evArray) {
            evArray = [];
            nodeEventMap.set(event, evArray);
        }

        evArray.push(handlerInfo);
    }

    public offNode(node: TreeNode): void {
        const eventMap = this.listenersByNode.get(node) || [];

        for (const [event, handlers] of eventMap) {
            const listeners = this.listeners.get(event);

            assert(listeners, 'No listeners found for given pointer');

            for (const handler of handlers) {
                listeners.delete(handler);
            }
        }

        this.listenersByNode.delete(node);
    }

    protected emit(event: TEvent, payload: TPayloads[TEvent]): void {
        const handlers = this.listeners.get(event);

        if (handlers) {
            for (const handlerInfo of handlers) {
                GlobalTreeNode.set(handlerInfo.node);
                handlerInfo.handler(payload, this);
                GlobalTreeNode.clear(handlerInfo.node);
            }
        }
    }

    protected nodeListensOnEvent(node: TreeNode, event: TEvent): boolean {
        return !!this.listenersByNode.get(node)?.has(event);
    }

    protected emitForNode(node: TreeNode, event: TEvent, payload: TPayloads[TEvent]): TReturn[] {
        const handlers = this.listenersByNode.get(node)?.get(event);

        assert(handlers?.length, 'Cannot emit event for node without handlers');

        GlobalTreeNode.set(node);
        const returnVals = handlers.map(({ handler }) => handler(payload, this));
        GlobalTreeNode.clear(node);

        return returnVals;
    }
}

export type PayloadMap<TEvent extends SupportedEventType> = Record<TEvent, unknown>;

export interface EventHandlerInfo<TFrom, TEvent extends SupportedEventType, TPayloads extends PayloadMap<TEvent>, TReturn> {
    handler: (p: TPayloads[TEvent], from: TFrom) => TReturn;
    node: TreeNode;
}

export type SupportedEventType = string | number | symbol;
