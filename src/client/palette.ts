/** Alias-layer overrides for the pixel skin, one { light, dark } pair per token. */
export type TokenModes = { light: string; dark: string }

function pair(light: string, dark: string): TokenModes {
  return { light, dark }
}

function same(value: string): TokenModes {
  return pair(value, value)
}

/** One readable pixel-font scale step. */
interface FontScaleSpec {
  /** Base token name, e.g. `--dsw-font-s-14`. */
  token: string
  /** Scaled font size in px. */
  size: number
  /** Matching line height in px. */
  lineHeight: number
  weight?: number
  style?: 'normal' | 'italic'
  family?: 'ui' | 'body' | 'code'
}

/** Expand one font-role token into the shorthand plus its individual parts. */
function fontScale(spec: FontScaleSpec): Record<string, TokenModes> {
  const family = spec.family === 'code'
    ? 'var(--pixel-font-code)'
    : spec.family === 'body'
      ? 'var(--pixel-font-body)'
      : 'var(--pixel-font-ui)'
  const weight = spec.weight ?? 400
  const style = spec.style ?? 'normal'
  const prefix = style === 'italic' ? 'italic ' : ''
  const shorthand = `${prefix}${weight} ${spec.size}px/${spec.lineHeight}px ${family}`
  return {
    [spec.token]: same(shorthand),
    [`${spec.token}-font-family`]: same(family),
    [`${spec.token}-font-size`]: same(`${spec.size}px`),
    [`${spec.token}-line-height`]: same(`${spec.lineHeight}px`),
    [`${spec.token}-font-weight`]: same(String(weight)),
    [`${spec.token}-font-style`]: same(style),
  }
}

/**
 * Fusion Pixel is drawn on a 12px grid and reads smaller than the default
 * UI face, so every theme font role gets +2px (code and dense UI) to +4px
 * (headings) with a matching line height.
 */
const FONT_SCALE: readonly FontScaleSpec[] = [
  { token: '--dsw-font-markdown-h1', size: 26, lineHeight: 36, weight: 700 },
  { token: '--dsw-font-markdown-h2', size: 24, lineHeight: 34, weight: 700 },
  { token: '--dsw-font-markdown-h3', size: 22, lineHeight: 32, weight: 700 },
  { token: '--dsw-font-markdown-h4', size: 20, lineHeight: 30, weight: 600 },
  { token: '--dsw-font-markdown-base', size: 20, lineHeight: 32, family: 'body' },
  { token: '--dsw-font-markdown-base-strong', size: 20, lineHeight: 32, weight: 600, family: 'body' },
  { token: '--dsw-font-markdown-base-italic', size: 20, lineHeight: 32, style: 'italic', family: 'body' },
  { token: '--dsw-font-markdown-base-strong-italic', size: 20, lineHeight: 32, weight: 600, style: 'italic', family: 'body' },
  { token: '--dsw-font-markdown-table', size: 18, lineHeight: 29, family: 'body' },
  { token: '--dsw-font-markdown-table-head', size: 18, lineHeight: 29, weight: 500, family: 'body' },
  { token: '--dsw-font-markdown-small', size: 17, lineHeight: 28, family: 'body' },
  { token: '--dsw-font-markdown-small-strong', size: 17, lineHeight: 28, weight: 600, family: 'body' },
  { token: '--dsw-font-markdown-small-italic', size: 17, lineHeight: 28, style: 'italic', family: 'body' },
  { token: '--dsw-font-markdown-small-strong-italic', size: 17, lineHeight: 28, weight: 600, style: 'italic', family: 'body' },
  { token: '--dsw-font-markdown-code', size: 18, lineHeight: 28, family: 'code' },
  { token: '--dsw-font-markdown-code-block', size: 18, lineHeight: 30, family: 'code' },
  { token: '--dsw-font-markdown-code-block-small', size: 16, lineHeight: 24, family: 'code' },
  { token: '--dsw-font-xl-24', size: 26, lineHeight: 36, weight: 600 },
  { token: '--dsw-font-l-20', size: 22, lineHeight: 32, weight: 500 },
  { token: '--dsw-font-m-18', size: 20, lineHeight: 30, weight: 500 },
  { token: '--dsw-font-base-16', size: 19, lineHeight: 28 },
  { token: '--dsw-font-base-strong-16', size: 19, lineHeight: 28, weight: 500 },
  { token: '--dsw-font-s-14', size: 17, lineHeight: 25 },
  { token: '--dsw-font-s-strong-14', size: 17, lineHeight: 25, weight: 500 },
  { token: '--dsw-font-xs-13', size: 16, lineHeight: 24 },
  { token: '--dsw-font-xs-strong-13', size: 16, lineHeight: 24, weight: 500 },
  { token: '--dsw-font-xxs-12', size: 15, lineHeight: 22 },
  { token: '--dsw-font-xxs-strong-12', size: 15, lineHeight: 22, weight: 500 },
  { token: '--dsw-font-xxxs-11', size: 14, lineHeight: 20 },
  { token: '--dsw-font-xxxs-strong-11', size: 14, lineHeight: 20, weight: 500 },
]

