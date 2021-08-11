export function makeEventId(
    eventSource: EventSource,
    eventNamespace: number,
    eventName: number,
): number {
    return eventSource
        | (eventNamespace << 2)
        | (eventName << 16);
}

export const enum EventSource {
    Global,
    Backend,
    Player,
    Timer,
}

/**
 * LSB position     |   Meaning
 * ---------------------------------------
 *  0 -  1          |   EventSource
 *  2 - 15          |   EventNamespace
 * 16 - 32          |   EventName
 */
export type GameEventId = number;
