import { Component } from '@exile/engine/view/component';
import { InjectableGlobal } from '@exile/utils/di';
import assert from 'assert';

export class ComponentRegistry extends InjectableGlobal {

    private readonly registry: Map<string, Component> = new Map();

    public register(component: Component): void {
        assert(!this.registry.has(component.instanceId), 'component is already registered');
        this.registry.set(component.instanceId, component);
    }

    public deregister(component: Component): void {
        assert(this.registry.has(component.instanceId), 'component is not registered');
        this.registry.delete(component.instanceId);
    }
}
