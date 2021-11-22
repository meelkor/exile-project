const HELP = `
Merge SVG glyphs into ttf font with glyph mapped in TypeScript enum for use in
typescript file.

Usage:
    svg-to-ttf -o out/directory -n "Font Name" ...svg-files.svg
`;

import mkdirp from 'mkdirp';
import * as path from 'path';
import * as fs from 'fs';
import streamToString from 'stream-to-string';
import SVGIcons2SVGFontStream from 'svgicons2svgfont';
import { pascalCase } from 'change-case';
import svg2ttf from 'svg2ttf';
import svgOutlineStroke from 'svg-outline-stroke';
import { Readable } from 'stream';
import { cli, CliError } from '../cli';

/**
 * Start of the unicode private range
 */
let offset = 0xF000;

cli(HELP, async argv => {
    const out = argv('o', 'Out directory is missing', 'string');
    const fontName = argv('n', 'Font name is missing', 'string');
    const files = argv('_', 'No SVG file provided');

    const fullOutPath = path.resolve(process.cwd(), out);
    const fullTtfPath = path.join(fullOutPath, 'font.ttf');
    const fullTsPath = path.join(fullOutPath, 'index.ts');

    await mkdirp(fullOutPath);

    const glyphMap: Map<string, string> = new Map;

    const svgFontStream = new SVGIcons2SVGFontStream({
        fontName,
        fontHeight: 2000,
    });

    const streamPromise = streamToString(svgFontStream);

    for (const filePath of files) {
        if (!filePath.match(/\.svg$/)) {
            throw new CliError(`File ${filePath} doesn't seem to be a SVG`);
        }

        const fileFullPath = path.resolve(process.cwd(), filePath);
        const filename = path.basename(filePath, '.svg');
        const enumName = pascalCase(filename);
        const unicode = String.fromCharCode(offset++);

        glyphMap.set(enumName, unicode);

        const svgContent = await fs.promises.readFile(fileFullPath, { encoding: "utf-8" });
        const outlinedSvg = await svgOutlineStroke(svgContent);
        const iconStream = new Readable();

        iconStream.push(outlinedSvg);
        iconStream.push(null);

        (iconStream as any).metadata = {
            unicode: [unicode],
            name: filename,
        };

        svgFontStream.write(iconStream);
    }

    svgFontStream.end();

    const svgData = await streamPromise;

    console.log(`SVG font created, contains ${glyphMap.size} glyphs`);

    const outTtf = svg2ttf(svgData);
    const tsContent = createGlyphEnum(glyphMap);

    console.log('Converted to TTF');
    console.log('Writing results');

    await fs.promises.writeFile(fullTtfPath, outTtf.buffer);
    await fs.promises.writeFile(fullTsPath, tsContent, { encoding: 'utf-8' });

    console.log('Done');
});

function createGlyphEnum(map: Map<string, string>): string {
    let out = '';

    out += `export enum Glyph {\n`;

    for (const [key, value] of map) {
        out += `    ${key} = '${value}',\n`;
    }

    out += '}\n';

    return out;
}
