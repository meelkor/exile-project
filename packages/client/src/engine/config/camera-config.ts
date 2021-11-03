import { InjectableValue } from '@exile/common/utils/di';

export class CameraConfig extends InjectableValue<ICameraConfig> { }

interface ICameraConfig {
    fieldOfView: number;
    angle: number;
}
