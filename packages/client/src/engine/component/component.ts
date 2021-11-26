import { ComponentRegistry } from '@exile/client/engine/component/component-registry';
import { ComponentIo } from '@exile/client/engine/component/componentIo';
import { TreeNode } from '@exile/client/engine/core/tree-node';
import { GameEvents } from '@exile/client/engine/game-event/game-events';
import { ViewEvents } from '@exile/client/engine/input/view-events';
import { GlobalLoader } from '@exile/client/engine/renderer-gl/global-loader';
import { Renderer } from '@exile/client/engine/renderer-gl/renderer';
import { Injectable } from '@exile/common/utils/di';

export abstract class Component extends TreeNode<Component> {

    protected io: ComponentIo;

    protected gameEvents = this.inject(GameEvents);

    protected loader = this.inject(GlobalLoader);

    private viewEvents = this.inject(ViewEvents);

    private componentRegistry = this.inject(ComponentRegistry);

    private renderer = this.inject(Renderer);

    constructor() {
        super();

        // We can safely use actual "current injector"
        this.io = new ComponentIo(TreeNode.getId(this));

        // Provide it for child controllers
        Injectable.getInjector(this).register(ComponentIo, this.io);
    }

    /**
     * Method called when the component is added into the scene. This method
     * should handle all rendering logic that should be displayed right away.
     */
    protected abstract onInit(): void;

    /**
     * Do not override
     *
     * @final
     */
    protected onAdd(): void {
        this.componentRegistry.register(this);
        this.onInit();
    }

    /**
     * Ideally should not be overriden by the components, as anything added
     * to scenes is automatically removed and every event listeners are
     * deregistered.
     */
    protected onDestroy(): void {
        this.componentRegistry.deregister(this);
        this.viewEvents.offNode(TreeNode.getId(this));
        this.renderer.deleteNodesChildren(TreeNode.getId(this));
    }
}
