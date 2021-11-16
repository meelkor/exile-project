import { Pos } from '@exile/common/types/geometry';

export interface OverworldMapManifest {
    chunks: ChunkManifest[];
    yScale: number;
}

export interface ChunkManifest {
    fromTile: Pos;
    toTile: Pos;
    filename: string;
}