const FONT_TOKEN_OVERRIDES: Record<string, TokenModes> = Object.fromEntries(
  FONT_SCALE.flatMap(spec => Object.entries(fontScale(spec))),
)

/** UI chrome stack: fully pixel, proportional advance widths. */
export const PIXEL_FONT_UI = [
  "'Fusion Pixel 12px Proportional SC'",
  "'Fusion Pixel Latin'",
  "'Zpix'",
  "'Press Start 2P'",
  "'PingFang SC'",
  "'Microsoft YaHei'",
  'sans-serif',
].join(', ')

/** Long-form reading stack: pixel Latin, modern CJK fallback for legibility. */
export const PIXEL_FONT_BODY = [
  "'Fusion Pixel Latin'",
  '-apple-system',
  'BlinkMacSystemFont',
  "'PingFang SC'",
  "'Hiragino Sans GB'",
  "'Microsoft YaHei'",
  "'Segoe UI'",
  'sans-serif',
].join(', ')

/** Code and terminal stack: pixel monospaced face, rendered antialiased. */
export const PIXEL_FONT_CODE = [
  "'Fusion Pixel 12px Monospaced SC'",
  "'Fusion Pixel Latin'",
  "'Cascadia Mono'",
  'Menlo',
  'monospace',
].join(', ')

/**
 * Skin palette. `overrideTokens` stacks this layer over whichever built-in
 * light/dark palette is active, so the skin follows the user's preference
 * instead of replacing it.
 */
