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

        return new ChunkWriter(fullMap, outputPath, scale);
    }

    public fullMapWidth: number;

    public fullMapHeight: number;

    private queue: ChunkDetails[] = [];

    private constructor(
        private fullMap: Jimp,
        private outputPath: string,
        private scale: number,
    ) {
        this.fullMapWidth = fullMap.getWidth() * this.scale;
        this.fullMapHeight = fullMap.getHeight() * this.scale;
    }

    public enqueueChunk(chunkDeets: ChunkDetails): void {
        this.queue.push(chunkDeets);
    }

    public async execute(textureSize: number, yScale: number): Promise<void> {
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
                fromTile: chunk.fromTile,
                toTile: chunk.toTile,
                filename: chunkFilename,
            });

            const chunkPath = path.resolve(this.outputPath, chunkFilename);

            const availableWidth = this.fullMapWidth - chunk.fromPixel.x;
            const availableHeight = this.fullMapHeight - chunk.fromPixel.y;

            const fromXResized = chunk.fromPixel.x;
            const fromYResized = Math.max(this.fullMapHeight - chunk.toPixel.y, 0);
            const srcWidthResized = Math.min(width, availableWidth);
            const srcHeightResized = Math.min(height, availableHeight);

            const chunkImage = await jimp.create(srcWidthResized / this.scale, Math.max(0, (height - availableHeight) / this.scale) + srcHeightResized / this.scale);


            chunkImage.blit(
                this.fullMap,
                0,
                Math.max(0, (height - availableHeight) / this.scale),
                fromXResized / this.scale,
                fromYResized / this.scale,
                srcWidthResized / this.scale,
                srcHeightResized / this.scale,
            );

            chunkImage.resize(textureSize, textureSize);

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
