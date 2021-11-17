import { setUniform } from '@exile/client/engine/renderer-gl/utils';
import * as three from 'three';
import { Text } from 'troika-three-text';

export function enableTextLength(mesh: Text): void {
    mesh.material.onBeforeCompile = (s: three.Shader) => {
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

    // Arbitrary number so unless setTextLength is called it displays
    // (hopefully) whole string.
    setTextLength(mesh, 90000);
}

export function setTextLength(mesh: Text, length: number): void {
    setUniform(mesh, 'uExileLength', length);
}
