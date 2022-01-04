import { EventsQueued } from '@exile/client/engine/core/events-queued';
import { StateModule } from '@exile/client/engine/store/state-module';
import { Constructor } from '@exile/common/types/class';
import { assert } from '@exile/common/utils/assert';
import { DebugName } from '@exile/common/utils/debug/class';
import { InjectableGlobal } from '@exile/common/utils/di';

@DebugName('Store')
export class Store extends InjectableGlobal {

    public static emitEvents(store: Store): void {
        store.emitEvents();
    }

    private registeredStates: Map<Constructor<AnyStateModule>, AnyStateModule> = new Map();

    public register<T extends AnyStateModule>(moduleClass: Constructor<T>, stateModule: T): void {
        this.registeredStates.set(moduleClass, stateModule);
    }

    public require<T extends AnyStateModule>(stateModule: Constructor<T>): T {
        const instance = this.registeredStates.get(stateModule);

        assert(instance, `State ${DebugName.get(stateModule)} is not registered`);

        return instance as T;
    }

    public offNode(nodeId: number): void {
        for (const stateModule of this.registeredStates.values()) {
            stateModule.offNode(nodeId);
        }
    }

    private emitEvents(): void {
        for (const stateModule of this.registeredStates.values()) {
            StateModule.emitEvents(stateModule as any as EventsQueued<any, any, any>);
        }
    }
}

type AnyStateModule = StateModule<any, any, any>;
