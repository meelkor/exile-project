import * as three from 'three';
import { InjectableGlobal } from '@exile/common/utils/di';
import { MapAtlas } from '@exile/client/game/modules/overworld/resources/map-atlas';
import { Pos } from '@exile/common/types/geometry';

/**
 * Should not be changed as some calculations are simplified by the distance
 * being 1. Puttin into constant just for clarity.
 */
const TILE_DISTANCE = 1;

/**
 * Simple utility for positioning of territories
 */
export class TerritoryArranger extends InjectableGlobal {

    private mapAtlas = this.inject(MapAtlas);

    public readonly tileRadius = TILE_DISTANCE / 2 / Math.cos(Math.PI / 6);

    /**
     * Vector to be used to calculate territory position for even Y values
     */
    public readonly tileVector = new three.Vector3(
        1,
        Math.sqrt(1 - 1 / 2 ** 2) * this.mapAtlas.yScale,
        0,
    );

    public getTerritoryVector(pos: Pos): three.Vector3 {
        const vec = new three.Vector3(pos.x, pos.y, 0)
            .multiply(this.tileVector);

        if (pos.y % 2 === 1) {
            vec.add(new three.Vector3(1 / 2, 0, 0));
        }

        return vec;
    }

    public makeLineShape(): three.Vector3[] {
        const points = [
            new three.Vector3(-0.5, 0.28867512941360474, 0),
            new three.Vector3(-0.5, -0.28867512941360474, 0),
            new three.Vector3( 0, -0.5773502588272095, 0),
            new three.Vector3( 0.5, -0.28867512941360474, 0),
            new three.Vector3( 0.5, 0.28867512941360474, 0),
            new three.Vector3( 0, 0.5773502588272095, 0),
            new three.Vector3(-0.5, 0.28867512941360474, 0),
        ];

        for (const point of points) {
            point.setY(point.y * this.mapAtlas.yScale);
        }

        return points;
    }
}
