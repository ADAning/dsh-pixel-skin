import type { FUSION_PIXEL_LATIN_WOFF2_BASE64, FUSION_PIXEL_PROPORTIONAL_SC_WOFF2_BASE64, FUSION_PIXEL_SC_WOFF2_BASE64 } from './font-data.js';
import { LITERAL_FONT_PATCHES } from './literal-font-patches.js';
/**
 * Global pixel-skin stylesheet. The theme layer owns colors through the
 * `--dsw-*` token overrides; this sheet owns what tokens cannot say:
 * embedded bitmap fonts, the hybrid readable font stacks, square corners,
 * pixelated raster content, hard focus, the CRT scanline overlay, and the
 * generated exact-selector font-size patch layer.
 */
export declare function makeSkinCss(monoBase64: typeof FUSION_PIXEL_SC_WOFF2_BASE64, proportionalBase64: typeof FUSION_PIXEL_PROPORTIONAL_SC_WOFF2_BASE64, latinBase64: typeof FUSION_PIXEL_LATIN_WOFF2_BASE64, literalPatches: typeof LITERAL_FONT_PATCHES, heroIconUrl: string): string;
