export interface Pos<T = number> {
    readonly x: T;
    readonly y: T;
}

export interface Dimensions {
    readonly width: number;
    readonly height: number;
}

export interface Box extends Dimensions {
    readonly left: number;
    readonly top: number;
}
