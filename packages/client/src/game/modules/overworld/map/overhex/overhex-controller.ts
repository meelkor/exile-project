import * as three from 'three';
import { Territory } from '@exile/client/game/models/territory';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { TerritoryArranger } from '@exile/client/game/modules/overworld/map/territory-arranger';
import { OverhexStyle } from '@exile/client/game/modules/overworld/map/overhex/overhex-style';
import { Injectable } from '@exile/common/utils/di';
import { OverhexObject, OverhexObjectType } from '@exile/client/game/modules/overworld/map/overhex/overhex-object';
import { PlaneName } from '@exile/client/engine/renderer-gl/planes/plane-name';
import { ComponentIo } from '@exile/client/engine/component/componentIo';
import { TAG_OVERHEX_OBJECT } from '@exile/client/game/modules/overworld/map/overhex/overhex-tags';

/**
 * Controller to be used by map components for parsing map chunks and creating
 * rendering necessary objects into the scene. As this service directly creates
 * 3D objects, its method should be only called from scene/component lifecycle
 * methods.
 */
export class OverhexController extends Injectable {

    private territoryArranger = this.inject(TerritoryArranger);
    private overhexStyle = this.inject(OverhexStyle);

    private plane = this.inject(WorldPlane);

    private io = this.inject(ComponentIo);

    public register(_territories: Territory[]): void {
        const sun = new three.PointLight('#ffffff', 0.5, 100);
        sun.position.set(10, 10, 18);

        const ambience = new three.AmbientLight('#ffffff', 0.5);

        this.plane.scene.add(ambience);
        this.plane.scene.add(sun);
    }

    public renderTerritory(territory: Territory): void {
        const material = new three.MeshLambertMaterial({
            color: '#fafafa',
        });
        const lineMaterial = new three.LineBasicMaterial({
            color: '#aaaaaa',
        });

        const vector = this.territoryArranger.getTerritoryVector(territory);

        const mesh = new NodeMesh(this.overhexStyle.territoryGeometry, material);
        const line = new three.Line(this.overhexStyle.lineGeometry, lineMaterial);

        mesh.position.copy(vector);
        line.position.copy(vector);

        this.io.add(PlaneName.World, mesh);
        this.io.add(PlaneName.World, line);
    }

    public renderStandaloneObject(obj: OverhexObject): void {
        if (obj.type === OverhexObjectType.Mountain) {
            this.renderHill(obj);
        }
    }

    private renderHill(obj: OverhexObject): void {
        const material = new three.MeshLambertMaterial({
            color: '#807772',
        });

        const mesh = new NodeMesh(this.overhexStyle.hillGeometry, material);
        const sizeScale = 1 - (Math.random() * 0.2 - 0.1);
        // todo: fix heightscale moving the geometry below territory because
        //  scaling also scales its position. Put the z-position here into
        //  mesh instead
        const heightScale = 1 - Math.random() * 0.5;

        mesh.scale.set(sizeScale, sizeScale, heightScale);
        mesh.position.set(obj.pos.x, obj.pos.y, 0);

        mesh.tags.add(TAG_OVERHEX_OBJECT);

        this.io.add(PlaneName.World, mesh);
    }
}
