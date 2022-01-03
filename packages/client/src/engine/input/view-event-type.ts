import { Pos } from '@exile/common/types/geometry';
import { MeshLike } from '@exile/common/types/mesh-like';

export enum ViewEventType {
    MouseMove,
    MouseIn,
    MouseOut,
    Click,
    MouseDown,
    MouseUp,
    Wheel,
}

export type ViewEventListener<K extends ViewEventType = ViewEventType> = (e: ViewEventMap[K]) => boolean | void;

export interface ViewEventMap extends Record<ViewEventType, unknown> {
    [ViewEventType.MouseMove]: ViewEvent<MouseMoveViewInfo>;
    [ViewEventType.MouseIn]: ViewEvent<null>;
    [ViewEventType.MouseOut]: ViewEvent<null>;
    [ViewEventType.Click]: ViewEvent<ButtonViewInfo>;
    [ViewEventType.MouseDown]: ViewEvent<ButtonViewInfo>;
    [ViewEventType.MouseUp]: ViewEvent<ButtonViewInfo>;
    [ViewEventType.Wheel]: ViewEvent<WheelViewInfo>;
}

export interface ViewEvent<T> {
    info: T;
    mesh: MeshLike;
}

export interface MouseMoveViewInfo {
    from: Pos;
    to: Pos;
}

export interface ButtonViewInfo {
    pos: Pos;
}

export interface WheelViewInfo {
    pos: Pos;
    delta: number;
}
