import { Http } from '@exile/client/engine/http/http';
import { ChunkManifest, OverworldMapManifest } from '@exile/client/game/modules/overworld/resources/overworld-map-manifest';
import { Pos } from '@exile/common/types/geometry';
import { interpolatePos } from '@exile/common/utils/interpolate';
import { assert, ensure } from '@exile/common/utils/assert';
import { Injectable } from '@exile/common/utils/di';
import { Texture } from 'three';
import { GlobalLoader } from '@exile/client/engine/renderer-gl/global-loader';
import { map, Observable } from 'rxjs';

export class MapAtlas extends Injectable {

    private textures: Map<string, Texture> = new Map();

    private manifest?: OverworldMapManifest;

    private http = this.inject(Http);
    private loader = this.inject(GlobalLoader);

    /**
     * Pre-load all necessary map data.
     *
     * @param url Url to the directory containing manifest and chunk textures
     */
    public load(url: string): Observable<MapAtlas> {
        return this.http.json<OverworldMapManifest>(`${url}/map-manifest.json`).pipe(
            map(manifest => {
                this.manifest = manifest;

                for (const chunk of manifest.chunks) {
                    this.textures.set(
                        this.getChunkId(chunk),
                        this.loader.load(`${url}/${chunk.filename}`),
                    );
                }

                return this;
            }),
        );
    }

    /**
     * Get list of all tiles contained in the loaded atlas.
     */
    public getTiles(): AtlasTile[] {
        assert(this.manifest, 'Manifest is not loaded');

        return this.manifest.chunks
            .flatMap(chunk => (
                interpolatePos(chunk.fromTile, chunk.toTile).map(pos => ({
                    pos,
                    chunkId: this.getChunkId(chunk),
                }))
            ));
    }

    public getTexture(chunkId: string): Texture {
        return ensure(this.textures.get(chunkId));
    }

    private getChunkId(chunk: ChunkManifest): string {
        return `${chunk.fromTile}|${chunk.toTile}`;
    }
}

interface AtlasTile {
    pos: Pos;
    chunkId: string;
}
