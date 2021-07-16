export enum ViewEventType {
    MouseMove,
    MouseIn,
    MouseOut,
    Click,
    MouseDown,
    MouseUp,
}

export type ViewEventListener<K extends ViewEventType> = (e: ViewEventMap[K]) => boolean;

export interface ViewEventMap extends Record<ViewEventType, unknown> {
    [ViewEventType.MouseMove]: MouseMoveViewEvent;
    [ViewEventType.MouseIn]: MouseMoveViewEvent;
    [ViewEventType.MouseOut]: MouseMoveViewEvent;
    [ViewEventType.Click]: MouseMoveViewEvent;
    [ViewEventType.MouseDown]: MouseMoveViewEvent;
    [ViewEventType.MouseUp]: MouseMoveViewEvent;
}

interface MouseMoveViewEvent {
    original: MouseEvent;
    x: number;
    y: number;
}
