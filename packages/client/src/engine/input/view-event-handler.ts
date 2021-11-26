import { ViewEventListener, ViewEventType } from '@exile/client/engine/input/view-event-type';
import { ViewObjectQuery } from '@exile/client/engine/input/view-object-query';

export class ViewEventHandler<T extends ViewEventType = ViewEventType> {

    constructor(
        public readonly ownerNode: number,
        public readonly event: T,
        public readonly query: Readonly<ViewObjectQuery>,
        public readonly callback: ViewEventListener<T>,
    ) { }
}
