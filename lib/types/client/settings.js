/**
 * User-tweakable pixel-skin settings. Stored in localStorage so the skin
 * remains an out-of-tree client plugin and never touches dsh settings.yaml.
 * The component writes attributes on <body>; CSS and the plugin read those
 * attributes, so there is no second runtime state to drift.
 */
const STORAGE_KEY = 'dsh.pixelSkin.v1';
const SETTINGS_EVENT = 'dsh-pixel-skin:settings';
export const DEFAULT_SETTINGS = {
    enabled: true,
    scanline: 'standard',
    cursor: true,
    vignette: true,
    fontMode: 'hybrid',
    palette: 'retro',
};
function isScanlineMode(value) {
    return value === 'off' || value === 'light' || value === 'standard';
}
function isFontMode(value) {
    return value === 'hybrid' || value === 'pure';
}
function isPaletteId(value) {
    return value === 'retro' || value === 'cyberpunk' || value === 'sunset' || value === 'mono';
}
/** Read and validate the persisted settings, falling back field-by-field. */
export function readSettings() {
    if (typeof localStorage === 'undefined')
        return { ...DEFAULT_SETTINGS };
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
        if (typeof parsed !== 'object' || parsed === null)
            return { ...DEFAULT_SETTINGS };
        const value = parsed;
        return {
            enabled: typeof value.enabled === 'boolean' ? value.enabled : DEFAULT_SETTINGS.enabled,
            scanline: isScanlineMode(value.scanline) ? value.scanline : DEFAULT_SETTINGS.scanline,
            cursor: typeof value.cursor === 'boolean' ? value.cursor : DEFAULT_SETTINGS.cursor,
            vignette: typeof value.vignette === 'boolean' ? value.vignette : DEFAULT_SETTINGS.vignette,
            fontMode: isFontMode(value.fontMode) ? value.fontMode : DEFAULT_SETTINGS.fontMode,
            palette: isPaletteId(value.palette) ? value.palette : DEFAULT_SETTINGS.palette,
        };
    }
    catch {
        return { ...DEFAULT_SETTINGS };
    }
}
/** Persist one settings snapshot. */
export function saveSettings(settings) {
    if (typeof localStorage === 'undefined')
        return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
    catch {
        // Storage disabled (private mode / full quota): the in-memory toggle still works.
    }
}
/** Project settings onto body attributes consumed by the skin stylesheet. */
export function applySettingsToDom(settings) {
    document.body.dataset.pixelEnabled = settings.enabled ? 'on' : 'off';
    document.body.dataset.pixelScanline = settings.scanline;
    document.body.dataset.pixelCursor = settings.cursor ? 'on' : 'off';
    document.body.dataset.pixelVignette = settings.vignette ? 'on' : 'off';
    document.body.dataset.pixelFontMode = settings.fontMode;
    document.body.dataset.pixelPalette = settings.palette;
}
/** Persist, project, and notify the theme layer of one settings snapshot. */
export function commitSettings(settings) {
    saveSettings(settings);
    applySettingsToDom(settings);
    window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: settings }));
}
/** Restore persisted settings after the plugin (re)activates. */
export function restoreSettings() {
    applySettingsToDom(readSettings());
}
/** Event name emitted by the settings row when a preference changes. */
export function onSettingsChanged(listener) {
    const handler = (event) => {
        listener(event.detail);
    };
    window.addEventListener(SETTINGS_EVENT, handler);
    return () => { window.removeEventListener(SETTINGS_EVENT, handler); };
}
/** Retract settings attributes when the plugin is disposed. */
export function clearSettingsFromDom() {
    delete document.body.dataset.pixelEnabled;
    delete document.body.dataset.pixelScanline;
    delete document.body.dataset.pixelCursor;
    delete document.body.dataset.pixelVignette;
    delete document.body.dataset.pixelFontMode;
    delete document.body.dataset.pixelPalette;
}
