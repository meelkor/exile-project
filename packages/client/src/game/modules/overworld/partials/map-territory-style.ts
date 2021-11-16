import * as three from 'three';
import { enableTimeUniform } from '@exile/client/engine/renderer-gl/extensions/time';
import { enableFogIntensity } from '@exile/client/engine/renderer-gl/extensions/fog-intensity';
import { InjectableGlobal } from '@exile/common/utils/di';
import { ensure } from '@exile/common/utils/assert';
import { MapAtlas } from '@exile/client/game/modules/overworld/resources/map-atlas';
import { onBeforeCompile } from '@exile/client/engine/renderer-gl/extensions/on-before-compile';
import { TerritoryArranger } from '@exile/client/game/modules/overworld/partials/territory-arranger';

/**
 * Serving storing materials and geometries that may be shared between
 * instances of territory components.
 */
export class MapTerritoryStyle extends InjectableGlobal {

    private mapAtlas = this.inject(MapAtlas);

    private territoryArranger = this.inject(TerritoryArranger);

    public readonly planeGeometry = this.makeGeometryTemplate();
    public readonly lineGeometry = this.makeLineGeometry();

    private borderTexture = this.createBorderTexture();

    public makeTextureMaterial(texture: three.Texture): three.Material {
        const material = new three.MeshBasicMaterial({
            map: texture,
            color: '#FFFFFF',
        });

        onBeforeCompile(material, shader => {
            shader.vertexShader = `
                varying vec2 origUv;
                ${shader.vertexShader}
            `;
            shader.vertexShader = shader.vertexShader.replace(`#include <uv_vertex>`, /* glsl */`
                origUv = uv;
                #include <uv_vertex>
            `);

            shader.fragmentShader = `
                varying vec2 origUv;
                uniform sampler2D border;
                ${shader.fragmentShader}
            `;
            shader.fragmentShader = shader.fragmentShader.replace(`#include <map_fragment>`, /* glsl */`
                vec4 texelColor = texture2D(map, vUv);
                vec4 borderColor = texture2D(border, origUv);

                texelColor = mapTexelToLinear( texelColor * borderColor );
                diffuseColor *= texelColor;
            `);

            shader.uniforms.border = {
                value: this.borderTexture,
            };
        });

        enableTimeUniform(material);
        enableFogIntensity(material);

        return material;
    }

    private makeGeometryTemplate(): three.CircleBufferGeometry {
        const radius = this.territoryArranger.tileRadius;
        const plane = new three.CircleBufferGeometry(radius, 6);

        plane.rotateZ(Math.PI / 2);

        const uv = ensure(plane.attributes.uv);
        const position = ensure(plane.attributes.position);

        // Update UVs after rotation as the texture should stay as it was
        for (let i = 0; i < uv.count; i++) {
            const newUvY = 0.5 + position.getY(i) / radius * 0.5;
            let newUvX = 0.5 + position.getX(i) / radius * 0.5;

            if (newUvX < 0.2) {
                newUvX = 0;
            } else if (newUvX > 0.8) {
                newUvX = 1;
            }

            uv.setXY(i, newUvX, newUvY);
        }

        plane.scale(1, this.mapAtlas.yScale, 1);

        return plane;
    }

    private makeLineGeometry(): three.BufferGeometry {
        const geometry = new three.BufferGeometry().setFromPoints(
            this.territoryArranger.makeLineShape(),
        );

        return geometry;
    }

    private createBorderTexture(): three.Texture {
        const position = this.lineGeometry.getAttribute('position')!;

        const borderCanvas = document.createElement('canvas');
        const BORDER_TEXTURE_SIZE = 256;

        borderCanvas.width = BORDER_TEXTURE_SIZE;
        borderCanvas.height = BORDER_TEXTURE_SIZE;

        const ctx = ensure(borderCanvas.getContext('2d'));

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, BORDER_TEXTURE_SIZE, BORDER_TEXTURE_SIZE);

        for (let i = 0; i < position.count; i++) {
            const x = (0.5 + position.getX(i) * 1.001) * BORDER_TEXTURE_SIZE;
            const y = (0.5 + position.getY(i) * 1.018) * BORDER_TEXTURE_SIZE;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#999999';

        ctx.stroke();

        return new three.CanvasTexture(borderCanvas);
    }
}