export const PIXEL_TOKENS: Record<string, TokenModes> = {
  '--dsw-alias-bg-base': pair('#e3ecd8', '#15172a'),
  '--dsw-alias-bg-layer-1': pair('#d4e1ca', '#1e2239'),
  '--dsw-alias-bg-layer-2': pair('#c5d5ba', '#272c4a'),
  '--dsw-alias-bg-layer-3': pair('#b6c9aa', '#313760'),
  '--dsw-alias-bg-mask-1': pair('rgba(31, 42, 32, 0.28)', 'rgba(0, 0, 0, 0.55)'),
  '--dsw-alias-bg-mask-2': pair('rgba(31, 42, 32, 0.14)', 'rgba(0, 0, 0, 0.28)'),
  '--dsw-alias-bg-mask-3': pair('rgba(31, 42, 32, 0.52)', 'rgba(0, 0, 0, 0.62)'),
  '--dsw-alias-bg-mask-photo': pair('rgba(10, 14, 10, 0.88)', 'rgba(0, 0, 0, 0.92)'),
  '--dsw-alias-bg-mask-drop': pair('rgba(235, 244, 225, 0.72)', 'rgba(21, 23, 42, 0.72)'),
  '--dsw-alias-bg-module-platform': pair('#b6c9aa', '#2a2f51'),
  '--dsw-alias-bg-multi-select': pair('#d4e1ca', '#2a2f51'),
  '--dsw-alias-bg-overlay': pair('#eaf2df', '#2a2f51'),
  '--dsw-alias-bg-skeleton': pair('rgba(31, 42, 32, 0.10)', 'rgba(255, 255, 255, 0.09)'),
  '--dsw-alias-border-inverted': pair('rgba(31, 42, 32, 0.08)', 'rgba(255, 255, 255, 0.10)'),
  '--dsw-alias-border-inverted2': pair('rgba(31, 42, 32, 0.12)', 'rgba(255, 255, 255, 0.14)'),
  '--dsw-alias-border-l1': pair('rgba(31, 42, 32, 0.28)', 'rgba(116, 124, 178, 0.28)'),
  '--dsw-alias-border-l2': pair('rgba(31, 42, 32, 0.45)', 'rgba(116, 124, 178, 0.42)'),
  '--dsw-alias-border-l2-darkmode-thin': pair('rgba(31, 42, 32, 0.25)', 'rgba(116, 124, 178, 0.20)'),
  '--dsw-alias-border-l3': pair('rgba(31, 42, 32, 0.60)', 'rgba(116, 124, 178, 0.58)'),
  '--dsw-alias-border-l4': pair('rgba(31, 42, 32, 0.85)', 'rgba(116, 124, 178, 0.85)'),
  '--dsw-alias-brand-primary': pair('#1f2a20', '#ffd166'),
  '--dsw-alias-brand-primary-invert': pair('#f3f8e8', '#15172a'),
  '--dsw-alias-brand-primary-new-colorprimary-new-color': pair('#2f5fb3', '#5ca0ff'),
  '--dsw-alias-brand-text': pair('#1f2a20', '#ffd166'),
  '--dsw-alias-button-contrast-fill': pair('#31433a', '#f4f4f8'),
  '--dsw-alias-button-elevated-fill': pair('#f3f8e8', '#2a2f51'),
  '--dsw-alias-button-floating-fill': pair('#eaf2df', '#1e2239'),
  '--dsw-alias-button-floating-hover': pair('#d4e1ca', '#272c4a'),
  '--dsw-alias-button-ghost-active-border': pair('#4c5b52', '#ffd166'),
  '--dsw-alias-button-ghost-active-fill': pair('#c5d5ba', '#313760'),
  '--dsw-alias-button-ghost-active-hover': pair('#b6c9aa', '#3a416d'),
  '--dsw-alias-button-info-fill': pair('#2f5fb3', '#5ca0ff'),
  '--dsw-alias-button-info-hover': pair('#254d91', '#79b1ff'),
  '--dsw-alias-button-primary-dimmed': pair('#c5d5ba', '#313760'),
  '--dsw-alias-button-primary-fill': pair('#1f2a20', '#ffd166'),
  '--dsw-alias-button-primary-hover': pair('#31433a', '#ffd97e'),
  '--dsw-alias-button-tool-bar-fill': pair('rgba(31, 42, 32, 0.16)', 'rgba(255, 255, 255, 0.10)'),
  '--dsw-alias-button-tool-bar-fill-invisible': pair('rgba(31, 42, 32, 0.08)', 'rgba(255, 255, 255, 0.05)'),
  '--dsw-alias-button-tool-bar-hover': pair('rgba(31, 42, 32, 0.26)', 'rgba(255, 255, 255, 0.16)'),
  '--dsw-alias-interactive-bg-active': pair('rgba(31, 42, 32, 0.16)', 'rgba(255, 255, 255, 0.16)'),
  '--dsw-alias-interactive-bg-hover': pair('rgba(31, 42, 32, 0.08)', 'rgba(255, 255, 255, 0.09)'),
  '--dsw-alias-interactive-bg-hover-accent': pair('rgba(47, 95, 179, 0.14)', 'rgba(92, 160, 255, 0.16)'),
  '--dsw-alias-interactive-bg-hover-danger': pair('rgba(194, 59, 59, 0.10)', 'rgba(255, 107, 107, 0.16)'),
  '--dsw-alias-interactive-bg-hover-solid': pair('#d4e1ca', '#272c4a'),
  '--dsw-alias-label-caption': pair('#72846e', '#7c7fa8'),
  '--dsw-alias-label-dimmed': pair('#aebe9f', '#5d6094'),
  '--dsw-alias-label-primary': pair('#1f2a20', '#f4f4f8'),
  '--dsw-alias-label-primary-bluish': pair('#2f5fb3', '#5ca0ff'),
  '--dsw-alias-label-primary-dimmed': pair('#31433a', '#c9c9e6'),
  '--dsw-alias-label-primary-foreground': pair('#f3f8e8', '#15172a'),
  '--dsw-alias-label-primary-inverted': pair('#f3f8e8', '#15172a'),
  '--dsw-alias-label-secondary': pair('#3f5240', '#b9b9d6'),
  '--dsw-alias-label-tertiary': pair('#5b7057', '#8e8faf'),
  '--dsw-alias-markdown-citation': pair('#d4e1ca', '#313760'),
  '--dsw-alias-markdown-code-block': pair('#eaf2df', '#101222'),
  '--dsw-alias-markdown-code-block-banner': pair('#d4e1ca', '#1a1d33'),
  '--dsw-alias-markdown-code-segment-selected': pair('#f3f8e8', '#272c4a'),
  '--dsw-alias-markdown-code-segment-unselected': pair('#d4e1ca', '#1a1d33'),
  '--dsw-alias-markdown-inline-code': pair('#c5d5ba', '#272c4a'),
  '--dsw-alias-markdown-placeholder': pair('#c5d5ba', '#272c4a'),
  '--dsw-alias-markdown-tag': pair('#d4e1ca', '#313760'),
  '--dsw-alias-scrollbar-bg-l1': pair('#7f9478', '#3f4674'),
  '--dsw-alias-scrollbar-bg-l2': pair('#9fb392', '#565f93'),
  '--dsw-alias-scrollbar-hover-l1': pair('#5b7057', '#747daf'),
  '--dsw-alias-scrollbar-hover-l2': pair('#7f9478', '#8b93c4'),
  '--dsw-alias-state-business-primary': pair('#1f6f43', '#5ce08a'),
  '--dsw-alias-state-business-tertiary': pair('#d4e1ca', '#272c4a'),
  '--dsw-alias-state-error-primary': pair('#c23b3b', '#ff6b6b'),
  '--dsw-alias-state-error-secondary': pair('#d95c5c', '#ff8f8f'),
  '--dsw-alias-state-success-primary': pair('#2e7d4f', '#52d273'),
  '--dsw-alias-state-success-secondary': pair('#3f9d65', '#7de29a'),
  '--dsw-alias-state-success-tertiary': pair('#c5d5ba', '#1e3d2b'),
  '--dsw-alias-state-warn-label': pair('#8a5d00', '#ffc145'),
  '--dsw-alias-state-warn-primary': pair('#b07c12', '#ffc145'),
  '--dsw-alias-state-warn-secondary': pair('#d09a22', '#ffd166'),
  '--dsw-alias-state-warn-tertiary': pair('#e5d8ac', '#3d321d'),
  '--dsw-alias-toast-bg': pair('#31433a', '#2a2f51'),
  '--dsw-alias-tooltip-bg': pair('#1f2a20', '#313760'),
  '--dsw-specific-bubble': pair('#d4e1ca', '#1e2239'),
  '--dsw-specific-bubble-highlight': pair('#eaf2df', '#272c4a'),
  '--dsw-specific-input-major': pair('#f3f8e8', '#101222'),
  '--dsw-specific-login-input': pair('#eaf2df', '#15172a'),
  '--dsw-specific-menu': pair('#b6c9aa', '#272c4a'),
  '--dsw-specific-selector': pair('#c5d5ba', '#313760'),
  '--dsw-specific-sidebar-fill': pair('#aebe9f', '#101222'),
  '--dsw-specific-sidebar-nav-item-active': pair('#b6c9aa', '#313760'),
  '--dsw-specific-sidebar-nav-item-active-accent': pair('#eaf2df', '#ffd166'),
  '--dsw-specific-sidebar-nav-item-hover': pair('#c5d5ba', '#272c4a'),
  '--dsw-specific-tip': pair('#d4e1ca', '#1a1d33'),
  ...FONT_TOKEN_OVERRIDES,
  '--dsw-font-family': pair(PIXEL_FONT_UI, PIXEL_FONT_UI),
  '--ds-font-family-code': pair(PIXEL_FONT_CODE, PIXEL_FONT_CODE),
  '--dsw-shadow-lv1': pair('0 2px 0 rgba(31, 42, 32, 0.18)', '0 2px 0 rgba(0, 0, 0, 0.45)'),
  '--dsw-shadow-lv1-blur': pair('0 4px 0 rgba(31, 42, 32, 0.10)', '0 4px 0 rgba(0, 0, 0, 0.35)'),
  '--dsw-shadow-lv2': pair('0 2px 0 rgba(31, 42, 32, 0.18), 0 0 0 1px rgba(31, 42, 32, 0.12)', '0 2px 0 rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(116, 124, 178, 0.35)'),
  '--dsw-shadow-lv3': pair('0 4px 0 rgba(31, 42, 32, 0.22), 0 0 0 1px rgba(31, 42, 32, 0.18)', '0 4px 0 rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(116, 124, 178, 0.45)'),
  '--dsw-linear-gradient-think': pair('linear-gradient(180deg, rgba(227, 236, 216, 0.95), rgba(227, 236, 216, 0))', 'linear-gradient(180deg, rgba(21, 23, 42, 0.95), rgba(21, 23, 42, 0))'),
  '--dsw-linear-think-select': pair('linear-gradient(180deg, rgba(213, 225, 203, 0.95), rgba(213, 225, 203, 0))', 'linear-gradient(180deg, rgba(30, 34, 57, 0.95), rgba(30, 34, 57, 0))'),
  '--dsw-mask-blur': pair('none', 'none'),
}
