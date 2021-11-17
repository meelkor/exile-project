import { GlobalTreeNode } from '@exile/client/engine/core/global-tree-node';
import { TreeNode } from '@exile/client/engine/core/tree-node';
import { MeshUserData } from '@exile/client/engine/renderer-gl/mesh';
import { assert } from '@exile/common/utils/assert';
import { Text } from 'troika-three-text';

/**
 * Wrapper around troika Text which makes it work with our Node tree and adds
 * support for our patched troika text features.
 */
export class NodeText extends Text {

    public override readonly userData: MeshUserData;

    constructor(options: { interactive: boolean } = { interactive: false }) {
        super();

        const node = GlobalTreeNode.get();

        assert(node, 'Cannot create NodeText outside node lifecycle.');

        this.userData = {
            nodeId: TreeNode.getId(node),
            interactive: options.interactive,
        };

    }
}
