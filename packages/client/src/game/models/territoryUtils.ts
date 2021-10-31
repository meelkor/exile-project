import { Territory } from '@exile/client/game/models/territory';
import { Pos } from '@exile/common/types/geometry';

export function territoryId(x: number, y: number): number {
    return (y << 16) | x;
}

export function parseTerritoryId(id: number): Pos {
    return {
        x: (id & (2 ** 16 - 1)),
        y: id >> 16,
    };
}

export function territoryListToDict(territory: TerritoryInput[]): Record<number, Territory> {
    return Object.fromEntries(
        territory.map(t => {
            const id = 'id' in t ? t.id : territoryId(t.x, t.y);
            return [id, { ...t, id }];
        }),
    );
}

export type TerritoryInput = PartialBy<Territory, 'id'>;

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
