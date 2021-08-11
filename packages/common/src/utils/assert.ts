function assertMain<T>(v: T, msg?: string): asserts v {
    if (!exists(v)) {
        throw new AssertionError(msg);
    }
}

function assertEnumUnique(Enum: Record<number | string, string | number>): void {
    const uniqSet = new Map<number | string, string | number>();

    for (const [enumKey, enumVal] of Object.entries(Enum)) {
        if (uniqSet.has(enumVal)) {
            const prevKey = uniqSet.get(enumVal);

            throw new AssertionError(`Enum has value ${enumVal} under both ${enumKey} and ${prevKey}`);
        } else {
            uniqSet.set(enumVal, enumKey);
        }
    }
}

export const assert: AssertFn = Object.assign(assertMain, {
    enumUnique: assertEnumUnique,
});

export function ensure<T>(v: T | undefined | null): T {
    assert(v, 'Ensure failed');
    return v;
}

export function asNumber(v: unknown): number {
    assert(typeof v === 'number', `Expected number, got ${typeof v}`);
    return v;
}

export function asNumberOrUndefined(v: unknown): number | undefined {
    assert(v === undefined || typeof v === 'number', `Expected number or undefined, got ${typeof v}`);
    return v;
}

export function exists<T>(v: T): v is NonNullable<T> {
    return v !== undefined && v !== null;
}

export class AssertionError extends Error {
    public override name = 'AssertionError';
}

type AssertFn = typeof assertMain & {
    enumUnique: typeof assertEnumUnique;
};
