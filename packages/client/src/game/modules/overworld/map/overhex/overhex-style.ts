import * as three from 'three';
import { InjectableGlobal } from '@exile/common/utils/di';
import { TerritoryArranger } from '@exile/client/game/modules/overworld/map/territory-arranger';

export class OverhexStyle extends InjectableGlobal {

    private territoryArranger = this.inject(TerritoryArranger);

    public readonly territoryHeight = 0.1;

    public readonly territoryGeometry = this.createTerritoryGeometry();
    public readonly hillGeometry = this.createHillGeometry();
    public readonly lineGeometry = this.makeLineGeometry();

    private createTerritoryGeometry(): three.CylinderBufferGeometry {
        const geometry = this.createHexagonCylinder(
            this.territoryArranger.tileRadius,
            this.territoryHeight,
        );

        return geometry;
    }

    private createHillGeometry(): three.CylinderBufferGeometry {
        const height = 0.3;
        const geometry = this.createHexagonCylinder(
            0.05,
            height,
        );

        geometry.translate(0, 0, height / 2 + this.territoryHeight / 2);

        return geometry;
    }

    private createHexagonCylinder(radius: number, height: number): three.CylinderBufferGeometry {
        const geometry = new three.CylinderBufferGeometry(
            radius,
            radius,
            height,
            6,
        );

        geometry.rotateX(Math.PI * 0.5);

        return geometry;
    }

    private makeLineGeometry(): three.BufferGeometry {
        const geometry = new three.BufferGeometry().setFromPoints(
            this.territoryArranger.makeLineShape(),
        );

        geometry.translate(0, 0, this.territoryHeight * 0.5 + 0.001);

        return geometry;
    }
}
