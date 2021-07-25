// eslint-disable-next-line @typescript-eslint/ban-types
export type AbstractConstructor<T> = Function & { prototype: T };
export type Constructor<T> = new (...args: any[]) => T;
