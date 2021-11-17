import { Component } from '@exile/client/engine/component/component';
import { ClaimState, Territory } from '@exile/client/game/models/territory';
import { Cursor, CursorType } from '@exile/client/engine/view/cursor';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
import { assert } from '@exile/common/utils/assert';
import { OverworldEvents } from '@exile/client/game/modules/overworld/overworld-events';
import { OverhexController } from '@exile/client/game/modules/overworld/map/overhex/overhex-controller';

/**
 * Component visualizing single tile (territory) on hex map. Territory needs to
 * be set before adding to the scene.
 */
export class MapTerritoryCmp extends Component {

    private cursor = this.inject(Cursor);

    private overhexController = this.inject(OverhexController);

    private territoryId?: number;

    /**
     * Should territory react to mouse events?
     */
    private active = false;

    private hovered = false;

    private selected = false;

    public actions = {
        setTerritoryInfo: (territory: Territory): void => {
            this.overhexController.renderTerritory(territory);

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
        this.viewEvents.on(ViewEventType.MouseIn, () => {
            if (this.active) {
                this.hovered = true;
                this.updateStyle();
                this.cursor.setCursor(CursorType.Pointer);
            }
        });

        this.viewEvents.on(ViewEventType.MouseOut, () => {
            if (this.active) {
                this.hovered = false;
                this.updateStyle();
                this.cursor.reset();
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
