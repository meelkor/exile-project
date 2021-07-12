import { InjectableValue } from '@exile/utils/di';

export class ViewConfig extends InjectableValue<ViewConfig.Value> { }

export namespace ViewConfig {
    export interface Value {
        canvas: HTMLCanvasElement;
    }
}

