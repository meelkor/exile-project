import { InjectableBase } from '@exile/common/utils/di/injectable-base';
import { AbstractConstructor } from '@exile/common/types/class';

export class InjectableValue<T> extends InjectableBase {

    public static isConstructor<V>(Class: AbstractConstructor<any>): Class is AbstractConstructor<InjectableValue<V>> {
        return Class.prototype instanceof InjectableValue;
    }

    constructor(public readonly value: T) {
        super();
    }
}
