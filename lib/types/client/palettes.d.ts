/**
 * Switchable skin palettes.
 *
 * The base `PIXEL_TOKENS` layer is the green CRT/Game Boy palette. Each
 * alternate palette is a partial alias-layer override applied on top of it
 * under the `dsh-pixel-skin-palette` source, so switching palettes replaces
 * one layer without touching the base skin or the user's light/dark choice.
 */
import type { TokenModes } from './palette.js';
export type PixelPaletteId = 'retro' | 'cyberpunk' | 'sunset' | 'mono';
export declare const PIXEL_PALETTE_IDS: readonly PixelPaletteId[];
export declare const PALETTE_SWATCHES: readonly [{
    readonly id: "retro";
    readonly labelKey: "settings.pixelSkin.palette.retro";
    readonly label: "复古绿";
    readonly colors: readonly ["#e3ecd8", "#15172a", "#1f2a20"];
}, {
    readonly id: "cyberpunk";
    readonly labelKey: "settings.pixelSkin.palette.cyberpunk";
    readonly label: "赛博朋克";
    readonly colors: readonly ["#f4ecff", "#0b0716", "#c211a8"];
}, {
    readonly id: "sunset";
    readonly labelKey: "settings.pixelSkin.palette.sunset";
    readonly label: "日落街机";
    readonly colors: readonly ["#fff4e8", "#1b0f12", "#e85d1f"];
}, {
    readonly id: "mono";
    readonly labelKey: "settings.pixelSkin.palette.mono";
    readonly label: "单色终端";
    readonly colors: readonly ["#ffffff", "#101012", "#111111"];
}];
export declare const PALETTE_OVERRIDES: Record<PixelPaletteId, Record<string, TokenModes>>;
