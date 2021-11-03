import { Http } from '@exile/client/engine/http/http';
import { ChunkManifest, OverworldMapManifest } from '@exile/client/game/modules/overworld/resources/overworld-map-manifest';
import { Pos } from '@exile/common/types/geometry';
import { interpolatePos } from '@exile/common/utils/interpolate';
import { assert, ensure } from '@exile/common/utils/assert';
import { Injectable } from '@exile/common/utils/di';
import * as three from 'three';
import { GlobalLoader } from '@exile/client/engine/renderer-gl/global-loader';
import { map, Observable } from 'rxjs';

export class MapAtlas extends Injectable {

    private textures: Map<number, three.Texture> = new Map();

    private tileChunkMap: Map<number, number> = new Map();

    private chunkManifestMap: Map<number, ChunkManifest> = new Map();

    private manifest?: OverworldMapManifest;

    private http = this.inject(Http);
    private loader = this.inject(GlobalLoader);

    public get yScale(): number {
        return ensure(this.manifest?.yScale, 'Manifest is not loaded or is invalid');
    }

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
                    const chunkId = this.getChunkId(chunk);

                    this.chunkManifestMap.set(chunkId, chunk);
                    this.textures.set(
                        chunkId,
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
        assert(this.chunkManifestMap, 'Manifest is not loaded');

        return [...this.chunkManifestMap.values()]
            .flatMap(chunk => (
                interpolatePos(chunk.fromTile, chunk.toTile).map(pos => {
                    const chunkId = this.getChunkId(chunk);

                    this.tileChunkMap.set(
                        this.getPosId(pos),
                        chunkId,
                    );

                    return {
                        pos,
                        chunkId,
                    };
                })
            ));
    }

    public getTileTexture(pos: Pos): AtlasTextureDescriptor {
        const posId = this.getPosId(pos);
        const chunkId = ensure(this.tileChunkMap.get(posId));

        const chunk = ensure(this.chunkManifestMap.get(chunkId));
        const texture = ensure(this.textures.get(chunkId));

        const tilesInWidth = chunk.toTile.x - chunk.fromTile.x + 0.5;
        const oddOffsetX = 0.5 / tilesInWidth;
        const tileWidth = 1 / tilesInWidth;
        const isOdd = pos.y % 2 === 1;

        const b = 0.5 * Math.sin(Math.PI / 6);
        const tileOverlap = (1 - 2 * b) / 2;
        // fixme: this is broken. And the constant changes with chunk size
        const tilesInHeight = chunk.toTile.y - chunk.fromTile.y;
        const tileHeight = 1 / (tilesInHeight - (tilesInHeight - 1) * tileOverlap);

        return {
            texture,
            rangeX: [
                (pos.x - chunk.fromTile.x) * tileWidth + (isOdd ? oddOffsetX : 0),
                (pos.x - chunk.fromTile.x + 1) * tileWidth + (isOdd ? oddOffsetX : 0),
            ],
            rangeY: [
                (pos.y - chunk.fromTile.y) * tileHeight - (pos.y - chunk.fromTile.y) * tileOverlap * tileHeight,
                (pos.y - chunk.fromTile.y + 1) * tileHeight - (pos.y - chunk.fromTile.y) * tileOverlap * tileHeight,
            ],
        };
    }

    private getChunkId(chunk: ChunkManifest): number {
        return this.getPosId(chunk.fromTile);
    }

    private getPosId(pos: Pos): number {
        return (pos.y << 16) | pos.x;
    }
}

export interface AtlasTextureDescriptor {
    texture: three.Texture;
    rangeX: [number, number];
    rangeY: [number, number];
}

interface AtlasTile {
    pos: Pos;
    chunkId: number;
}
