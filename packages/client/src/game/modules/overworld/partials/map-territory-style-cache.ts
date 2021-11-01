import * as three from 'three';
import { enableTimeUniform } from '@exile/client/engine/renderer-gl/extensions/time';
import { enableFogIntensity, setFogIntensity } from '@exile/client/engine/renderer-gl/extensions/fog-intensity';
import { InjectableGlobal } from '@exile/common/utils/di';
import { Pos } from '@exile/common/types/geometry';
import { ensure } from '@exile/common/utils/assert';
import { ClaimState, Territory } from '@exile/client/game/models/territory';
import { MapAtlas } from '@exile/client/game/modules/overworld/resources/map-atlas';
import { onBeforeCompile } from '@exile/client/engine/renderer-gl/extensions/on-before-compile';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import { setUniform } from '@exile/client/engine/renderer-gl/utils';

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
        Math.sqrt(1 - 1 / 2 ** 2),
        0,
    );

    private chunkMaterialCache: Map<three.Texture, three.Material> = new Map();

    public getTerritoryMesh(territory: Territory): NodeMesh {
        const unknown = territory.claim === ClaimState.Unknown;

        const { rangeX, rangeY, texture } = this.mapAtlas.getTileTexture(territory);

        const material = this.getTextureMaterial(texture);

        const vec = this.getTerritoryVector(territory);

        const mesh = new NodeMesh(this.planeGeometry, material, true);

        setFogIntensity(mesh, unknown ? 0.6 : 0.07);

        setUniform(mesh, 'rangeX0', rangeX[0]);
        setUniform(mesh, 'rangeX1', rangeX[1]);
        setUniform(mesh, 'rangeY0', rangeY[0]);
        setUniform(mesh, 'rangeY1', rangeY[1]);

        mesh.position.copy(vec);

        return mesh;
    }

    public getTerritoryVector(pos: Pos): three.Vector3 {
        const vec = new three.Vector3(pos.x, pos.y, 0)
            .multiply(this.tileVector);

        if (pos.y % 2 === 1) {
            vec.add(new three.Vector3(1 / 2, 0, 0));
        }

        return vec;
    }

    private getTextureMaterial(texture: three.Texture): three.Material {
        if (!this.chunkMaterialCache.has(texture)) {
            const material = new three.MeshBasicMaterial({
                map: texture,
                color: '#FFFFFF',
            });

            onBeforeCompile(material, shader => {
                shader.vertexShader = `
                    uniform float rangeX0;
                    uniform float rangeX1;
                    uniform float rangeY0;
                    uniform float rangeY1;
                    ${shader.vertexShader}
                `;
                shader.vertexShader = shader.vertexShader.replace(`#include <uv_vertex>`, /* glsl */`
                    vUv = uv * vec2(rangeX1 - rangeX0, rangeY1 - rangeY0) + vec2(rangeX0, rangeY0);
                `);
            });

            enableTimeUniform(material);
            enableFogIntensity(material);

            this.chunkMaterialCache.set(texture, material);
        }

        return ensure(this.chunkMaterialCache.get(texture));
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

        return plane;
    }

    private makeLineGeometry(): three.BufferGeometry {
        return new three.BufferGeometry().setFromPoints([
            new three.Vector3(-0.5, 0.28867512941360474, 0),
            new three.Vector3(-0.5, -0.28867512941360474, 0),
            new three.Vector3( 0, -0.5773502588272095, 0),
            new three.Vector3( 0.5, -0.28867512941360474, 0),
            new three.Vector3( 0.5, 0.28867512941360474, 0),
            new three.Vector3( 0, 0.5773502588272095, 0),
            new three.Vector3(-0.5, 0.28867512941360474, 0),
        ]);
    }
}
