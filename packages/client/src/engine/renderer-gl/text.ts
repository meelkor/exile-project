import { GlobalTreeNode } from '@exile/client/engine/core/global-tree-node';
import { TreeNode } from '@exile/client/engine/core/tree-node';
import { MeshUserData } from '@exile/client/engine/renderer-gl/mesh';
import { setUniform } from '@exile/client/engine/renderer-gl/utils';
import { assert } from '@exile/common/utils/assert';
import { Text } from 'troika-three-text';
import * as three from 'three';

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

        // Arbitrary number so unless setTextLength is called it displays
        // (hopefully) whole string.
        this.setTextLength(900000);

        (this.material as any).onBeforeCompile = (s: three.Shader) => {
            s.vertexShader = /* glsl */`
                flat varying int vExileIndex;
                ${s.vertexShader}
            `;

            s.vertexShader = s.vertexShader.replace(`void main() {`, /* glsl */`
                void main() {
                    vExileIndex = gl_InstanceID;
            `);

            s.fragmentShader = /* glsl */`
                uniform float uExileLength;
                flat varying int vExileIndex;
                ${s.fragmentShader}
            `;

            s.fragmentShader = s.fragmentShader.replace(`gl_FragColor.a *= edgeAlpha;`, /* glsl */`
                float lenAlphaMultiplier = min(1.0, max(0.0, uExileLength - float(vExileIndex)));

                edgeAlpha *= lenAlphaMultiplier;

                gl_FragColor.a *= edgeAlpha;
            `);
        };
    }

    public setTextLength(len: number): void {
        setUniform(this, 'uExileLength', len);
    }
}
