import * as three from 'three';
import { enableTimeUniform } from '@exile/client/engine/renderer-gl/extensions/time';
import paperUrl from '@exile/client/resources/textures/map/paper.png';
import { enableFogIntensity } from '@exile/client/engine/renderer-gl/extensions/fog-intensity';
import { InjectableGlobal } from '@exile/common/utils/di';
import { GlobalLoader } from '@exile/client/engine/renderer-gl/global-loader';

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

    private loader = this.inject(GlobalLoader);

    public readonly planeGeometry = this.makeGeometryTemplate();
    public readonly lineGeometry = this.makeLineGeometry();
    public readonly visibleMaterial = this.makeMaterial(0xFFFFFF);
    public readonly unknownMaterial = this.makeMaterial(0x999999);

    public readonly yVector = new three.Vector3(
        TILE_DISTANCE / 2,
        Math.sqrt(1 - TILE_DISTANCE / 2 ** 2),
        0,
    );

    private makeMaterial(color: three.ColorRepresentation): three.Material {
        const texture = this.loader.load(paperUrl);
        const material = new three.MeshBasicMaterial({
            map: texture,
            color,
        });

        enableTimeUniform(material);
        enableFogIntensity(material);

        return material;
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
            new three.Vector3(-0.5, 0.28867512941360474, 0),
        ]);
    }
}
