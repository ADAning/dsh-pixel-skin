/**
 * User-tweakable pixel-skin settings. Stored in localStorage so the skin
 * remains an out-of-tree client plugin and never touches dsh settings.yaml.
 * The component writes attributes on <body>; CSS and the plugin read those
 * attributes, so there is no second runtime state to drift.
 */
export type ScanlineMode = 'off' | 'light' | 'standard';
export type PixelFontMode = 'hybrid' | 'pure';
export type PixelPaletteId = 'retro' | 'cyberpunk' | 'sunset' | 'mono';
export interface PixelSkinSettings {
    enabled: boolean;
    scanline: ScanlineMode;
    cursor: boolean;
    vignette: boolean;
    fontMode: PixelFontMode;
    palette: PixelPaletteId;
}
export declare const DEFAULT_SETTINGS: PixelSkinSettings;
/** Read and validate the persisted settings, falling back field-by-field. */
export declare function readSettings(): PixelSkinSettings;
/** Persist one settings snapshot. */
export declare function saveSettings(settings: PixelSkinSettings): void;
/** Project settings onto body attributes consumed by the skin stylesheet. */
export declare function applySettingsToDom(settings: PixelSkinSettings): void;
/** Persist, project, and notify the theme layer of one settings snapshot. */
export declare function commitSettings(settings: PixelSkinSettings): void;
/** Restore persisted settings after the plugin (re)activates. */
export declare function restoreSettings(): void;
/** Event name emitted by the settings row when a preference changes. */
export declare function onSettingsChanged(listener: (settings: PixelSkinSettings) => void): () => void;
/** Retract settings attributes when the plugin is disposed. */
export declare function clearSettingsFromDom(): void;
