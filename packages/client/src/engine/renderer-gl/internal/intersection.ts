import * as three from 'three';
import { Pos } from '@exile/common/types/geometry';

export interface NodeIntersection {
    mesh: three.Mesh;
    position: Pos;
}
