import assert from 'assert';

import { Injector } from '@exile/utils/di/injector';
import { InjectableValue } from '@exile/utils/di/injectable-value';
import { InjectableBase } from '@exile/utils/di/injectable-base';
import { Constructor } from '@exile/utils/types/class';

export abstract class Injectable extends InjectableBase {

    public static isConstructor(Class: Constructor<any>): Class is Constructor<Injectable> {
        return Class.prototype instanceof Injectable;
    }

    private injector: Injector;

    constructor(parentOnly: boolean = false) {
        super();

        if (parentOnly) {
            const currentParent = Injector.getCurrentParent();
            assert(currentParent);
            this.injector = currentParent;
        } else {
            this.injector = new Injector(Injector.getCurrentParent());
        }
    }

    protected provide<T>(value: InjectableValue<T>, Alias?: Constructor<InjectableBase>): T;
    protected provide<T extends Injectable>(Class: Constructor<T>, Alias?: Constructor<InjectableBase>): T;
    protected provide<T, I extends Injectable>(valueOrClass: InjectableValue<T> | Constructor<I>, Alias?: Constructor<InjectableBase>): T | I {
        const instance = this.injector.provide(valueOrClass);

        if (Alias) {
            this.injector.register(Alias, instance);
        }

        return instance;
    }

    protected instantiate<T extends Injectable>(Class: Constructor<T>): T {
        return this.injector.instantiate(Class).value;
    }

    protected inject<T>(Class: Constructor<InjectableValue<T>>): T;
    protected inject<T extends Injectable>(Class: Constructor<T>): T;
    protected inject<T extends Injectable>(Class: Constructor<T>): T {
        return this.injector.inject(Class);
    }
}
