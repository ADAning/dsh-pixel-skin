/**
 * Pixel-skin settings row rendered inside the General settings section.
 * It owns only the skin's localStorage preferences; writing a control applies
 * the body attributes immediately and persists for the next boot.
 */
import * as React from 'react';
import { commitSettings, DEFAULT_SETTINGS, readSettings, } from './settings.js';
import { PALETTE_SWATCHES } from './palettes.js';
import css from './settings-row.module.css';
function label(t, key, fallback) {
    return t?.(key) ?? fallback;
}
function optionClass(selected) {
    return selected ? `${css.option} ${css.selected}` : css.option;
}
function choice(current, value, text, onSelect) {
    return React.createElement('button', {
        key: String(value),
        type: 'button',
        className: optionClass(current === value),
        'aria-pressed': current === value,
        onClick: () => { onSelect(value); },
    }, text);
}
function booleanChoice(current, value, text, onSelect) {
    return React.createElement('button', {
        key: String(value),
        type: 'button',
        className: optionClass(current === value),
        'aria-pressed': current === value,
        onClick: onSelect,
    }, text);
}
/** Settings row component. */
export function PixelSkinSettingsRow({ t }) {
    const [settings, setSettings] = React.useState(readSettings());
    const update = (patch) => {
        const next = { ...settings, ...patch };
        commitSettings(next);
        setSettings(next);
    };
    return React.createElement('div', { className: css.group }, React.createElement('div', { className: css.title }, label(t, 'settings.pixelSkin.title', '像素皮肤')), React.createElement('div', { className: css.control }, React.createElement('div', { className: css.label }, label(t, 'settings.pixelSkin.enabled', '启用像素皮肤')), React.createElement('div', { className: css.options }, booleanChoice(settings.enabled, true, label(t, 'settings.pixelSkin.on', '开'), () => { update({ enabled: true }); }), booleanChoice(settings.enabled, false, label(t, 'settings.pixelSkin.off', '关'), () => { update({ enabled: false }); }))), React.createElement('button', {
        type: 'button',
        className: css.reset,
        onClick: () => { update({ ...DEFAULT_SETTINGS }); },
    }, label(t, 'settings.pixelSkin.reset', '恢复默认')), React.createElement('div', { className: css.control }, React.createElement('div', { className: css.label }, label(t, 'settings.pixelSkin.palette', '配色')), React.createElement('div', { className: css.swatches }, PALETTE_SWATCHES.map(item => React.createElement('button', {
        key: item.id,
        type: 'button',
        title: label(t, item.labelKey, item.label),
        className: settings.palette === item.id ? `${css.swatch} ${css.swatchSelected}` : css.swatch,
        'aria-pressed': settings.palette === item.id,
        onClick: () => { update({ palette: item.id }); },
    }, React.createElement('span', { className: css.swatchColors }, item.colors.map(color => React.createElement('span', {
        key: color,
        className: css.swatchDot,
        style: { backgroundColor: color },
    }))), React.createElement('span', { className: css.swatchName }, label(t, item.labelKey, item.label)))))), React.createElement('div', { className: css.control }, React.createElement('div', { className: css.label }, label(t, 'settings.pixelSkin.scanline', '扫描线')), React.createElement('div', { className: css.options }, choice(settings.scanline, 'off', label(t, 'settings.pixelSkin.scanline.off', '关'), value => { update({ scanline: value }); }), choice(settings.scanline, 'light', label(t, 'settings.pixelSkin.scanline.light', '轻'), value => { update({ scanline: value }); }), choice(settings.scanline, 'standard', label(t, 'settings.pixelSkin.scanline.standard', '标准'), value => { update({ scanline: value }); }))), React.createElement('div', { className: css.control }, React.createElement('div', { className: css.label }, label(t, 'settings.pixelSkin.cursor', '像素光标')), React.createElement('div', { className: css.options }, booleanChoice(settings.cursor, true, label(t, 'settings.pixelSkin.on', '开'), () => { update({ cursor: true }); }), booleanChoice(settings.cursor, false, label(t, 'settings.pixelSkin.off', '关'), () => { update({ cursor: false }); }))), React.createElement('div', { className: css.control }, React.createElement('div', { className: css.label }, label(t, 'settings.pixelSkin.vignette', 'CRT 暗角')), React.createElement('div', { className: css.options }, booleanChoice(settings.vignette, true, label(t, 'settings.pixelSkin.on', '开'), () => { update({ vignette: true }); }), booleanChoice(settings.vignette, false, label(t, 'settings.pixelSkin.off', '关'), () => { update({ vignette: false }); }))), React.createElement('div', { className: css.control }, React.createElement('div', { className: css.label }, label(t, 'settings.pixelSkin.font', '字体模式')), React.createElement('div', { className: css.options }, choice(settings.fontMode, 'hybrid', label(t, 'settings.pixelSkin.font.hybrid', '混合易读'), value => { update({ fontMode: value }); }), choice(settings.fontMode, 'pure', label(t, 'settings.pixelSkin.font.pure', '纯像素'), value => { update({ fontMode: value }); }))));
}
