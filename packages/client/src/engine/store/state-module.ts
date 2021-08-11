import { PayloadMap, SupportedEventType } from '@exile/client/engine/core/events';
import { EventsQueued } from '@exile/client/engine/core/events-queued';
import { Immutable } from '@exile/common/types/immutable';
import { DebugName } from '@exile/common/utils/debug/class';

@DebugName('UnnamedStateModule')
export abstract class StateModule<T extends Record<string, any>, E extends SupportedEventType, TPayloads extends PayloadMap<E>> extends EventsQueued<E, TPayloads> {

    public abstract actions: Record<string, () => void>;

    protected state: T;

    public getState(): Immutable<T> {
        return this.state as unknown as Immutable<T>;
    }

    constructor(defState: T) {
        // TODO: we don't really want state modules to be injectable, but
        //  Events class currently is. Solve by making Injectable a mixin or
        //  something so it can be used as `extends Injectable(EventsQueued<E>)`
        //  where needed?
        super();

        this.state = defState;
    }
}

export interface RefChange<T> {
    before?: T;
    after?: T;
}
