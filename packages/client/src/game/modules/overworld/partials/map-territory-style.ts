import * as three from 'three';
import { enableTimeUniform } from '@exile/client/engine/renderer-gl/extensions/time';
import { enableFogIntensity } from '@exile/client/engine/renderer-gl/extensions/fog-intensity';
import { InjectableGlobal } from '@exile/common/utils/di';
import { Pos } from '@exile/common/types/geometry';
import { ensure } from '@exile/common/utils/assert';
import { MapAtlas } from '@exile/client/game/modules/overworld/resources/map-atlas';
import { onBeforeCompile } from '@exile/client/engine/renderer-gl/extensions/on-before-compile';

/**
 * Should not be changed as some calculations are simplified by the distance
 * being 1. Puttin into constant just for clarity.
 */
const TILE_DISTANCE = 1;

/**
 * Serving storing materials and geometries that may be shared between
 * instances of territory components.
 */
export class MapTerritoryStyle extends InjectableGlobal {

    private mapAtlas = this.inject(MapAtlas);

    public readonly planeGeometry = this.makeGeometryTemplate();
    public readonly lineGeometry = this.makeLineGeometry();

    /**
     * Vector to be used to calculate territory position for even Y values
     */
    public readonly tileVector = new three.Vector3(
        1,
        Math.sqrt(1 - 1 / 2 ** 2) * this.mapAtlas.yScale,
        0,
    );

    private borderTexture = this.createBorderTexture();

    public getTerritoryVector(pos: Pos): three.Vector3 {
        const vec = new three.Vector3(pos.x, pos.y, 0)
            .multiply(this.tileVector);

        if (pos.y % 2 === 1) {
            vec.add(new three.Vector3(1 / 2, 0, 0));
        }

        return vec;
    }

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
        const radius = TILE_DISTANCE / 2 / Math.cos(Math.PI / 6);
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
        const geometry = new three.BufferGeometry().setFromPoints([
            new three.Vector3(-0.5, 0.28867512941360474, 0),
            new three.Vector3(-0.5, -0.28867512941360474, 0),
            new three.Vector3( 0, -0.5773502588272095, 0),
            new three.Vector3( 0.5, -0.28867512941360474, 0),
            new three.Vector3( 0.5, 0.28867512941360474, 0),
            new three.Vector3( 0, 0.5773502588272095, 0),
            new three.Vector3(-0.5, 0.28867512941360474, 0),
        ]);

        geometry.scale(1, this.mapAtlas.yScale, 1);

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
