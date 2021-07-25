export function assert<T>(v: T, msg?: string): asserts v {
    if (!v) {
        throw new AssertionError(msg);
    }
}

export class AssertionError extends Error {
    public override name = 'AssertionError';
}
