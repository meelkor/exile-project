import { SupportedEventType } from '@exile/client/engine/core/events';
import { EventsQueued } from '@exile/client/engine/core/events-queued';

export abstract class Store<T extends SupportedEventType> extends EventsQueued<T> {
}
