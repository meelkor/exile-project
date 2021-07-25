import { CursorEvent, CursorEventType, InputObserver } from '@exile/client/engine/input/input-observer';
import { Events } from '@exile/client/engine/core/events';
import { ViewEventMap, ViewEventType } from '@exile/client/engine/input/view-event-type';
import { Renderer } from '@exile/client/engine/renderer-gl/renderer';
import { ComponentRegistry } from '@exile/client/engine/component/component-registry';
import { Pos } from '@exile/common/types/geometry';
import { NodeIntersection } from '@exile/client/engine/renderer-gl/internal/intersection';

/**
 * Service finding components that should handle given raw view events and
 * triggering their event handlers, which may then emit game events.
 */
export class ViewEvents extends Events<ViewEventType, ViewEventMap, boolean | undefined> {

    public static emitEvents(viewEvents: ViewEvents): void {
        viewEvents.emitEvents();
    }

    private inputObserver = this.inject(InputObserver);
    private renderer = this.inject(Renderer);
    private componentRegistry = this.inject(ComponentRegistry);

    private emitEvents(): void {
        for (const e of this.inputObserver.getEvents()) {
            this.translateAndEmit(e);
        }
    }

    /**
     * Translate raw cursor event into more contextual ViewEvent and emit it to
     * components, that are listening it that event.
     */
    private translateAndEmit(e: CursorEvent): void {
        if (e.type === CursorEventType.Move) {
            const grouped: GroupedIntersections = e.from
                ? this.groupIntersections(e.from, e.to)
                : {
                    aOnly: [],
                    bOnly: this.renderer.project(e.to),
                    both: [],
                };

            // MouseMove and MouseIn have very similar roles so it is (probably)
            // desired that one stops another.
            let stopInAndMove = false;

            // TODO: mouseout needs to be also called on those that are BOTH
            //  but under the one, that blocked mousemove
            for (const int of grouped.aOnly) {
                stopInAndMove = this.emitIfListens(int.nodeId, ViewEventType.MouseOut, null);

                if (stopInAndMove) {
                    break;
                }
            }

            if (!stopInAndMove) {
                for (const [intFrom, intTo] of grouped.both) {
                    stopInAndMove = this.emitIfListens(intFrom.nodeId, ViewEventType.MouseMove, {
                        from: intFrom.position,
                        to: intTo.position,
                    });

                    if (stopInAndMove) {
                        break;
                    }
                }
            }

            for (const int of grouped.bOnly) {
                if (this.emitIfListens(int.nodeId, ViewEventType.MouseIn, null)) {
                    break;
                }
            }
        } else if (e.type === CursorEventType.Down || e.type === CursorEventType.Up) {
            const ints = this.renderer.project(e.pos);
            const viewEventType = e.type === CursorEventType.Down
                ? ViewEventType.MouseDown
                : ViewEventType.MouseUp;
            const payload = { pos: e.pos };

            for (const int of ints) {
                if (this.emitIfListens(int.nodeId, viewEventType, payload)) {
                    break;
                }
            }
        } else if (e.type === CursorEventType.Click) {
            const groups = this.groupIntersections(e.from, e.to);

            for (const [int] of groups.both) {
                if (this.emitIfListens(int.nodeId, ViewEventType.Click, { pos: e.to })) {
                    break;
                }
            }
        } else if (e.type === CursorEventType.Leave) {
            for (const int of this.renderer.project(e.lastPos)) {
                this.emitIfListens(int.nodeId, ViewEventType.MouseOut, null);
            }
        }
    }

    /**
     * Return boolean if event emitted and at least one handler returned true.
     */
    private emitIfListens<TEvent extends ViewEventType>(nodeId: number, event: TEvent, payload: ViewEventMap[TEvent]): boolean {
        const component = this.componentRegistry.get(nodeId);

        // Were not removed by the from loop: MouseIn
        if (this.nodeListensOnEvent(component, event)) {
            const results = this.emitForNode(component, event, payload);

            return results.some(r => r);
        } else {
            return false;
        }
    }

    /**
     * Group intersection depending on whether the object was found on both
     * positions or not. This is used to determine whether event should be
     * translated to Mouse In / Out or whether user didn't move between two
     * components during the click.
     */
    private groupIntersections(a: Pos, b: Pos): GroupedIntersections {
        const aInts = this.renderer.project(a);
        const bInts = this.renderer.project(b);

        const bIntMap = new Map(bInts.map(int => [int.nodeId, int]));

        const out: GroupedIntersections = {
            aOnly: [],
            bOnly: [],
            both: [],
        };

        for (const int of aInts) {
            if (bIntMap.has(int.nodeId)) {
                out.both.push([int, bIntMap.get(int.nodeId)!]);
                bIntMap.delete(int.nodeId);
            } else {
                out.aOnly.push(int);
            }
        }

        for (const int of bIntMap.values()) {
            out.bOnly.push(int);
        }

        return out;
    }
}

interface GroupedIntersections {
    aOnly: NodeIntersection[];
    bOnly: NodeIntersection[];
    both: [NodeIntersection, NodeIntersection][];
}
