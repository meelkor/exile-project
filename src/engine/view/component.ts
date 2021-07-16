import { v4 as uuid } from 'uuid';

import { Injectable } from '@exile/utils/di/injectable';
import { ViewEventListener, ViewEventType } from '@exile/engine/events/view-events';
import { ComponentRegistry } from '@exile/engine/view/component-registry';

export abstract class Component extends Injectable {

    public readonly instanceId: string = uuid();

    private listeners: Partial<{ [k in ViewEventType]: ViewEventListener<k>[] }> = {};

    protected children: Component[] = [];

    private _componentRegistry = this.inject(ComponentRegistry);

    public execRender(): void {
        for (const child of this.children) {
            child.render();
        }

        this.render();
    }

    public bindComponent(): void {
        this._componentRegistry.register(this);

        this.init();
    }

    public unbindComponent(): void {
        this._componentRegistry.deregister(this);

        this.destroy();
    }

    protected abstract init(): void;

    protected abstract destroy(): void;

    protected abstract render(): void;

    protected on<T extends ViewEventType>(eventType: T, listener: ViewEventListener<T>): void {
        let arr = this.listeners[eventType];

        if (!arr) {
            arr = this.listeners[eventType] = [];
        }

        arr.push(listener as any);
    }
}
