/** Alias-layer overrides for the pixel skin, one { light, dark } pair per token. */
export type TokenModes = {
    light: string;
    dark: string;
};
/** UI chrome stack: fully pixel, proportional advance widths. */
export declare const PIXEL_FONT_UI: string;
/** Long-form reading stack: pixel Latin, modern CJK fallback for legibility. */
export declare const PIXEL_FONT_BODY: string;
/** Code and terminal stack: pixel monospaced face, rendered antialiased. */
export declare const PIXEL_FONT_CODE: string;
/**
 * Skin palette. `overrideTokens` stacks this layer over whichever built-in
 * light/dark palette is active, so the skin follows the user's preference
 * instead of replacing it.
 */
export declare const PIXEL_TOKENS: Record<string, TokenModes>;
