import { InjectableValue } from '@exile/common/utils/di';

export class ViewConfig extends InjectableValue<ViewConfig.Value> { }

export namespace ViewConfig {
    export interface Value {
        canvas: HTMLCanvasElement;
    }
}
