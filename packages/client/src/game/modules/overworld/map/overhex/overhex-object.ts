import { Pos } from '@exile/common/types/geometry';

export interface OverhexObject {
    id: number;
    pos: Pos;
    type: OverhexObjectType;
}

export enum OverhexObjectType {
    Mountain = 'mountain',
}
