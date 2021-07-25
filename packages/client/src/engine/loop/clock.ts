import { AppConfig } from '@exile/client/engine/config/app-config';
import { InjectableGlobal } from '@exile/common/utils/di';
import { assert } from '@exile/common/utils/assert';

export class Clock extends InjectableGlobal {

    private handler?: TickHandler;

    private config = this.inject(AppConfig);

    private readonly minTimeBetweenFrames = 1000 / (this.config.fpsLock ?? 60);

    private lastFiredHrt: number = 0;

    public start(handler: TickHandler): void {
        assert(!this.handler, 'Cannot register multiple clock tick handlers');

        this.handler = handler;

        if (this.minTimeBetweenFrames) {
            this.fpsLoop(performance.now());
        } else {
            this.freeLoop(performance.now());
        }
    }

    private freeLoop = (hrt: DOMHighResTimeStamp): void => {
        window.requestAnimationFrame(this.freeLoop);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.handler!(hrt);
    }

    private fpsLoop = (hrt: DOMHighResTimeStamp): void => {
        window.requestAnimationFrame(this.fpsLoop);

        if (hrt - this.lastFiredHrt > this.minTimeBetweenFrames) {
            this.lastFiredHrt = hrt;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.handler!(hrt);
        }
    }
}

export type TickHandler = (hrt: number) => void
