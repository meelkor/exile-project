import { Component } from '@exile/client/engine/component/component';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import * as three from 'three';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';

/**
 * Should not be changed as some calculations are simplified by the distance
 * being 1. Puttin into constant just for clarity.
 */
const TILE_DISTANCE = 1;

export class MapTerritoryCmp extends Component {

    private worldPlane = this.inject(WorldPlane);

    private planeGeometry = this.makeGeometryTemplate();

    private yVector = new three.Vector3(
        TILE_DISTANCE / 2,
        Math.sqrt(1 - TILE_DISTANCE / 2 ** 2),
        0,
    );

    protected onInit(): void {
        for (let x = 0; x < 20; x++) {
            for (let y = 0; y < 20; y++) {
                this.makeTerritory(x, y, 0xffffff * Math.random());
            }
        }
    }

    protected onTick(): void { /** noop */ }

    private makeTerritory(x: number, y: number, color: three.ColorRepresentation): void {
        const vec = new three.Vector3(x, 0, 0)
            .add(this.yVector.clone().multiplyScalar(y));

        const material = new three.MeshBasicMaterial({
            color,
            fog: true,
        });

        const mesh = new NodeMesh(this.planeGeometry, material, true);

        mesh.position.copy(vec);

        this.worldPlane.scene.add(mesh);
    }

    private makeGeometryTemplate(): three.CircleBufferGeometry {
        const radius = TILE_DISTANCE / 2 / Math.cos(Math.PI / 6);
        const plane = new three.CircleBufferGeometry(radius, 6);
        plane.rotateZ(Math.PI / 2);

        return plane;
    }

}
