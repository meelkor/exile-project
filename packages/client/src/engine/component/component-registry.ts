import { InjectableGlobal } from '@exile/common/utils/di';
import { assert } from '@exile/common/utils/assert';
import { Component } from '@exile/client/engine/component/component';

export class ComponentRegistry extends InjectableGlobal {

    private readonly registry: Map<number, Component> = new Map();

    public get(nodeId: number): Component {
        const cmp = this.registry.get(nodeId);

        assert(cmp, `Component #${nodeId} is not registered`);

        return cmp;
    }

    public register(component: Component): void {
        const instanceId = Component.getId(component);

        assert(!this.registry.has(instanceId), `component ${Component.getName(component)} is already registered`);

        this.registry.set(instanceId, component);
    }

    public deregister(component: Component): void {
        const instanceId = Component.getId(component);

        assert(this.registry.has(instanceId), `component ${Component.getName(component)} is not registered`);

        this.registry.delete(instanceId);
    }
}
