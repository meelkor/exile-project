import { assert } from '@exile/common/utils/assert';

import { Injector } from '@exile/common/utils/di/injector';
import { InjectableValue } from '@exile/common/utils/di/injectable-value';
import { InjectableBase } from '@exile/common/utils/di/injectable-base';
import { AbstractConstructor, Constructor } from '@exile/common/types/class';

export abstract class Injectable extends InjectableBase {

    public static isConstructor(Class: Constructor<any>): Class is Constructor<Injectable> {
        return Class.prototype instanceof Injectable;
    }

    public static substitute<T extends Injectable>(that: Injectable, Class: Constructor<T>, Sub: Constructor<T>): void {
        that.injector.substitute(Class, Sub);
    }

    /**
     * Method to get the private injector, should be ideally only ever used by
     * core / engine classes.
     */
    public static getInjector(that: Injectable): Injector {
        return that.injector;
    }

    private injector: Injector;

    constructor(parentOnly: boolean = false) {
        super();

        InjectableBase.runBeforeHookConstructed(this);

        if (parentOnly) {
            const currentParent = Injector.getCurrentParent();
            assert(currentParent);
            this.injector = currentParent;
        } else {
            this.injector = new Injector(Injector.getCurrentParent());
        }
    }

    protected provide<T>(value: InjectableValue<T>, Alias?: AbstractConstructor<InjectableBase>): T;
    protected provide<T extends Injectable>(Class: Constructor<T>, Alias?: AbstractConstructor<InjectableBase>): T;
    protected provide<T, I extends Injectable>(valueOrClass: InjectableValue<T> | Constructor<I>, Alias?: AbstractConstructor<InjectableBase>): T | I {
        return this.injector.provide(valueOrClass, Alias);
    }

    protected instantiate<T extends Injectable>(Class: Constructor<T>): T {
        return this.injector.instantiate(Class).value;
    }

    protected inject<T>(Class: AbstractConstructor<InjectableValue<T>>): T;
    protected inject<T extends Injectable>(Class: AbstractConstructor<T>): T;
    protected inject<T extends Injectable>(Class: AbstractConstructor<T>): T {
        return this.injector.inject(Class);
    }
}
