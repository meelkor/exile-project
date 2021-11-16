import { GlobalTreeNode } from '@exile/client/engine/core/global-tree-node';
import { TreeNode } from '@exile/client/engine/core/tree-node';
import { assert } from '@exile/common/utils/assert';
import * as three from 'three';

/**
 * Enhanced threejs Mesh which has types userData automatically assigning the nodeId.
 */
export class NodeMesh<
    TGeometry extends three.BufferGeometry = three.BufferGeometry,
    TMaterial extends three.Material | three.Material[] = three.Material | three.Material[],
> extends three.Mesh<TGeometry, TMaterial> {

    public override readonly userData: MeshUserData;

    constructor(
        geometry?: TGeometry,
        material?: TMaterial,
        interactive?: boolean,
    ) {
        super(geometry, material);

        const node = GlobalTreeNode.get();

        assert(node, 'Cannot create NodeMesh outside node lifecycle.');

        this.userData = {
            nodeId: TreeNode.getId(node),
            interactive,
        };
    }
}

/**
 * Enhanced threejs Mesh which has types userData automatically assigning the nodeId.
 */
export class InstancedNodeMesh<
    TGeometry extends three.BufferGeometry = three.BufferGeometry,
    TMaterial extends three.Material | three.Material[] = three.Material | three.Material[],
> extends three.InstancedMesh<TGeometry, TMaterial> {

    public override readonly userData: MeshUserData;

    public boundingSphere?: three.Sphere;

    constructor(
        geometry: TGeometry,
        material: TMaterial,
        count: number = 0,
        interactive?: boolean,
    ) {
        super(geometry, material, count);

        const node = GlobalTreeNode.get();

        assert(node, 'Cannot create NodeMesh outside node lifecycle.');

        this.userData = {
            nodeId: TreeNode.getId(node),
            interactive,
        };
    }
}

/**
 * User data supported (and expected) by every mesh used the gl renderer.
 */
export interface MeshUserData {
    /**
     * ID of the TreeNode which "owns" the 3d object.
     */
    readonly nodeId: number;
    /**
     * Whether object should be picked by raycasting -> mouse events.
     */
    interactive?: boolean;
}
