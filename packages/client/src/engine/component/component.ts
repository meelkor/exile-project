import { ComponentRegistry } from '@exile/client/engine/component/component-registry';
import { TreeNode } from '@exile/client/engine/core/tree-node';
import { ViewEvents } from '@exile/client/engine/input/view-events';
import { GlobalLoader } from '@exile/client/engine/renderer-gl/global-loader';

export abstract class Component extends TreeNode<Component> {

    protected viewEvents = this.inject(ViewEvents);

    protected loader = this.inject(GlobalLoader);

    private componentRegistry = this.inject(ComponentRegistry);

    protected abstract onInit(): void;

    protected onAdd(): void {
        this.componentRegistry.register(this);
        this.onInit();
    }

    protected onDestroy(): void {
        this.componentRegistry.register(this);
        this.viewEvents.offNode(this);
    }
}
