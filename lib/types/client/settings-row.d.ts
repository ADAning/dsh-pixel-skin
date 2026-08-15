import type { PixelSkinSettingsKey } from './locales.js';
interface PixelSkinSettingsRowProps {
    t?: (key: PixelSkinSettingsKey, values?: Record<string, string | number>) => string;
}
/** Settings row component. */
export declare function PixelSkinSettingsRow({ t }: PixelSkinSettingsRowProps): unknown;
export {};
