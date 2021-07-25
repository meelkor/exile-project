import { InjectableGlobal } from '@exile/common/utils/di';
import { AbstractConstructor } from '@exile/common/types/class';

export const $global = Symbol('Global Injectable');

export function isGlobalInjectable(Class: AbstractConstructor<any>): Class is AbstractConstructor<InjectableGlobal> {
    return $global in Class;
}

