import jimp, * as Jimp from 'jimp';
import mkdirp from 'mkdirp';
import path from 'path';
import { promises as fs } from 'fs';
import { Pos } from '@exile/common/types/geometry';
import { OverworldMapManifest } from '@exile/client/game/modules/overworld/resources/overworld-map-manifest';

export class ChunkWriter {

    public static async create(
        imagePath: string,
        outputPath: string,
        scale: number,
    ): Promise<ChunkWriter> {
        const fullMap = await jimp.read(imagePath);

        fullMap.resize(
            Math.floor(scale * fullMap.getWidth()),
            Math.floor(scale * fullMap.getHeight()),
        );

        return new ChunkWriter(fullMap, outputPath);
    }

    public fullMapWidth: number;

    public fullMapHeight: number;

    private queue: ChunkDetails[] = [];

    private constructor(
        private fullMap: Jimp,
        private outputPath: string,
    ) {
        this.fullMapWidth = fullMap.getWidth();
        this.fullMapHeight = fullMap.getHeight();
    }

    public enqueueChunk(chunkDeets: ChunkDetails): void {
        this.queue.push(chunkDeets);
    }

    public async execute(yScale: number): Promise<void> {
        await mkdirp(this.outputPath);

        const manifest: OverworldMapManifest = {
            chunks: [],
            yScale,
        };
        const manifestPath = path.resolve(this.outputPath, 'map-manifest.json');

        for (const chunk of this.queue) {
            const width = chunk.toPixel.x - chunk.fromPixel.x;
            const height = chunk.toPixel.y - chunk.fromPixel.y;
            const chunkFilename = `./chunk-${chunk.fromTile.x}-${chunk.fromTile.y}.png`;

            manifest.chunks.push({
                width,
                height,
                fromTile: chunk.fromTile,
                toTile: chunk.toTile,
                filename: chunkFilename,
            });

            const chunkImage = await jimp.create(width, height);
            const chunkPath = path.resolve(this.outputPath, chunkFilename);

            const availableWidth = this.fullMapWidth - chunk.fromPixel.x;
            const availableHeight = this.fullMapHeight - chunk.fromPixel.y;

            chunkImage.blit(
                this.fullMap,
                0,
                Math.max(0, height - availableHeight),
                chunk.fromPixel.x,
                Math.max(this.fullMapHeight - chunk.toPixel.y, 0),
                Math.min(width, availableWidth),
                Math.min(height, availableHeight),
            );

            await chunkImage.writeAsync(chunkPath);
            await fs.writeFile(manifestPath, JSON.stringify(manifest), { encoding: 'utf-8' });
        }
    }
}

interface ChunkDetails {
    fromPixel: Pos;
    toPixel: Pos;
    fromTile: Pos;
    toTile: Pos;
}
