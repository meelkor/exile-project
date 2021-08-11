import { EventsQueued } from '@exile/client/engine/core/events-queued';
import { GameEventId } from '@exile/client/engine/game-event/game-event-type';

/**
 * Service for components, backend and timers to emit their events whenever its
 * their turn
 */
export class GameEvents extends EventsQueued<GameEventId, { [k in GameEventId]: GameEventPayload }> { }

/**
 * As game event values are computed on runtime, we cannot map them to their
 * payload types, so event listeners need to check the type themselves using
 * e.g. the asNumber tool fn.
 */
export type GameEventPayload = string | number | undefined;

export type GameEventHandler = (paylaod: GameEventPayload) => void;
