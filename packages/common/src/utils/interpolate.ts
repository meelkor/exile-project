import { Pos } from '@exile/common/types/geometry';

/**
 * Create list of all positions in matrix between given given two positions
 */
export function interpolatePos(fromPos: Pos, toPos: Pos): Pos[] {
    const out: Pos[] = [];

    for (let x = fromPos.x; x <= toPos.x; x++) {
        for (let y = fromPos.y; y <= toPos.y; y++) {
            out.push({ x, y });
        }
    }

    return out;
}
