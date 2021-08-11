import { InjectableValue } from '@exile/common/utils/di/injectable-value';
import { InjectableBase } from '@exile/common/utils/di/injectable-base';
import { Injectable } from '@exile/common/utils/di/injectable';
import { AbstractConstructor, Constructor } from '@exile/common/types/class';
import { isGlobalInjectable } from '@exile/common/utils/di/injectable-global-is';

export let currentParentInjector: Injector | undefined;

export class Injector implements CompatibleInjector {

    public static getCurrentParent(): Injector | undefined {
        return currentParentInjector;
    }

    private registry = new Map<AbstractConstructor<InjectableBase>, any>();

    constructor (private parent?: CompatibleInjector) { }

    public provide<T>(value: InjectableValue<T>, Alias?: AbstractConstructor<InjectableBase>): T;
    public provide<T extends Injectable>(Class: Constructor<T>, Alias?: AbstractConstructor<InjectableBase>): T;
    public provide<T, I extends Injectable>(valueOrClass: InjectableValue<T> | Constructor<I>, Alias?: AbstractConstructor<InjectableBase>): T | I;
    public provide<T, I extends Injectable>(valueOrClass: InjectableValue<T> | Constructor<I>, Alias?: AbstractConstructor<InjectableBase>): T | I {
        let name: AbstractConstructor<InjectableBase>;
        let value: I | T;

        if (valueOrClass instanceof InjectableValue) {
            name = valueOrClass.constructor as AbstractConstructor<InjectableValue<T>>;
            value = valueOrClass.value;
        } else {
            const intd = this.instantiate(valueOrClass);

            name = intd.name;
            value = intd.value;
        }

        this.register(name, value);

        if (Alias) {
            this.register(Alias, value);
        }

        return value;
    }

    public inject<T>(Class: AbstractConstructor<InjectableValue<T>>): T;
    public inject<T extends Injectable>(Class: AbstractConstructor<T>): T;
    public inject<T, I extends Injectable>(Class: AbstractConstructor<InjectableValue<T>> | AbstractConstructor<I>): T | I {
        if (this.registry.has(Class)) {
            return this.registry.get(Class) as T;
        } else if (this.parent) {
            return InjectableValue.isConstructor(Class)
                ? this.parent.inject(Class)
                : this.parent.inject(Class);
        } else if (isGlobalInjectable(Class)) {
            // No way to assert it's not abstract
            return this.provide(Class as Constructor<I>);
        } else {
            throw new InjectorError(`Injecting non-registered class ${Class.name}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public register(Class: AbstractConstructor<InjectableBase>, value: any): void {
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
            const instance = new instanceOrClass;

            InjectableBase.runAfterHookConstructed(instance);

            return {
                value: instance,
                name: instanceOrClass,
            };
        } else {
            return {
                value: instanceOrClass.value,
                name: instanceOrClass.constructor as AbstractConstructor<InjectableValue<T>>,
            };
        }
    }
}

export interface CompatibleInjector {
    inject<T>(Class: AbstractConstructor<InjectableValue<T>>): T;
    inject<T extends Injectable>(Class: AbstractConstructor<T>): T;

    provide<T>(value: InjectableValue<T>): T;
    provide<T extends Injectable>(Class: AbstractConstructor<T>): T;
}

class InjectorError extends Error { }

interface Instantiated<T> {
    name: AbstractConstructor<InjectableBase>;
    value: T;
}
