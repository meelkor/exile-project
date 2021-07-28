import { Component } from '@exile/client/engine/component/component';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import * as three from 'three';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { enableTimeUniform } from '@exile/client/engine/renderer-gl/extensions/time';
import paperUrl from '@exile/client/resources/textures/map/paper.png';
import { enableFogIntensity } from '@exile/client/engine/renderer-gl/extensions/fog-intensity';

/**
 * Should not be changed as some calculations are simplified by the distance
 * being 1. Puttin into constant just for clarity.
 */
const TILE_DISTANCE = 1;

export class MapTerritoryCmp extends Component {

    private worldPlane = this.inject(WorldPlane);

    private planeGeometry = this.makeGeometryTemplate();
    private lineGeometry = this.makeLineGeometry();

    private materialTemplate = this.makeMaterial();

    private yVector = new three.Vector3(
        TILE_DISTANCE / 2,
        Math.sqrt(1 - TILE_DISTANCE / 2 ** 2),
        0,
    );

    protected onInit(): void {
        for (let x = 0; x < 20; x++) {
            for (let y = 0; y < 20; y++) {
                this.makeTerritory(x, y);
            }
        }
    }

    protected onTick(): void { /** noop */ }

    private makeTerritory(x: number, y: number): void {
        const vec = new three.Vector3(x, 0, 0)
            .add(this.yVector.clone().multiplyScalar(y));

        const material = enableFogIntensity(this.materialTemplate.clone());
        enableTimeUniform(material);
        material.setFogIntensity(Math.random());

        const mesh = new NodeMesh(this.planeGeometry, material, true);


        mesh.position.copy(vec);

        this.worldPlane.scene.add(mesh);

        const lineMaterial = new three.LineBasicMaterial({
            color: 0x888888,
            opacity: 0.1,
            transparent: true,
            linewidth: 2,
        });
        enableTimeUniform(lineMaterial);

        const line = new three.Line(this.lineGeometry, lineMaterial);

        line.position.copy(vec);

        this.worldPlane.scene.add(line);
    }

    private makeMaterial(): three.Material {
        const texture = this.loader.load(paperUrl);
        return new three.MeshBasicMaterial({
            map: texture,
            fog: true,
        });
    }

    private makeGeometryTemplate(): three.CircleBufferGeometry {
        const radius = TILE_DISTANCE / 2 / Math.cos(Math.PI / 6);
        const plane = new three.CircleBufferGeometry(radius, 6);
        plane.rotateZ(Math.PI / 2);

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
        ]);
    }
}
