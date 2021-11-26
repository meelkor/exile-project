declare module 'troika-three-text' {
    import * as three from 'three';

    export class Text extends three.Mesh {

        /**
         * The string of text to be rendered.
         */
        public text: string = '';

        /**
         * Defines the horizontal position in the text block that should line up with the local origin.
         * Can be specified as a numeric x position in local units, a string percentage of the total
         * text block width e.g. `'25%'`, or one of the following keyword strings: 'left', 'center',
         * or 'right'.
         */
        public anchorX: number|string = 0;

        /**
         * Defines the vertical position in the text block that should line up with the local origin.
         * Can be specified as a numeric y position in local units (note: down is negative y), a string
         * percentage of the total text block height e.g. `'25%'`, or one of the following keyword strings:
         * 'top', 'top-baseline', 'middle', 'bottom-baseline', or 'bottom'.
         */
        public anchorY: number|string = 0;

        /**
         * Defines a cylindrical radius along which the text's plane will be curved. Positive numbers put
         * the cylinder's centerline (oriented vertically) that distance in front of the text, for a concave
         * curvature, while negative numbers put it behind the text for a convex curvature. The centerline
         * will be aligned with the text's local origin; you can use `anchorX` to offset it.
         *
         * Since each glyph is by default rendered with a simple quad, each glyph remains a flat plane
         * internally. You can use `glyphGeometryDetail` to add more vertices for curvature inside glyphs.
         */
        public curveRadius: number = 0;

        /**
         * Sets the base direction for the text. The default value of "auto" will choose a direction based
         * on the text's content according to the bidi spec. A value of "ltr" or "rtl" will force the direction.
         */
        public direction: string = 'auto';

        /**
         * URL of a custom font to be used. Font files can be any of the formats supported by
         * OpenType (see https://github.com/opentypejs/opentype.js).
         * Defaults to the Roboto font loaded from Google Fonts.
         */
        public font: string = null //will use default from TextBuilder;

        /**
         * The size at which to render the font in local units; corresponds to the em-box height
         * of the chosen `font`.
         */
        public fontSize: number = 0.1;

        /**
         * Sets a uniform adjustment to spacing between letters after kerning is applied. Positive
         * numbers increase spacing and negative numbers decrease it.
         */
        public letterSpacing: number = 0;

        /**
         * Sets the height of each line of text, as a multiple of the `fontSize`. Defaults to 'normal'
         * which chooses a reasonable height based on the chosen font's ascender/descender metrics.
         */
        public lineHeight: number|string = 'normal';

        /**
         * The maximum width of the text block, above which text may start wrapping according to the
         * `whiteSpace` and `overflowWrap` properties.
         */
        public maxWidth: number = Infinity;

        /**
         * Defines how text wraps if the `whiteSpace` property is `normal`. Can be either `'normal'`
         * to break at whitespace characters, or `'break-word'` to allow breaking within words.
         * Defaults to `'normal'`.
         */
        public overflowWrap: string = 'normal';

        /**
         * The horizontal alignment of each line of text within the overall text bounding box.
         */
        public textAlign: string = 'left';

        /**
         * Indentation for the first character of a line; see CSS `text-indent`.
         */
        public textIndent: number = 0;

        /**
         * Defines whether text should wrap when a line reaches the `maxWidth`. Can
         * be either `'normal'` (the default), to allow wrapping according to the `overflowWrap` property,
         * or `'nowrap'` to prevent wrapping. Note that `'normal'` here honors newline characters to
         * manually break lines, making it behave more like `'pre-wrap'` does in CSS.
         */
        public whiteSpace: string = 'normal';

        /**
         * Defines a _base_ material to be used when rendering the text. This material will be
         * automatically replaced with a material derived from it, that adds shader code to
         * decrease the alpha for each fragment (pixel) outside the text glyphs, with antialiasing.
         * By default it will derive from a simple white MeshBasicMaterial, but you can use any
         * of the other mesh materials to gain other features like lighting, texture maps, etc.
         *
         * Also see the `color` shortcut property.
         */
        public material: THREE.Material = null;

        /**
         * This is a shortcut for setting the `color` of the text's material. You can use this
         * if you don't want to specify a whole custom `material`. Also, if you do use a custom
         * `material`, this color will only be used for this particuar Text instance, even if
         * that same material instance is shared across multiple Text objects.
         */
        public color: string|number|THREE.Color = null;

        /**
         * WARNING: This API is experimental and may change.
         * This allows more fine-grained control of colors for individual or ranges of characters,
         * taking precedence over the material's `color`. Its format is an Object whose keys each
         * define a starting character index for a range, and whose values are the color for each
         * range. The color value can be a numeric hex color value, a `THREE.Color` object, or
         * any of the strings accepted by `THREE.Color`.
         */
        public colorRanges: object|null = null;

        /**
         * WARNING: This API is experimental and may change.
         * The width of an outline/halo to be drawn around each text glyph using the `outlineColor` and `outlineOpacity`.
         * Can be specified as either an absolute number in local units, or as a percentage string e.g.
         * `"12%"` which is treated as a percentage of the `fontSize`. Defaults to `0`, which means
         * no outline will be drawn unless an `outlineOffsetX/Y` or `outlineBlur` is set.
         */
        public outlineWidth: number|string = 0;

        /**
         * WARNING: This API is experimental and may change.
         * The color of the text outline, if `outlineWidth`/`outlineBlur`/`outlineOffsetX/Y` are set.
         * Defaults to black.
         */
        public outlineColor: string|number|THREE.Color = 0x000000;

        /**
         * WARNING: This API is experimental and may change.
         * The opacity of the outline, if `outlineWidth`/`outlineBlur`/`outlineOffsetX/Y` are set.
         * Defaults to `1`.
         */
        public outlineOpacity: number = 1;

        /**
         * WARNING: This API is experimental and may change.
         * A blur radius applied to the outer edge of the text's outline. If the `outlineWidth` is
         * zero, the blur will be applied at the glyph edge, like CSS's `text-shadow` blur radius.
         * Can be specified as either an absolute number in local units, or as a percentage string e.g.
         * `"12%"` which is treated as a percentage of the `fontSize`. Defaults to `0`.
         */
        public outlineBlur: number|string = 0;

        /**
         * WARNING: This API is experimental and may change.
         * A horizontal offset for the text outline.
         * Can be specified as either an absolute number in local units, or as a percentage string e.g. `"12%"`
         * which is treated as a percentage of the `fontSize`. Defaults to `0`.
         */
        public outlineOffsetX: number|string = 0;

        /**
         * WARNING: This API is experimental and may change.
         * A vertical offset for the text outline.
         * Can be specified as either an absolute number in local units, or as a percentage string e.g. `"12%"`
         * which is treated as a percentage of the `fontSize`. Defaults to `0`.
         */
        public outlineOffsetY: number|string = 0;

        /**
         * WARNING: This API is experimental and may change.
         * The width of an inner stroke drawn inside each text glyph using the `strokeColor` and `strokeOpacity`.
         * Can be specified as either an absolute number in local units, or as a percentage string e.g. `"12%"`
         * which is treated as a percentage of the `fontSize`. Defaults to `0`.
         */
        public strokeWidth: number|string = 0;

        /**
         * WARNING: This API is experimental and may change.
         * The color of the text stroke, if `strokeWidth` is greater than zero. Defaults to gray.
         */
        public strokeColor: string|number|THREE.Color = defaultStrokeColor;

        /**
         * WARNING: This API is experimental and may change.
         * The opacity of the stroke, if `strokeWidth` is greater than zero. Defaults to `1`.
         */
        public strokeOpacity: number = 1;

        /**
         * WARNING: This API is experimental and may change.
         * The opacity of the glyph's fill from 0 to 1. This behaves like the material's `opacity` but allows
         * giving the fill a different opacity than the `strokeOpacity`. A fillOpacity of `0` makes the
         * interior of the glyph invisible, leaving just the `strokeWidth`. Defaults to `1`.
         */
        public fillOpacity: number = 1;

        /**
         * This is a shortcut for setting the material's `polygonOffset` and related properties,
         * which can be useful in preventing z-fighting when this text is laid on top of another
         * plane in the scene. Positive numbers are further from the camera, negatives closer.
         */
        public depthOffset: number = 0;

        /**
         * If specified, defines a `[minX, minY, maxX, maxY]` of a rectangle outside of which all
         * pixels will be discarded. This can be used for example to clip overflowing text when
         * `whiteSpace='nowrap'`.
         */
        public clipRect: Array<number> = null;

        /**
         * Defines the axis plane on which the text should be laid out when the mesh has no extra
         * rotation transform. It is specified as a string with two axes: the horizontal axis with
         * positive pointing right, and the vertical axis with positive pointing up. By default this
         * is '+x+y', meaning the text sits on the xy plane with the text's top toward positive y
         * and facing positive z. A value of '+x-z' would place it on the xz plane with the text's
         * top toward negative z and facing positive y.
         */
        public orientation: string = defaultOrient;

        /**
         * Controls number of vertical/horizontal segments that make up each glyph's rectangular
         * plane. Defaults to 1. This can be increased to provide more geometrical detail for custom
         * vertex shader effects, for example.
         */
        public glyphGeometryDetail: number = 1;

        /**
         * The size of each glyph's SDF (signed distance field) used for rendering. This must be a
         * power-of-two number. Defaults to 64 which is generally a good balance of size and quality
         * for most fonts. Larger sizes can improve the quality of glyph rendering by increasing
         * the sharpness of corners and preventing loss of very thin lines, at the expense of
         * increased memory footprint and longer SDF generation time.
         */
        public sdfGlyphSize: number|null = null;

        /**
         * Updates the text rendering according to the current text-related configuration properties.
         * This is an async process, so you can pass in a callback function to be executed when it
         * finishes.
         * @param {function} [callback]
         */
        public sync(callback?: Function): void;
    }
}
