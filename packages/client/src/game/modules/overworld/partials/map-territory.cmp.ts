import { Component } from '@exile/client/engine/component/component';
import { NodeMesh } from '@exile/client/engine/renderer-gl/mesh';
import { WorldPlane } from '@exile/client/engine/renderer-gl/planes/world-plane';
import { ClaimState, Territory } from '@exile/client/game/models/territory';
import { MapTerritoryStyle } from '@exile/client/game/modules/overworld/partials/map-territory-style-cache';
import { Cursor, CursorType } from '@exile/client/engine/view/cursor';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
import { assert, ensure } from '@exile/common/utils/assert';
import { OverworldEvents } from '@exile/client/game/modules/overworld/overworld-events';

/**
 * Component visualizing single tile (territory) on hex map. Territory needs to
 * be set before adding to the scene.
 */
export class MapTerritoryCmp extends Component {

    private style = this.inject(MapTerritoryStyle);

    private worldPlane = this.inject(WorldPlane);

    private cursor = this.inject(Cursor);

    private mesh?: NodeMesh;

    private territoryId?: number;

    /**
     * Should territory react to mouse events?
     */
    private active = false;

    private hovered = false;

    private selected = false;

    public actions = {
        setTerritoryInfo: (territory: Territory): void => {
            this.mesh = this.style.getTerritoryMesh(territory);

            this.updateStyle();

            this.active = territory.claim !== ClaimState.Unknown
                && territory.claim !== ClaimState.Blocked;
            this.territoryId = territory.id;
        },

        setSelected: (value: boolean): void => {
            this.selected = value;
            this.updateStyle();
        },
    }

    protected onInit(): void {
        this.worldPlane.scene.add(ensure(this.mesh, 'Territory mesh was not created'));

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
        // todo
        this.hovered;
        this.selected;
    }
}
