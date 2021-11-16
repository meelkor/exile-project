import { Territory } from '@exile/client/game/models/territory';
import { MapTerritoryStyle } from '@exile/client/game/modules/overworld/partials/map-territory-style';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import { MapAtlas } from '@exile/client/game/modules/overworld/resources/map-atlas';
import { TerritoryController } from '@exile/client/game/modules/overworld/partials/territory-controller';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { setUniform } from '@exile/client/engine/renderer-gl/utils';
import { Material, Texture } from 'three';
import { onBeforeCompile } from '@exile/client/engine/renderer-gl/extensions/on-before-compile';

/**
 * Utility rendering territories by creating mesh for each territory
 */
export class TerritoryMultimeshController extends TerritoryController {

    private mapTerritoryStyle = this.inject(MapTerritoryStyle);

    private mapAtlas = this.inject(MapAtlas);

    private worldScene = this.inject(WorldPlane);

    private meshes: Map<number, NodeMesh> = new Map();

    private textureMaterials: Map<Texture, Material> = new Map();

    public register(): void { /* noop */ }

    public renderTerritory(territory: Territory): void {
        const { rangeX, rangeY, texture } = this.mapAtlas.getTileTexture(territory);

        if (!this.textureMaterials.has(texture)) {
            this.textureMaterials.set(texture, this.makeTextureMaterial(texture));
        }

        const geometry = this.mapTerritoryStyle.planeGeometry;
        const material = this.textureMaterials.get(texture);
        const vec = this.mapTerritoryStyle.getTerritoryVector(territory);

        const mesh = new NodeMesh(geometry, material, true);

        mesh.position.copy(vec);

        setUniform(mesh, 'rangeX0', rangeX[0]);
        setUniform(mesh, 'rangeX1', rangeX[1]);
        setUniform(mesh, 'rangeY0', rangeY[0]);
        setUniform(mesh, 'rangeY1', rangeY[1]);

        this.meshes.set(territory.id, mesh);

        this.worldScene.scene.add(mesh);
    }

    private makeTextureMaterial(texture: Texture): Material {
        const material = this.mapTerritoryStyle.makeTextureMaterial(texture);

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

        return material;
    }
}
