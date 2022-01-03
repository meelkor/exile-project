import * as three from 'three';
import { ListMap } from '@exile/common/structures/list-map';
import { InjectableGlobal } from '@exile/common/utils/di';
import { ViewEventListener, ViewEventMap, ViewEventType } from '@exile/client/engine/input/view-event-type';
import { Renderer } from '@exile/client/engine/renderer-gl/renderer';
import { CursorEvent, CursorEventType, InputObserver } from '@exile/client/engine/input/input-observer';
import { ViewEventHandler } from '@exile/client/engine/input/view-event-handler';
import { ViewObjectQuery } from '@exile/client/engine/input/view-object-query';
import { NodeIntersection } from '@exile/client/engine/renderer-gl/internal/intersection';
import { Pos } from '@exile/common/types/geometry';
import { MeshLike } from '@exile/common/types/mesh-like';

const HANDLERS_KEY = Symbol();

/**
 * View event service for detecting input events on meshes by storing handlers
 * directly to the meshes objects. For that to work, applyToObject needs to be
 * called on every mesh in scene.
 */
export class ViewEvents extends InjectableGlobal {

    private inputObserver = this.inject(InputObserver);
    private renderer = this.inject(Renderer);

    private handlers: ListMap<number, ViewEventHandler> = new ListMap();

    private hoveredMeshes: Set<three.Mesh> = new Set();

    public emitEvents(): void {
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
                this.hoveredMeshes.delete(int.mesh);

                stopInAndMove = this.emit(int.mesh, ViewEventType.MouseOut, null);

                if (stopInAndMove) {
                    break;
                }
            }

            /**
             * Nodes that remain in this set after all the mousemove iterations
             * became unhovered without proper DOM event happened (probably
             * changed location on frame.)
             */
            const zombieNodes = new Set(this.hoveredMeshes);

            if (!stopInAndMove) {
                for (const [intFrom, intTo] of grouped.both) {
                    stopInAndMove = this.emit(intFrom.mesh, ViewEventType.MouseMove, {
                        from: intFrom.position,
                        to: intTo.position,
                    });

                    zombieNodes.delete(intFrom.mesh);

                    if (stopInAndMove) {
                        break;
                    }
                }
            }

            for (const int of grouped.bOnly) {
                this.hoveredMeshes.add(int.mesh);
                zombieNodes.delete(int.mesh);

                if (this.emit(int.mesh, ViewEventType.MouseIn, null)) {
                    break;
                }
            }

