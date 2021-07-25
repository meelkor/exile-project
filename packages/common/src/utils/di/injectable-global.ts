import { Injectable } from '@exile/common/utils/di/injectable';
import { $global } from '@exile/common/utils/di/injectable-global-is';

/**
 * Injectable that is automatically provided when injected first time.
 */
export class InjectableGlobal extends Injectable {

    public static [$global] = true;
}
