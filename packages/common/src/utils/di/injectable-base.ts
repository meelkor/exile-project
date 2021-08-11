import { HookAfterConstructed } from '@exile/common/utils/di/hooks';

export class InjectableBase {

    static runAfterHookConstructed(injectable: InjectableBase): void {
        injectable[HookAfterConstructed]?.();
    }

    protected [HookAfterConstructed]?(): void;
}
