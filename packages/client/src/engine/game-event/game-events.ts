import { EventsQueued } from '@exile/client/engine/core/events-queued';
import { GameEventId } from '@exile/client/engine/game-event/game-event-type';

/**
 * Service for components, backend and timers to emit their events whenever its
 * their turn
 */
export class GameEvents extends EventsQueued<GameEventId, { [k in GameEventId]: string }> { }
