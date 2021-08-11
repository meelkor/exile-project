import { EventSource, makeEventId } from '@exile/client/engine/game-event/game-event-type';
import { EventNamespace } from '@exile/client/game/namespaces';
import { assert } from '@exile/common/utils/assert';

export enum OverworldEvents {
    SelectTerritory = makeEventId(EventSource.Player, EventNamespace.Overworld, 0),
}

assert.enumUnique(OverworldEvents);
