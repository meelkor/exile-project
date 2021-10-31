import { ClaimState, Territory } from '@exile/client/game/models/territory';
import { territoryId } from '@exile/client/game/models/territoryUtils';

export function strMapToTerritories(strMap: string[][]): Territory[] {
    return strMap.flatMap((row, x) => row.map((str, y) => ({
        y,
        x,
        slots: [],
        id: territoryId(x, y),
        claim: str.includes('f') ? ClaimState.Free
            : str.includes('g') ? ClaimState.Guarded
                : str.includes('s') ? ClaimState.Scoutable
                    : str.includes('b') ? ClaimState.Blocked
                        : ClaimState.Unknown,
    })));
}
