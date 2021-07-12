import { ViewConfig } from '@exile/engine/config/view-config';
import { InjectableGlobal } from '@exile/utils/di';
import { Pos } from '@exile/utils/types/geometry';

/**
 * Observe player input (DOM events) and store them for next tick.
 */
export class InputObserver extends InjectableGlobal {

    private renderingContext = this.inject(ViewConfig);

    private eventQueue: CursorEvent[] = [];

    private pos?: Pos;

    private lastMouseDown?: Pos;

    constructor() {
        super();

        const canvas = this.renderingContext.canvas;

        canvas.addEventListener('contextmenu', e => {
            e.preventDefault();
        });

        canvas.addEventListener('mousedown', e => {
            e.preventDefault();

            if (e.button === 0 && !this.lastMouseDown && this.pos) {
                this.eventQueue.push({
                    type: CursorEventType.Down,
                    pos: this.pos,
                });
                this.lastMouseDown = this.pos;
            }
        });

        canvas.addEventListener('mouseup', e => {
            e.preventDefault();

            if (e.button === 0 && this.lastMouseDown && this.pos) {

                const x = Math.abs(this.pos.x - this.lastMouseDown.x);
                const y = Math.abs(this.pos.y - this.lastMouseDown.y);

                const click = x < 5 && y < 5;

                this.eventQueue.push({
                    type: CursorEventType.Up,
                    pos: this.pos,
                    click,
                });

                this.lastMouseDown = undefined;
            }
        });

        canvas.addEventListener('mousemove', e => {
            e.preventDefault();

            const prev = this.pos;

            this.pos = {
                x: e.offsetX,
                y: e.offsetY,
            };

            const last = this.eventQueue[this.eventQueue.length - 1];

            if (last?.type === CursorEventType.Move) {
                this.eventQueue[this.eventQueue.length - 1] = {
                    type: CursorEventType.Move,
                    from: last.from,
                    to: this.pos,
                };
            } else if (prev) {
                this.eventQueue.push({
                    type: CursorEventType.Move,
                    from: prev,
                    to: this.pos,
                });
            }
        });
    }

    public getEvents(): CursorEvent[] {
        const q = this.eventQueue;

        this.eventQueue = [];

        return q;
    }
}

export type CursorEvent = CursorMoveEvent | CursorDownEvent | CursorUpEvent;

export interface CursorMoveEvent {
    type: CursorEventType.Move,
    from: Pos;
    to: Pos;
}

export interface CursorDownEvent {
    type: CursorEventType.Down,
    pos: Pos;
}

export interface CursorUpEvent {
    type: CursorEventType.Up,
    pos: Pos;
    click: boolean;
}

export enum CursorEventType {
    Move,
    Down,
    Up,
}
