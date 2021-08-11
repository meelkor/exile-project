const DebugNameProp = Symbol();

function DebugNameImpl<T extends Function>(name: string): (c: T) => void {
    return (constr: T) => {
        (constr as any)[DebugNameProp] = name;
    };
}

(DebugNameImpl as any).get = (c: Function) => {
    return (c as any)[DebugNameProp];
};

/**
 * Decrator which may be used write and read debug name of classes, which may
 * be useful in assertions. Stripped in production build.
 */
export const DebugName = (DebugNameImpl as typeof DebugNameImpl & { get(c: Function): string });
