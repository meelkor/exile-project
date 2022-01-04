import { SignedHandler } from '@exile/client/engine/core/signed-handler';
import { TreeNode } from '@exile/client/engine/core/tree-node';
import { assert } from '@exile/common/utils/assert';
import { InjectableGlobal } from '@exile/common/utils/di';

export abstract class Events<TEvent extends SupportedEventType, TPayloads extends PayloadMap<TEvent> = { [k in TEvent]: null }, TReturn = undefined> extends InjectableGlobal {

    private listeners: Map<TEvent, Set<EventHandlerInfo<this, TEvent, TPayloads, TReturn>>> = new Map();

    private listenersByNode: Map<number, Map<TEvent, EventHandlerInfo<this, TEvent, TPayloads, TReturn>[]>> = new Map();

    public on<T extends TEvent>(event: T, { handler, nodeId }: SignedHandler<(payload: TPayloads[T], from: this) => TReturn>): void {
        const handlerInfo = {
            handler,
            node: nodeId,
        } as unknown as EventHandlerInfo<this, TEvent, TPayloads, TReturn>;

        let set = this.listeners.get(event);

        if (!set) {
            set = new Set();
            this.listeners.set(event, set);
        }

        set.add(handlerInfo);

        let nodeEventMap = this.listenersByNode.get(nodeId);

        if (!nodeEventMap) {
            nodeEventMap = new Map();
            this.listenersByNode.set(nodeId, nodeEventMap);
        }

        let evArray = nodeEventMap.get(event);

        if (!evArray) {
            evArray = [];
            nodeEventMap.set(event, evArray);
        }

        evArray.push(handlerInfo);
    }

    public offNode(nodeId: number): void {
        const eventMap = this.listenersByNode.get(nodeId) || [];

        for (const [event, handlers] of eventMap) {
            const listeners = this.listeners.get(event);

            assert(listeners, 'No listeners found for given pointer');

            for (const handler of handlers) {
                listeners.delete(handler);
            }
        }

        this.listenersByNode.delete(nodeId);
    }

    protected emit(event: TEvent, payload: TPayloads[TEvent]): void {
        const handlers = this.listeners.get(event);

        if (handlers) {
            for (const handlerInfo of handlers) {
                handlerInfo.handler(payload, this);
            }
        }
    }

    protected nodeListensOnEvent(nodeId: number, event: TEvent): boolean {
        return !!this.listenersByNode.get(nodeId)?.has(event);
    }

    protected emitForNode(nodeId: number, event: TEvent, payload: TPayloads[TEvent]): TReturn[] {
        const handlers = this.listenersByNode.get(nodeId)?.get(event);

        assert(handlers?.length, 'Cannot emit event for node without handlers');

        const returnVals = handlers.map(({ handler }) => handler(payload, this));

        return returnVals;
    }
}

export type PayloadMap<TEvent extends SupportedEventType> = Record<TEvent, unknown>;

export interface EventHandlerInfo<TFrom, TEvent extends SupportedEventType, TPayloads extends PayloadMap<TEvent>, TReturn> {
    handler: (p: TPayloads[TEvent], from: TFrom) => TReturn;
    node: TreeNode;
}

export type SupportedEventType = string | number | symbol;
