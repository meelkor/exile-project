import { Server } from '@exile/client/engine/server/server';

export class NoopServer extends Server {

    public tick(): void {
        // noop
    }
}
