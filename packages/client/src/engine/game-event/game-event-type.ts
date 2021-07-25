export function makeEventId(
    eventSource: EventSource,
    eventType: number,
    eventName: number,
    eventValue: number,
): number {
    return eventSource
        & eventType << 2
        & eventName << 8
        & eventValue << 16;
}

const enum EventSource {
    Global,
    Backend,
    Player,
    Timer,
}

/**
 * Bit position     |   Meaning
 * ---------------------------------------
 * 0 - 1            |   EventSource
 * 2 - 7            |   EventType
 * 8 - 15           |   EventName
 * 16 - 32          |   EventValue
 */
export type GameEventId = number;
