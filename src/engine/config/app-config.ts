import { InjectableValue } from '@exile/utils/di';

export class AppConfig extends InjectableValue<AppConfig.Value> { }

export namespace AppConfig {
    export interface Value {
        fpsLock?: number;
    }
}

