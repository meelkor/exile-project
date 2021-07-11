import { InjectableValue } from '@exile/utils/di/injectable-value';
import { InjectableBase } from '@exile/utils/di/injectable-base';
import { Injectable } from '@exile/utils/di/injectable';
import { Constructor } from '@exile/utils/types/class';
import { isGlobalInjectable } from '@exile/utils/di/injectable-global-is';

export let currentParentInjector: Injector | undefined;

export class Injector implements CompatibleInjector {

    public static getCurrentParent(): Injector | undefined {
        return currentParentInjector;
    }

    private registry = new Map<Constructor<InjectableBase>, any>();

    constructor (private parent?: CompatibleInjector) { }

    public provide<T>(value: InjectableValue<T>): T;
    public provide<T extends Injectable>(Class: Constructor<T>): T;
    public provide<T, I extends Injectable>(valueOrClass: InjectableValue<T> | Constructor<I>): T | I;
    public provide<T, I extends Injectable>(valueOrClass: InjectableValue<T> | Constructor<I>): T | I {
        let name: Constructor<InjectableBase>;
        let value: I | T;

        if (valueOrClass instanceof InjectableValue) {
            name = valueOrClass.constructor as Constructor<InjectableValue<T>>;
            value = valueOrClass.value;
        } else {
            const intd = this.instantiate(valueOrClass);

            name = intd.name;
            value = intd.value;
        }

        this.register(name, value);

        return value;
    }

    public inject<T>(Class: Constructor<InjectableValue<T>>): T;
    public inject<T extends Injectable>(Class: Constructor<T>): T;
    public inject<T, I extends Injectable>(Class: Constructor<InjectableValue<T>> | Constructor<I>): T | I {
        if (this.registry.has(Class)) {
            return this.registry.get(Class) as T;
        } else if (this.parent) {
            return InjectableValue.isConstructor(Class)
                ? this.parent.inject(Class)
                : this.parent.inject(Class);
        } else if (isGlobalInjectable(Class)) {
            return this.provide(Class);
        } else {
            throw new InjectorError(`Injecting non-registered class ${Class.name}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public register(Class: Constructor<InjectableBase>, value: any): void {
        if (this.registry.has(Class)) {
            throw new InjectorError(`Injector already registers class for ${Class.name}`);
        }

        this.registry.set(Class, value);
    }

    public instantiate<T>(instance: InjectableValue<T>): Instantiated<typeof instance.value>;
    public instantiate<T extends Injectable>(Class: Constructor<T>): Instantiated<T>;
    public instantiate<T, I extends Injectable>(instanceOrClass: InjectableValue<T> | Constructor<I>): Instantiated<T | I> {
        currentParentInjector = this;

        if ('prototype' in instanceOrClass && Injectable.isConstructor(instanceOrClass)) {
            return {
                value: new instanceOrClass,
                name: instanceOrClass,
            };
        } else {
            return {
                value: instanceOrClass.value,
                name: instanceOrClass.constructor as Constructor<InjectableValue<T>>,
            };
        }
    }
}

export interface CompatibleInjector {
    inject<T>(Class: Constructor<InjectableValue<T>>): T;
    inject<T extends Injectable>(Class: Constructor<T>): T;

    provide<T>(value: InjectableValue<T>): T;
    provide<T extends Injectable>(Class: Constructor<T>): T;
}

class InjectorError extends Error { }

interface Instantiated<T> {
    name: Constructor<InjectableBase>;
    value: T;
}
