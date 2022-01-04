import { Component } from '@exile/client/engine/component/component';
import { ClaimState, Territory } from '@exile/client/game/models/territory';
import { CursorType } from '@exile/client/engine/view/cursor';
import { ViewEventType } from '@exile/client/engine/input/view-event-type';
import { assert } from '@exile/common/utils/assert';
import { OverworldEvents } from '@exile/client/game/modules/overworld/overworld-events';
import { OverhexController } from '@exile/client/game/modules/overworld/map/overhex/overhex-controller';

/**
 * Component visualizing single tile (territory) on hex map. Territory needs to
 * be set before adding to the scene.
 */
export class MapTerritoryCmp extends Component {

    private overhexController = this.provide(OverhexController);

    private territoryId?: number;

    /**
     * Should territory react to mouse events?
     */
    private active = false;

    private hovered = false;

    private selected = false;

    public setTerritoryInfo(territory: Territory): void {
        this.overhexController.renderTerritory(territory);

        this.updateStyle();

        this.active = territory.claim !== ClaimState.Unknown
            && territory.claim !== ClaimState.Blocked;
        this.territoryId = territory.id;
    }

    public setSelected(value: boolean): void {
        this.selected = value;
        this.updateStyle();
    }

    protected onInit(): void {
        this.io.onInput(ViewEventType.MouseIn, () => {
            if (this.active) {
                this.hovered = true;
                this.updateStyle();
                this.io.setCursor(CursorType.Pointer);
            }
        });

        this.io.onInput(ViewEventType.MouseOut, () => {
            if (this.active) {
                this.hovered = false;
                this.updateStyle();
                this.io.resetCursor();
            }
        });

        this.io.onInput(ViewEventType.Click, () => {
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
