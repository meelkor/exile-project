import { GlobalTreeNode } from '@exile/client/engine/core/global-tree-node';
import { Scene } from '@exile/client/engine/scene/scene';

export abstract class RootScene extends Scene {

    public static bootstrap(scene: RootScene): void {
        scene.bootstrap();
    }

    private bootstrap(): void {
        GlobalTreeNode.set(this);
        this.onAdd();
        GlobalTreeNode.clear(this);
    }
}
