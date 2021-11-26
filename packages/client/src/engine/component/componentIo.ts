import { ViewEventListener, ViewEventType } from '@exile/client/engine/input/view-event-type';
import { ViewEvents } from '@exile/client/engine/input/view-events';
import { ViewObjectQuery } from '@exile/client/engine/input/view-object-query';
import { Injectable } from '@exile/common/utils/di';
import { MeshLike } from '@exile/common/types/mesh-like';
import { Renderer } from '@exile/client/engine/renderer-gl/renderer';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';

export class ComponentIo extends Injectable {

    private viewEvents = this.inject(ViewEvents);

    private renderer = this.inject(Renderer);

    constructor(private nodeId: number) {
        super();
    }

    /**
     * Add listener on given view event for every mesh this component rendered
     */
    public onInput<T extends ViewEventType>(viewEvent: T, handler: ViewEventListener<T>): void {
        const q: ViewObjectQuery = { treeNode: this.nodeId };

        this.viewEvents.on(this.nodeId, viewEvent, q, handler);
    }

    /**
     * Add listener on given view event for any supported object query.
     */
    public queryInput<T extends ViewEventType>(viewEvent: T, query: IoViewObjectQuery, handler: ViewEventListener<T>): void {
        const q: ViewObjectQuery = {
            ...query,
            treeNode: 'owned' in query && query.owned ? this.nodeId : query.treeNode,
        };

        this.viewEvents.on(this.nodeId, viewEvent, q, handler);
    }

    /**
     * Add given mesh into scene under given ID while handling all necessary
     * registering with events etc.
     */
    public add(plane: PlaneName, mesh: MeshLike): void {
        this.renderer.getScene(plane).add(mesh);
        this.viewEvents.registerMesh(mesh);
    }
}

export type IoViewObjectQuery = ViewObjectQuery | (Omit<ViewObjectQuery, 'nodeId'> & {
    /**
     * Shorthand for treeNode: current node
     */
    owned?: boolean;
});
