import { Component } from '@exile/client/engine/component/component';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import * as three from 'three';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { enableTimeUniform } from '@exile/client/engine/renderer-gl/extensions/time';
import { setFogIntensity } from '@exile/client/engine/renderer-gl/extensions/fog-intensity';
import { ClaimState, Territory } from '@exile/client/game/models/territory';
import { MapTerritoryStyle } from '@exile/client/game/modules/overworld/partials/map-territory-style-cache';
import { Cursor, CursorType } from '@exile/client/engine/view/cursor';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
import { assert } from '@exile/common/utils/assert';
import { OverworldEvents } from '@exile/client/game/modules/overworld/overworld-events';

/**
 * Component visualizing single tile (territory) on hex map. Territory needs to
 * be set before adding to the scene.
 */
export class MapTerritoryCmp extends Component {

    private style = this.inject(MapTerritoryStyle);

    private worldPlane = this.inject(WorldPlane);

    private cursor = this.inject(Cursor);

    private objects: MapTerritoryObjects = {
        line: undefined,
        mesh: undefined,
    };

    private territoryId?: number;

    /**
     * Should territory react to mouse events?
     */
    private active = false;

    private hovered = false;

    private selected = false;

    public actions = {
        setTerritoryInfo: (territory: Territory): void => {
            const vec = new three.Vector3(territory.x, 0, 0)
                .add(this.style.yVector.clone().multiplyScalar(territory.y));

            const unknown = territory.claim === ClaimState.Unknown;

            const material = unknown ? this.style.unknownMaterial : this.style.visibleMaterial;

            const mesh = new NodeMesh(this.style.planeGeometry, material, true);

            setFogIntensity(mesh, territory.claim === ClaimState.Unknown ? 0.6 : 0.07);

            mesh.position.copy(vec);

            // TODO: optimize - either create specific material which uses mesh
            // uniforms to set style or use single mesh and just hide / show it and
            // change its position.
            const lineMaterial = new three.LineBasicMaterial({
                transparent: true,
            });
            enableTimeUniform(lineMaterial);

            const line = new three.Line(this.style.lineGeometry, lineMaterial);

            line.position.copy(vec);

            this.objects.mesh = mesh;
            this.objects.line = line;

            this.updateStyle();

            this.active = territory.claim !== ClaimState.Unknown;
            this.territoryId = territory.id;
        },

        setSelected: (value: boolean): void => {
            this.selected = value;
            this.updateStyle();
        },
    }

    protected onInit(): void {
        for (const object of Object.values(this.objects)) {
            assert(object, 'Object does not exist on map territory');
            this.worldPlane.scene.add(object);
        }

        this.viewEvents.on(ViewEventType.MouseIn, () => {
            if (this.active) {
                this.hovered = true;
                this.updateStyle();
                this.cursor.setCursor(this, CursorType.Pointer);
            }
        });

        this.viewEvents.on(ViewEventType.MouseOut, () => {
            if (this.active) {
                this.hovered = false;
                this.updateStyle();
                this.cursor.reset(this);
            }
        });

        this.viewEvents.on(ViewEventType.Click, () => {
            assert(this.territoryId, 'Territory has no ID');

            if (this.active) {
                this.gameEvents.enqueue(OverworldEvents.SelectTerritory, this.territoryId);
            } else {
                this.gameEvents.enqueue(OverworldEvents.SelectTerritory, undefined);
            }
        });
    }

    protected onTick(): void { /** noop */ }

    private updateStyle(): void {
        if (this.objects.line) {
            const line = this.objects.line;

            if (this.selected) {
                line.material.color.set(0x333333);
                line.material.opacity = 0.3;
                line.material.linewidth = 4;
                line.position.setZ(0.01);
            } else if (this.hovered) {
                line.material.color.set(0x0000FF);
                line.material.opacity = 0.3;
                line.material.linewidth = 4;
                line.position.setZ(0.01);
            } else {
                line.material.color.set(0x888888);
                line.material.opacity = 0.1;
                line.material.linewidth = 2;
                line.position.setZ(0.0);

            }
        }
    }
}

interface MapTerritoryObjects {
    mesh?: NodeMesh;
    line?: three.Line<three.BufferGeometry, three.LineBasicMaterial>;
}
