import { HookAfterConstructed, HookBeforeConstructed } from '@exile/common/utils/di/hooks';

export class InjectableBase {

    static runAfterHookConstructed(injectable: InjectableBase): void {
        injectable[HookAfterConstructed]?.();
    }

    static runBeforeHookConstructed(injectable: InjectableBase): void {
        injectable[HookBeforeConstructed]?.();
    }

    protected [HookBeforeConstructed]?(): void;

    protected [HookAfterConstructed]?(): void;
}
