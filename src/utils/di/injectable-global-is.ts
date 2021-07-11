import { InjectableGlobal } from '@exile/utils/di';
import { Constructor } from '@exile/utils/types/class';

export const $$GLOBAL = Symbol('Global Injectable');

export function isGlobalInjectable(Class: Constructor<any>): Class is Constructor<InjectableGlobal> {
    return $$GLOBAL in Class;
}

