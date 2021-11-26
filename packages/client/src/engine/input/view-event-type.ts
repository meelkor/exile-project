import { Pos } from '@exile/common/types/geometry';

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
    [ViewEventType.MouseMove]: MouseMoveViewEvent;
    [ViewEventType.MouseIn]: null;
    [ViewEventType.MouseOut]: null;
    [ViewEventType.Click]: ButtonViewEvent;
    [ViewEventType.MouseDown]: ButtonViewEvent;
    [ViewEventType.MouseUp]: ButtonViewEvent;
    [ViewEventType.Wheel]: WheelViewEvent;
}

export interface MouseMoveViewEvent {
    from: Pos;
    to: Pos;
}

export interface ButtonViewEvent {
    pos: Pos;
}

export interface WheelViewEvent {
    pos: Pos;
    delta: number;
}
