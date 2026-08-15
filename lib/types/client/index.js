/**
 * DeepSeek Harness pixel skin, browser half.
 *
 * The plugin stacks an alias-token layer on `ctx.theme` (so it rides the
 * active light/dark preference), installs one plugin-owned stylesheet for
 * what tokens cannot express, restores the localStorage skin settings, and
 * registers the Pixel skin controls into the General settings section.
 * Everything the plugin writes is retracted on dispose.
 */
import { PIXEL_TOKENS } from './palette.js';
import { PALETTE_OVERRIDES } from './palettes.js';
import { makeSkinCss } from './skin-style.js';
import { FUSION_PIXEL_LATIN_WOFF2_BASE64, FUSION_PIXEL_PROPORTIONAL_SC_WOFF2_BASE64, FUSION_PIXEL_SC_WOFF2_BASE64, } from './font-data.js';
import { LITERAL_FONT_PATCHES } from './literal-font-patches.js';
import { PIXEL_FAVICON_FILLS, PIXEL_FAVICON_GRID } from './pixel-favicon.js';
import { clearSettingsFromDom, onSettingsChanged, readSettings, restoreSettings, } from './settings.js';
import { en, zh } from './locales.js';
import { PixelSkinSettingsRow } from './settings-row.js';
/** Required services: ui-theme owns the token presenter this skin layers on. */
export const inject = ['theme', 'slots', 'locale'];
/** Stable override-layer identities. */
const OVERRIDE_SOURCE = 'dsh-pixel-skin';
const PALETTE_OVERRIDE_SOURCE = 'dsh-pixel-skin-palette';
const SKIN_ATTRIBUTE = 'data-pixel-skin';
const STYLE_ID = 'dsh-pixel-skin-styles';
const FAVICON_LIGHT_ID = 'dsh-pixel-skin-favicon-light';
const FAVICON_DARK_ID = 'dsh-pixel-skin-favicon-dark';
const SETTINGS_NS = 'settings.pixelSkin';
function installSkinCss() {
    if (document.getElementById(STYLE_ID) !== null)
        return () => { };
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.dataset.plugin = 'dsh-pixel-skin';
    const heroIconUrl = `data:image/svg+xml,${encodeURIComponent(pixelFaviconSvg('#ffffff'))}`;
    style.textContent = makeSkinCss(FUSION_PIXEL_SC_WOFF2_BASE64, FUSION_PIXEL_PROPORTIONAL_SC_WOFF2_BASE64, FUSION_PIXEL_LATIN_WOFF2_BASE64, LITERAL_FONT_PATCHES, heroIconUrl);
    document.head.append(style);
    return () => { style.remove(); };
}
/** Render the generated favicon grid as a crisp-edged SVG data URI. */
function pixelFaviconSvg(fill) {
    const size = PIXEL_FAVICON_GRID.length;
    const rects = [];
    PIXEL_FAVICON_GRID.forEach((row, y) => {
        for (let x = 0; x < row.length; x += 1) {
            if (row[x] !== ' ') {
                rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}"/>`);
            }
        }
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">${rects.join('')}</svg>`;
}
/** Official favicon pixelated by scripts/pixelate-favicon.mjs. */
function installFavicon() {
    if (document.getElementById(FAVICON_LIGHT_ID) !== null)
        return () => { };
    const links = [
        { id: FAVICON_LIGHT_ID, media: '(prefers-color-scheme: light)', fill: PIXEL_FAVICON_FILLS.light },
        { id: FAVICON_DARK_ID, media: '(prefers-color-scheme: dark)', fill: PIXEL_FAVICON_FILLS.dark },
    ];
    for (const spec of links) {
        const link = document.createElement('link');
        link.id = spec.id;
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.media = spec.media;
        link.href = `data:image/svg+xml,${encodeURIComponent(pixelFaviconSvg(spec.fill))}`;
        document.head.append(link);
    }
    return () => {
        for (const spec of links)
            document.getElementById(spec.id)?.remove();
    };
}
/**
 * Mount the pixel skin.
 * @param ctx - client root context carrying the theme service.
 */
export function apply(ctx) {
    ctx.effect(() => {
        let settings = readSettings();
        let enabled = !settings.enabled;
        let disposeTokens = () => { };
        let disposePalette = () => { };
        let disposeFavicon = () => { };
        const applyLayers = () => {
            disposeTokens();
            disposeTokens = ctx.theme.overrideTokens(OVERRIDE_SOURCE, enabled ? PIXEL_TOKENS : {});
            disposePalette();
            disposePalette = ctx.theme.overrideTokens(PALETTE_OVERRIDE_SOURCE, enabled ? PALETTE_OVERRIDES[settings.palette] : {});
        };
        const applyPalette = () => {
            disposePalette();
            disposePalette = ctx.theme.overrideTokens(PALETTE_OVERRIDE_SOURCE, enabled ? PALETTE_OVERRIDES[settings.palette] : {});
        };
        const setEnabled = (next) => {
            if (enabled === next)
                return;
            enabled = next;
            if (enabled) {
                document.body.setAttribute(SKIN_ATTRIBUTE, '');
                disposeFavicon = installFavicon();
                applyLayers();
            }
            else {
                document.body.removeAttribute(SKIN_ATTRIBUTE);
                disposeFavicon();
                disposeFavicon = () => { };
                applyLayers();
            }
        };
        const disposeStyle = installSkinCss();
        setEnabled(settings.enabled);
        restoreSettings();
        const offSettings = onSettingsChanged((next) => {
            settings = next;
            setEnabled(next.enabled);
            applyPalette();
        });
        return () => {
            offSettings();
            disposePalette();
            disposeTokens();
            disposeFavicon();
            disposeStyle();
            document.body.removeAttribute(SKIN_ATTRIBUTE);
            clearSettingsFromDom();
        };
    }, 'dsh-pixel-skin: token layer + palette + stylesheet + settings');
    ctx.effect(() => ctx.locale.register(SETTINGS_NS, { zh, en }), 'dsh-pixel-skin: settings dictionaries');
    ctx.slots.inject('settings.general.item', () => ctx.slots.register({
        name: 'settings.general.item',
        id: 'pixel-skin',
        order: 11,
        locale: SETTINGS_NS,
    }, PixelSkinSettingsRow));
}
