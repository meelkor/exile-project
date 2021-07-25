import { ViewConfig } from '@exile/client/engine/config/view-config';
import { InjectableGlobal } from '@exile/common/utils/di';
import { Pos } from '@exile/common/types/geometry';

const CLICK_MAX_DELTA = 12;

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

                const click = x < CLICK_MAX_DELTA && y < CLICK_MAX_DELTA;

                this.eventQueue.push({
                    type: CursorEventType.Up,
                    pos: this.pos,
                });

                if (click) {
                    this.eventQueue.push({
                        type: CursorEventType.Click,
                        from: this.lastMouseDown,
                        to: this.pos,
                    });
                }

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
            } else {
                this.eventQueue.push({
                    type: CursorEventType.Move,
                    from: prev,
                    to: this.pos,
                });
            }
        });

        canvas.addEventListener('mouseleave', e => {
            e.preventDefault();

            this.eventQueue.push({
                type: CursorEventType.Leave,
                // Technically cannot be nullish at this point
                lastPos: this.pos!,
            });

            this.pos = undefined;
            this.lastMouseDown = undefined;
        });
    }

    public getEvents(): CursorEvent[] {
        const q = this.eventQueue;

        this.eventQueue = [];

        return q;
    }
}

export type CursorEvent = CursorMoveEvent | CursorDownEvent | CursorUpEvent | CursorClickEvent | CursorLeaveEvent;

export interface CursorMoveEvent {
    type: CursorEventType.Move,
    to: Pos;
    from?: Pos;
}

export interface CursorDownEvent {
    type: CursorEventType.Down,
    pos: Pos;
}

export interface CursorUpEvent {
    type: CursorEventType.Up,
    pos: Pos;
}

export interface CursorClickEvent {
    type: CursorEventType.Click,
    from: Pos;
    to: Pos;
}

export interface CursorLeaveEvent {
    type: CursorEventType.Leave,
    lastPos: Pos;
}

export enum CursorEventType {
    Move,
    Down,
    Up,
    Click,
    /**
     * Cursor completely left canvas
     */
    Leave,
}
