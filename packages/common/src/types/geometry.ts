export interface Pos {
    readonly x: number;
    readonly y: number;
}

export interface Dimensions {
    readonly width: number;
    readonly height: number;
}

export interface Box extends Dimensions {
    readonly left: number;
    readonly top: number;
}
