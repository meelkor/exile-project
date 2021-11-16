const HELP = `
Tool to clip maps exported from inkarnate into tiles currently accepted by
by the map component.

Usage: inkarnate-clip
    -i INPUT_JPEG           Path to the JPEG exported from inkarnate
    -w TILE_WIDTH           Width of single tile
    -t OUTPUT_TILE_WIDTH    Width of single tile in the output images
    -f X_OFFSET,Y_OFFSET    Offset of the first fully-visible tile from
                            bottom-left corner
    -o OUT_DIRECTORY        Where to save cut textures and map-manifest.json
    -y Y_SCALE              Scale of the tile's height compared to the width
                            (basically aspect ratio of bounding box)
`;

import { cli, assert } from '../cli';
import { ChunkWriter } from './chunk-writer';

/**
 * Both max width and height of one output texture
 */
const DEFAULT_TEXTURE_SIZE = 2048;

cli(HELP, async (argv) => {
    const inputFilePath = argv('i', 'No input file provided', 'string');
    const outputDirPath = argv('o', 'No output directory provided', 'string');
    const offset = argv('f', 'No offset provided', 'string');
    const inputTileWidth = argv('w', 'No tile width provided', 'int');
    const tileWidth = argv('t', 'No tile output width provided', 'int');
    const yScale = argv('y', 'No y-scale provided', 'float');
    const textureSize = argv('s', 'Output texture size', 'float', DEFAULT_TEXTURE_SIZE);

    const offsetParts = offset.split(',');

    assert(offsetParts.length === 2, 'Invalid offset string');

    const scale = tileWidth / inputTileWidth;

    const offsetX = Math.round(parseInt(offsetParts[0]!) * scale);
    const offsetY = Math.round(parseInt(offsetParts[1]!) * scale);

    assert(!Number.isNaN(offsetX), 'Invalid x offset');
    assert(!Number.isNaN(offsetY), 'Invalid y offset');

    const { minChunkHeight, tilesPerChunkY, chunkHeight, bufferY } = getHeightLimits(tileWidth, yScale, textureSize);
    const { minChunkWidth, tilesPerChunkX, chunkWidth, bufferX } = getWidthLimits(tileWidth, textureSize);

    const chunkWriter = await ChunkWriter.create(inputFilePath, outputDirPath, scale);

    let pointerX = offsetX;
    let pointerY = offsetY;

    let tilePointerX = 0;
    let tilePointerY = 0;

    for (;;) {
        const remHeight = chunkWriter.fullMapHeight - pointerY;

        if (remHeight < minChunkHeight) {
            break;
        }

        const copyRangeY = [pointerY, pointerY + chunkHeight] as const;
        const tileRangeY = [tilePointerY, tilePointerY + tilesPerChunkY] as const;

        tilePointerY += tilesPerChunkY;
        pointerY += chunkHeight - bufferY;

        for (;;) {
            const remWidth = chunkWriter.fullMapWidth - pointerX;

            if (remWidth < minChunkWidth) {
                pointerX = offsetX;
                tilePointerX = 0;
                break;
            }

            const copyRangeX = [pointerX, pointerX + chunkWidth] as const;
            const tileRangeX = [tilePointerX, tilePointerX + tilesPerChunkX] as const;

            tilePointerX += tilesPerChunkX;
            pointerX += chunkWidth - bufferX;

            chunkWriter.enqueueChunk({
                fromPixel: {
                    x: copyRangeX[0],
                    y: copyRangeY[0],
                },
                toPixel: {
                    x: copyRangeX[1],
                    y: copyRangeY[1],
                },
                fromTile: {
                    x: tileRangeX[0],
                    y: tileRangeY[0],
                },
                toTile: {
                    x: tileRangeX[1],
                    y: tileRangeY[1],
                },
            });
        }
    }

    await chunkWriter.execute(textureSize, yScale);
});

function getHeightLimits(tileWidth: number, yScale: number, textureSize: number): HeightLimits {
    const w = tileWidth / 2;
    const rad = Math.PI / 6;
    const b = w * Math.tan(rad) * yScale;
    const a = w / Math.cos(rad) * yScale;

    const bufferY = a - b;
    const tilesPerChunkY = Math.floor((textureSize - bufferY) / (a + b));
    const minChunkHeight = Math.ceil(2 * a);
    const chunkHeight = Math.ceil((tilesPerChunkY) * (a + b) + bufferY);

    return {
        tilesPerChunkY,
        minChunkHeight,
        chunkHeight,
        bufferY,
    };
}

function getWidthLimits(tileWidth: number, textureSize: number): WidthLimits {
    const tilesPerChunkX = Math.floor((textureSize - tileWidth / 2) / tileWidth);
    const minChunkWidth = tileWidth;
    const chunkWidth = tilesPerChunkX * tileWidth + Math.ceil(tileWidth / 2);
    const bufferX = tileWidth / 2;

    return {
        tilesPerChunkX,
        minChunkWidth,
        chunkWidth,
        bufferX,
    };
}

interface HeightLimits {
    /**
     * Number of tiles that are fully visible in the chunk
     */
    tilesPerChunkY: number;
    /**
     * Minimal dimension to contain at least one full tile
     */
    minChunkHeight: number;
    /**
     * Pixel size of the final chunk
     */
    chunkHeight: number;
    /**
     * Number of pixels which need to be included in both current and neighbour
     * chunk, so single territory instance doesn't need to use two textures
     * when rendered
     */
    bufferY: number;
}

/**
 * @see HeightLimits
 */
interface WidthLimits {
    tilesPerChunkX: number;
    minChunkWidth: number;
    chunkWidth: number;
    bufferX: number;
}
