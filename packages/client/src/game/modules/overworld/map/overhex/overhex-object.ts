import { Pos } from '@exile/common/types/geometry';

export interface OverhexObject {
    pos: Pos;
    type: OverhexObjectType;
}

export enum OverhexObjectType {
    Mountain = 'mountain',
}
