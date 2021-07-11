import { InjectableBase } from '@exile/utils/di/injectable-base';
import { Constructor } from '@exile/utils/types/class';

export class InjectableValue<T> extends InjectableBase {

    public static isConstructor<V>(Class: Constructor<any>): Class is Constructor<InjectableValue<V>> {
        return Class.prototype instanceof InjectableValue;
    }

    constructor(public readonly value: T) {
        super();
    }
}
