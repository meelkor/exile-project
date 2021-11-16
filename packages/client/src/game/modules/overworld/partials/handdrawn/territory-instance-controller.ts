import * as three from 'three';
import { Territory } from '@exile/client/game/models/territory';
import { MapTerritoryStyle } from '@exile/client/game/modules/overworld/partials/handdrawn/territory-handdrawn-style';
import { InstancedNodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import { AtlasTextureDescriptor, MapAtlas } from '@exile/client/game/modules/overworld/resources/map-atlas';
import { ensure } from '@exile/common/utils/assert';
import { TerritoryController } from '@exile/client/game/modules/overworld/partials/territory-controller';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { frustumCullMesh } from '@exile/client/engine/renderer-gl/extensions/object-level-culling';
import { onBeforeCompile } from '@exile/client/engine/renderer-gl/extensions/on-before-compile';
import { TerritoryArranger } from '@exile/client/game/modules/overworld/partials/territory-arranger';

/**
 * Controller creating instanced mesh of territories
 */
export class TerritoryInstanceController extends TerritoryController {

    private mapTerritoryStyle = this.inject(MapTerritoryStyle);

    private territoryArranger = this.inject(TerritoryArranger);

    private mapAtlas = this.inject(MapAtlas);

    private worldScene = this.inject(WorldPlane);

    private meshes: Map<number, InstancedNodeMesh<three.InstancedBufferGeometry>> = new Map();

    private renderedMeshes: Set<InstancedNodeMesh> = new Set();

    public register(allTerritories: Territory[]): void {
        const tInfos: TexturedTerritory[] = allTerritories.map(territory => ({
            descriptor: this.mapAtlas.getTileTexture(territory),
            territory,
        }));

        const grouped = new Map<three.Texture, TexturedTerritory[]>();

        for (const texTer of tInfos) {
            if (grouped.has(texTer.descriptor.texture)) {
                grouped.get(texTer.descriptor.texture)!.push(texTer);
            } else {
                grouped.set(texTer.descriptor.texture, [texTer]);
            }
        }

        for (const [texture, group] of grouped) {
            const territories = group.map(ti => ti.territory);
            const geometry = this.makeInstancedGeometry(group);
            const mesh = new InstancedNodeMesh(
                geometry,
                this.makeTextureMaterial(texture),
                territories.length,
                true,
            );

            geometry.computeBoundingBox();

            const bottomLeft = new three.Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
            const topRight = new three.Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

            for (const [i, territory] of territories.entries()) {
                const tVec = this.territoryArranger.getTerritoryVector(territory);
                const objMatrix = new three.Matrix4().makeTranslation(tVec.x, tVec.y, tVec.z);

                mesh.setMatrixAt(i, objMatrix);

                const bbox = geometry.boundingBox!.clone().translate(tVec);
                this.meshes.set(territory.id, mesh);

                bottomLeft.min(bbox?.min);
                topRight.max(bbox?.max);
            }

            frustumCullMesh(mesh, new three.Box3(bottomLeft, topRight));
        }
    }

    public renderTerritory(territory: Territory): void {
        const mesh = ensure(
            this.meshes.get(territory.id),
            `Instanced mesh for territory ${territory.id} not found`,
        );

        if (!this.renderedMeshes.has(mesh)) {
            this.worldScene.scene.add(mesh);
            this.renderedMeshes.add(mesh);
        }
    }

    private makeInstancedGeometry(texTers: TexturedTerritory[]): three.InstancedBufferGeometry {
        const instancedGeometry = new three.InstancedBufferGeometry();

        instancedGeometry.copy(this.mapTerritoryStyle.planeGeometry);

        const texPosAttr = new Float32Array(texTers.length * 4);

        for (const [i, texTer] of texTers.entries()) {
            const { rangeX, rangeY } = texTer.descriptor;

            texPosAttr.set([rangeX[0], rangeX[1], rangeY[0], rangeY[1]], i * 4);
        }

        instancedGeometry.setAttribute(
            'texPos',
            new three.InstancedBufferAttribute(texPosAttr, 4),
        );

        return instancedGeometry;
    }

    public makeTextureMaterial(texture: three.Texture): three.Material {
        texture.needsUpdate = true;
        const material = this.mapTerritoryStyle.makeTextureMaterial(texture);

        onBeforeCompile(material, shader => {
            shader.vertexShader = `
                attribute vec4 texPos;
                ${shader.vertexShader}
            `;
            shader.vertexShader = shader.vertexShader.replace(`#include <uv_vertex>`, /* glsl */`
                vUv = uv * vec2(texPos[1] - texPos[0], texPos[3] - texPos[2]) + vec2(texPos[0], texPos[2]);
            `);
        });

        return material;
    }
}

interface TexturedTerritory {
    territory: Territory;
    descriptor: AtlasTextureDescriptor;
}
