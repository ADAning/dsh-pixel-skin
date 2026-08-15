/** Theme service edge consumed from the ui-theme plugin. */
interface PixelSkinTheme {
    overrideTokens(source: string, tokens: Record<string, {
        light: string;
        dark: string;
    }>): () => void;
}
interface PixelSkinSlots {
    inject(name: string, factory: () => unknown): void;
    register(options: Record<string, unknown>, component: unknown): unknown;
}
interface PixelSkinLocale {
    register(namespace: string, dictionaries: Record<string, unknown>): () => void;
}
/** Minimal Cordis context shape this plugin needs. */
interface PixelSkinContext {
    theme: PixelSkinTheme;
    slots: PixelSkinSlots;
    locale: PixelSkinLocale;
    effect(effect: () => () => void, label?: string): void;
}
/** Required services: ui-theme owns the token presenter this skin layers on. */
export declare const inject: string[];
/**
 * Mount the pixel skin.
 * @param ctx - client root context carrying the theme service.
 */
export declare function apply(ctx: PixelSkinContext): void;
export {};
