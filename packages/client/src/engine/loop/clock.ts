import { AppConfig } from '@exile/client/engine/config/app-config';
import { InjectableGlobal } from '@exile/common/utils/di';
import { assert } from '@exile/common/utils/assert';

export class Clock extends InjectableGlobal {

    private handler?: TickHandler;

    private config = this.inject(AppConfig);

    private readonly minTimeBetweenFrames = this.config.fpsLock
        ? 1000 / (this.config.fpsLock ?? 60)
        : 0;

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
        this.handler!(hrt);

        setTimeout(() => window.requestAnimationFrame(this.freeLoop));
    }

    private fpsLoop = (hrt: DOMHighResTimeStamp): void => {
        if (hrt - this.lastFiredHrt > this.minTimeBetweenFrames) {
            this.lastFiredHrt = hrt;
            this.handler!(hrt);
        }

        setTimeout(() => window.requestAnimationFrame(this.fpsLoop));
    }
}

export type TickHandler = (hrt: number) => void
