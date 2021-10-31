import { GlobalState } from '@exile/client/game/main/global-state-module';
import { ClaimState } from '@exile/client/game/models/territory';
import { TerritoryInput, territoryListToDict } from '@exile/client/game/models/territoryUtils';
import { MapAtlas } from '@exile/client/game/modules/overworld/resources/map-atlas';
import { InjectableGlobal } from '@exile/common/utils/di';
import { map, Observable } from 'rxjs';

/**
 * Service used to initialize the application and global state
 */
export class MainInit extends InjectableGlobal {

    /**
     * Load all necessary data to create global state store module
     */
    public initGlobalState(): Observable<GlobalState> {
        const atlasUrl = `/assets/map-atlas`;

        return this.provide(MapAtlas).load(atlasUrl).pipe(
            map(atlas => {
                const territories: TerritoryInput[] = atlas.getTiles().map(atlasTile => ({
                    x: atlasTile.pos.x,
                    y: atlasTile.pos.y,
                    claim: ClaimState.Free,
                    slots: [],
                }));

                return {
                    territories: territoryListToDict(territories),
                };
            }),
        );
    }
}
