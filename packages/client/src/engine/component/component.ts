import { ComponentRegistry } from '@exile/client/engine/component/component-registry';
import { TreeNode } from '@exile/client/engine/core/tree-node';
import { GameEvents } from '@exile/client/engine/game-event/game-events';
import { ViewEvents } from '@exile/client/engine/input/view-events';
import { GlobalLoader } from '@exile/client/engine/renderer-gl/global-loader';
import { Renderer } from '@exile/client/engine/renderer-gl/renderer';

export abstract class Component extends TreeNode<Component> {

    protected viewEvents = this.inject(ViewEvents);

    protected gameEvents = this.inject(GameEvents);

    protected loader = this.inject(GlobalLoader);

    private componentRegistry = this.inject(ComponentRegistry);

    private renderer = this.inject(Renderer);

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
        this.viewEvents.offNode(this);
        this.renderer.deleteNodesChildren(TreeNode.getId(this));
    }
}
