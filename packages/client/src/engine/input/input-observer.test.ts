/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-types */
import { ViewConfig } from '@exile/client/engine/config/view-config';
import { CursorEventType, InputObserver } from '@exile/client/engine/input/input-observer';
import { Injector } from '@exile/common/utils/di';

describe('@exile/client/engine/input-observer', function () {
    it('should create cursor events', function () {
        const injector = new Injector();

        const canvas = new FakeMouseEmitter();

        injector.provide(new ViewConfig({
            canvas: canvas as  any,
        }));

        const io = injector.inject(InputObserver);

        io.getEvents().should.deep.eq([]);

        canvas.move(10, 10);

        io.getEvents().should.deep.eq([]);

        canvas.move(11, 10);
        canvas.move(12, 10);
        canvas.move(13, 10);
        canvas.move(14, 12);
        canvas.move(16, 13);

        io.getEvents().should.deep.eq([{
            type: CursorEventType.Move,
            from: { x: 10, y: 10 },
            to: { x: 16, y: 13 },
        }]);
        io.getEvents().should.deep.eq([]);

        canvas.move(16, 14);
        canvas.down(16, 14);
        canvas.move(16, 15);
        canvas.move(16, 16);

        io.getEvents().should.deep.eq([
            {
                type: CursorEventType.Move,
                from: { x: 16, y: 13 },
                to: { x: 16, y: 14 },
            },
            {
                type: CursorEventType.Down,
                pos: { x: 16, y: 14 },
            },
            {
                type: CursorEventType.Move,
                from: { x: 16, y: 14 },
                to: { x: 16, y: 16 },
            },
        ]);

        canvas.up(16, 16);

        io.getEvents().should.deep.eq([
            {
                type: CursorEventType.Up,
                pos: { x: 16, y: 16 },
            },
            {
                type: CursorEventType.Click,
                from: { x: 16, y: 16 },
                to: { x: 16, y: 14 },
            },
        ]);

        canvas.down(16, 16);
        canvas.move(16, 18);
        canvas.move(16, 20);
        canvas.move(18, 21);
        canvas.move(20, 25);
        canvas.down(20, 25);
        canvas.up(20, 25);

        io.getEvents().should.deep.eq([
            {
                type: CursorEventType.Down,
                pos: { x: 16, y: 16 },
            },
            {
                type: CursorEventType.Move,
                from: { x: 16, y: 16 },
                to: { x: 20, y: 25 },
            },
            {
                type: CursorEventType.Up,
                pos: { x: 20, y: 25 },
            },
        ]);

        io.getEvents().should.deep.eq([]);
    });
});

class FakeMouseEmitter {

    private handlers: Record<string, Function[]> = {};

    public addEventListener(e: string, handler: Function) {
        if (!this.handlers[e]) {
            this.handlers[e] = [handler];
        } else if (this.handlers[e]) {
            this.handlers[e]?.push(handler);
        }
    }

    public move(x: number, y: number) {
        this.dispatchEvent('mousemove', x, y);
    }

    public down(x: number, y: number) {
        this.dispatchEvent('mousedown', x, y);
    }

    public up(x: number, y: number) {
        this.dispatchEvent('mouseup', x, y);
    }

    public dispatchEvent(type: string, x: number, y: number) {
        for (const handler of (this.handlers[type] || [])) {
            handler({
                type,
                x,
                y,
                offsetX: x,
                offsetY: y,
                button: 0,
                preventDefault() { },
            });
        }
    }
}