            for (const zombieNode of zombieNodes) {
                // In zombie cases the event can't stop propagation
                this.emit(zombieNode, ViewEventType.MouseOut, null);
            }
        } else if (e.type === CursorEventType.Down || e.type === CursorEventType.Up) {
            const ints = this.renderer.project(e.pos);
            const viewEventType = e.type === CursorEventType.Down
                ? ViewEventType.MouseDown
                : ViewEventType.MouseUp;

            for (const int of ints) {
                const payload = {
                    pos: {
                        x: int.position.x,
                        y: int.position.y,
                    },
                };

                if (this.emit(int.mesh, viewEventType, payload)) {
                    break;
                }
            }
        } else if (e.type === CursorEventType.Click) {
            const groups = this.groupIntersections(e.from, e.to);

            for (const [, int] of groups.both) {
                const payload = {
                    pos: {
                        x: int.position.x,
                        y: int.position.y,
                    },
                };

                if (this.emit(int.mesh, ViewEventType.Click, payload)) {
                    break;
                }
            }
        } else if (e.type === CursorEventType.Leave) {
            for (const int of this.renderer.project(e.lastPos)) {
                this.emit(int.mesh, ViewEventType.MouseOut, null);
            }
        } else if (e.type === CursorEventType.Wheel) {
            for (const int of this.renderer.project(e.pos)) {
                this.emit(int.mesh, ViewEventType.Wheel, {
                    delta: e.delta,
                    pos: {
                        x: int.position.x,
                        y: int.position.y,
                    },
                });
            }
        }
    }

    public on<T extends ViewEventType>(ownerNode: number, event: T, query: ViewObjectQuery, handler: ViewEventListener<T>): void {
        const eventHandler = new ViewEventHandler(ownerNode, event, query, handler);

        // https://github.com/microsoft/TypeScript/issues/29528
        this.handlers.add(ownerNode, eventHandler as any);
        this.applyToAll(eventHandler as any);
    }

    public offNode(_ownerNode: number): void {
        // todo
    }

    /**
     * Each mesh needs to be registered to work
     */
    public registerMesh(mesh: MeshLike): void {
        const registered = Object.assign(mesh, {
            [HANDLERS_KEY]: {
                [ViewEventType.Click]: [],
                [ViewEventType.MouseDown]: [],
                [ViewEventType.MouseUp]: [],
                [ViewEventType.MouseMove]: [],
                [ViewEventType.MouseOut]: [],
                [ViewEventType.MouseIn]: [],
                [ViewEventType.Wheel]: [],
            },
        }) as RegisteredMesh;

        this.applyAllToMesh(registered);
    }

    /**
     * Go through all objects and register given handler if applicable
     */
    private applyToAll(handler: ViewEventHandler): void {
        for (const mesh of this.getAllRegisteredMeshes()) {
            this.applyHandler(handler, mesh);
        }
    }

    private getAllRegisteredMeshes(): RegisteredMesh[] {
        return this.renderer.getAllObjects()
            .filter<RegisteredMesh>(isRegisteredMesh);
    }

    private applyAllToMesh(mesh: RegisteredMesh): void {
        for (const handler of this.handlers.allValues()) {
            this.applyHandler(handler, mesh);
        }
    }

    /**
     * Apply handler on the mesh if applicable
     */
    private applyHandler(handler: ViewEventHandler, mesh: RegisteredMesh): void {
        const q = handler.query;

        const ok = (q.meshId === undefined || q.meshId === mesh.id)
            && (q.treeNode === undefined || q.treeNode === mesh.userData.nodeId)
            && (!q.tags || q.tags.every(t => mesh.tags && mesh.tags.has(t)));

        if (ok) {
            mesh[HANDLERS_KEY][handler.event].push(handler.callback);
            mesh.userData.interactive = true;
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

        const bIntMap = new Map(bInts.map(int => [int.mesh.id, int]));

        const out: GroupedIntersections = {
            aOnly: [],
            bOnly: [],
            both: [],
        };

        for (const int of aInts) {
            if (bIntMap.has(int.mesh.id)) {
                if (this.hoveredMeshes.has(int.mesh)) {
                    out.both.push([int, bIntMap.get(int.mesh.id)!]);
                } else {
                    out.bOnly.push(int);
                }

                bIntMap.delete(int.mesh.id);
            } else {
                out.aOnly.push(int);
            }
        }

        for (const int of bIntMap.values()) {
            out.bOnly.push(int);
        }

        return out;
    }

    private emit<T extends ViewEventType>(mesh: three.Mesh, event: T, payload: ViewEventMap[T]['info']): boolean {
        if (isRegisteredMesh(mesh)) {
            let stop = false;

            for (const cb of mesh[HANDLERS_KEY][event]) {
                stop = !!cb({
                    mesh,
                    info: payload,
                });
            }

            return stop;
        } else {
            return false;
        }
    }
}

function isRegisteredMesh(v: three.Object3D): v is RegisteredMesh {
    return HANDLERS_KEY in v;
}

type RegisteredMesh = MeshLike & {
    [HANDLERS_KEY]: Record<ViewEventType, ViewEventListener[]>;
    tags?: Set<number>;
}

interface GroupedIntersections {
    aOnly: NodeIntersection[];
    bOnly: NodeIntersection[];
    both: [NodeIntersection, NodeIntersection][];
}

