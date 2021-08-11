import { Events, PayloadMap, SupportedEventType } from '@exile/client/engine/core/events';

export abstract class EventsQueued<TEvent extends SupportedEventType, TPayloads extends PayloadMap<TEvent> = { [k in TEvent]: null }, TReturn = void> extends Events<TEvent, TPayloads, TReturn> {

    public static emitEvents(events: EventsQueued<any, any, any>): void {
        events.emitEvents();
    }

    private queuedEvents: [TEvent, TPayloads[any]][] = [];

    public enqueue<T extends TEvent>(
        event: TEvent,
        ...values: Extract<TPayloads[T], undefined> extends never ? [TPayloads[T]] : [TPayloads[T]?]
    ): void {
        this.queuedEvents.push([event, values[0] as TPayloads[T]]);
    }

    private emitEvents(): void {
        for (const [event, payload] of this.queuedEvents) {
            this.emit(event, payload);
        }

        this.queuedEvents = [];
    }
}
