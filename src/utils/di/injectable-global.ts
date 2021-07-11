import { Injectable } from '@exile/utils/di/injectable';
import { $$GLOBAL } from '@exile/utils/di/injectable-global-is';

/**
 * Injectable that is automatically provided when injected first time.
 */
export class InjectableGlobal extends Injectable {

    public static [$$GLOBAL] = true;
}
