import type {
  FUSION_PIXEL_LATIN_WOFF2_BASE64,
  FUSION_PIXEL_PROPORTIONAL_SC_WOFF2_BASE64,
  FUSION_PIXEL_SC_WOFF2_BASE64,
} from './font-data.js'
import { LITERAL_FONT_PATCHES } from './literal-font-patches.js'
import { PIXEL_DETAILS_CSS } from './pixel-details.js'
import { STRUCTURAL_PATCHES } from './structural-patches.js'

/**
 * Global pixel-skin stylesheet. The theme layer owns colors through the
 * `--dsw-*` token overrides; this sheet owns what tokens cannot say:
 * embedded bitmap fonts, the hybrid readable font stacks, square corners,
 * pixelated raster content, hard focus, the CRT scanline overlay, and the
 * generated exact-selector font-size patch layer.
 */
export function makeSkinCss(
  monoBase64: typeof FUSION_PIXEL_SC_WOFF2_BASE64,
  proportionalBase64: typeof FUSION_PIXEL_PROPORTIONAL_SC_WOFF2_BASE64,
  latinBase64: typeof FUSION_PIXEL_LATIN_WOFF2_BASE64,
  literalPatches: typeof LITERAL_FONT_PATCHES,
  heroIconUrl: string,
): string {
  return `
@font-face {
  font-family: 'Fusion Pixel 12px Monospaced SC';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,${monoBase64}) format('woff2');
}

@font-face {
  font-family: 'Fusion Pixel 12px Proportional SC';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,${proportionalBase64}) format('woff2');
}

@font-face {
  font-family: 'Fusion Pixel Latin';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(data:font/woff2;base64,${latinBase64}) format('woff2');
}

:root {
  /* Short chrome copy stays fully pixel (Latin + CJK). */
  --pixel-font-ui: 'Fusion Pixel 12px Proportional SC', 'Fusion Pixel Latin',
    'Zpix', 'Press Start 2P', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  /* Long-form copy: pixel Latin, modern CJK fallback for readability. */
  --pixel-font-body: 'Fusion Pixel Latin', -apple-system, BlinkMacSystemFont,
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Segoe UI',
    sans-serif;
  /* Code and terminals use the pixel monospaced face, rendered antialiased. */
  --pixel-font-code: 'Fusion Pixel 12px Monospaced SC', 'Fusion Pixel Latin',
    'Cascadia Mono', Menlo, monospace;
  --pixel-scanline-alpha: 0;
  --pixel-selection-bg: #1f2a20;
  --pixel-selection-fg: #eaf2df;
  --pixel-meter-fill: #b07c12;
  --pixel-cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' shape-rendering='crispEdges'><path fill='%23f4f4f8' stroke='%2315172a' d='M3 2h8l-2 3 5 5-3 3-5-5-3 2z'/></svg>") 2 2, pointer;
}

body[data-ds-dark-theme] {
  --pixel-selection-bg: #ffd166;
  --pixel-selection-fg: #15172a;
  --pixel-meter-fill: #ffc145;
}

body[data-pixel-skin] {
  image-rendering: pixelated;
  font-synthesis: none;
  transition: background-color 140ms steps(2, end), color 140ms steps(2, end);
}

body[data-pixel-skin][data-pixel-scanline='light'] {
  --pixel-scanline-alpha: 0.025;
}

body[data-pixel-skin][data-pixel-scanline='standard'] {
  --pixel-scanline-alpha: 0.045;
}

body[data-pixel-skin][data-ds-dark-theme][data-pixel-scanline='light'] {
  --pixel-scanline-alpha: 0.05;
}

body[data-pixel-skin][data-ds-dark-theme][data-pixel-scanline='standard'] {
  --pixel-scanline-alpha: 0.085;
}

body[data-pixel-skin][data-pixel-palette='cyberpunk'][data-ds-dark-theme][data-pixel-scanline='standard'] {
  --pixel-scanline-alpha: 0.065;
}

body[data-pixel-skin][data-pixel-palette='sunset'][data-ds-dark-theme][data-pixel-scanline='standard'] {
  --pixel-scanline-alpha: 0.075;
}

body[data-pixel-skin][data-pixel-palette='mono'][data-ds-dark-theme][data-pixel-scanline='standard'] {
  --pixel-scanline-alpha: 0.055;
}

body[data-pixel-skin][data-pixel-font-mode='pure'] {
  --pixel-font-body: var(--pixel-font-ui);
}

body[data-pixel-skin][data-pixel-palette='cyberpunk'] {
  --pixel-meter-fill: #c211a8;
}

body[data-pixel-skin][data-pixel-palette='cyberpunk'][data-ds-dark-theme] {
  --pixel-meter-fill: #00f0ff;
}

body[data-pixel-skin][data-pixel-palette='sunset'] {
  --pixel-meter-fill: #d81b60;
}

body[data-pixel-skin][data-pixel-palette='sunset'][data-ds-dark-theme] {
  --pixel-meter-fill: #ff5fa2;
}

body[data-pixel-skin][data-pixel-palette='mono'] {
  --pixel-meter-fill: #e69500;
}

body[data-pixel-skin][data-pixel-palette='mono'][data-ds-dark-theme] {
  --pixel-meter-fill: #ffd166;
}

body[data-pixel-skin][data-pixel-cursor='on'] :is(
  button,
  a,
  [role='button'],
  select,
  [class*='sessionRow' i],
  [class*='tab' i]:not([class*='table' i])
) {
  cursor: var(--pixel-cursor) !important;
}

/* Subtle CRT vignette; below scanlines, never intercepts pointer events. */
body[data-pixel-skin][data-pixel-vignette='on']::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 2147483645;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 52%, rgba(0, 0, 0, 0.12) 100%);
}

body[data-pixel-skin][data-ds-dark-theme][data-pixel-vignette='on']::before {
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.2) 100%);
}

/* Pixel-font surfaces keep antialiasing so the bitmap-style outlines stay
   readable instead of rendering as harsh raw pixels. */
body[data-pixel-skin] :is(
  button,
  input,
  select,
  [role='button'],
  [class*='button' i],
  [class*='menu' i],
  [class*='badge' i],
  code,
  pre,
  kbd
) {
  -webkit-font-smoothing: antialiased;
  font-smooth: auto;
  text-rendering: optimizeLegibility;
}

body[data-pixel-skin] :is(button, input, select, [role='button'], [class*='button' i]) {
  font-family: var(--pixel-font-ui) !important;
}

/* Readability-first labels: keep the pixel Latin, let CJK fall back to the
   modern body stack, and disable the synthetic bold that pixel fonts fake. */
body[data-pixel-skin] :is(
  [class*='newSession' i],
  [class*='workspaceLabel' i],
  [class*='sessionRow' i] [class*='title' i],
  [class*='sessionRow' i] [class*='summary' i],
  [class*='projectRow' i] [class*='title' i],
  [class*='projectRow' i] [class*='summary' i]
) {
  font-family: var(--pixel-font-body) !important;
  font-weight: 400 !important;
  -webkit-font-smoothing: antialiased;
  font-smooth: auto;
}

/* Think rides the shared DisclosureRow chrome. In the web bundle that
   primitive's CSS-module class is Vite-scoped as _[local]_[hash], so the
   lightningcss-generated literal patch for its title does not match. The
   summary is already patched through ReasoningRow's own class; this
   attribute-scoped rule keeps the collapsed Think title on the same 17/27
   step as the Bash keyed row (and the summary explicitly, so the pair cannot
   drift if the generated hash ever changes). */
body[data-pixel-skin] [data-variant='think'] [data-disclosure-row] > :is([class*='title'], [class*='summary']) {
  font-size: 17px !important;
  line-height: 27px !important;
}

/* Composer layers share exact font metrics. The textarea, mirror, and
   backdrop all participate in caret geometry; any divergence reads as a
   caret/text offset, especially with the skin's pixel font. */
body[data-pixel-skin] :is(.${STRUCTURAL_PATCHES.inputBar.input}, .${STRUCTURAL_PATCHES.inputBar.mirror}, .${STRUCTURAL_PATCHES.inputBar.backdrop}) {
  font-family: 'DshChipCell', var(--pixel-font-ui) !important;
  font-size: 19px !important;
  line-height: 27px !important;
  letter-spacing: 0 !important;
}

/* New-session hero: replace the smooth FishLogo with the same pixel whale as
   the favicon. Mask + background-color keeps it in the theme text ink. */
body[data-pixel-skin] [class*='fishHitbox'] svg {
  display: none !important;
}

body[data-pixel-skin] [class*='fishHitbox'] {
  width: 34px;
  height: 25px;
  background-color: var(--dsw-alias-label-primary);
  -webkit-mask: url("${heroIconUrl}") center / 32px 24px no-repeat;
  mask: url("${heroIconUrl}") center / 32px 24px no-repeat;
}

body[data-pixel-skin] .${STRUCTURAL_PATCHES.inputBar.input} {
  caret-color: var(--pixel-meter-fill, var(--dsw-alias-state-warn-primary));
}

body[data-pixel-skin] .${STRUCTURAL_PATCHES.inputBar.primary}:disabled {
  opacity: 0.55;
  filter: saturate(0.6);
  cursor: not-allowed;
}

body[data-pixel-skin] .${STRUCTURAL_PATCHES.inputBar.primary}:not(:disabled):active {
  transform: translate(1px, 1px);
  filter: brightness(0.92);
}

/* Long-form component copy (descriptions, summaries, markdown, hints) uses
   the hybrid body stack: pixel Latin over modern CJK. */
body[data-pixel-skin] :is(
  [class*='desc' i],
  [class*='description' i],
  [class*='intro' i],
  [class*='summary' i],
  [class*='body' i],
  [class*='markdown' i],
  [class*='hint' i],
  [class*='notice' i],
  [class*='empty' i]
) {
  font-family: var(--pixel-font-body) !important;
  letter-spacing: 0.01em;
}

body[data-pixel-skin] :is(code, pre, kbd, textarea[class*='code' i], [class*='codeBlock' i]) {
  font-family: var(--pixel-font-code) !important;
}

/* Tool-row terminal cards rebind --dsl-terminal-line-height to the original
   18px. The skin's small-code token is 16/24, so pin the terminal row rhythm
   to that same 24px line: prompt, output, status pill and copy button then
   share one line box. */
body[data-pixel-skin] [data-terminal] {
  --dsl-terminal-line-height: 24px;
}

body[data-pixel-skin] :is(code, pre, kbd, [class*='codeBlock' i]) {
  -webkit-font-smoothing: antialiased;
  font-smooth: auto;
  text-rendering: optimizeLegibility;
}

/* Fenced code gets the largest monospaced step; inline code stays slightly
   smaller so prose rhythm survives. */
body[data-pixel-skin] :is(pre, [class*='codeBlock' i]) {
  font-size: 18px !important;
  line-height: 30px !important;
}

body[data-pixel-skin] :is(code, kbd, [class*='inlineCode' i]) {
  font-size: 17px !important;
  line-height: 26px !important;
}

/* Inline markdown code keeps the pixel monospaced face, but stays antialiased
   and slightly smaller so it reads as prose rather than terminal chrome. */
body[data-pixel-skin] [class*='markdown' i] :not(pre) > code {
  font-family: var(--pixel-font-code) !important;
  font-size: 0.9em !important;
  -webkit-font-smoothing: antialiased;
  font-smooth: auto;
}

body[data-pixel-skin] img,
body[data-pixel-skin] canvas,
body[data-pixel-skin] video {
  image-rendering: pixelated;
}

/* Hard-edged controls: the base design is rounded, the skin is chunky. */
body[data-pixel-skin] :is(
  button,
  input,
  textarea,
  select,
  [role='button'],
  [class*='button' i],
  [class*='input' i],
  [class*='menu' i],
  [class*='dialog' i],
  [class*='popover' i],
  [class*='toast' i],
  [class*='tooltip' i],
  [class*='card' i],
  [class*='panel' i],
  [class*='bubble' i],
  [class*='cube' i]
) {
  border-radius: 0 !important;
}

body[data-pixel-skin] :is(button, [role='button'], [class*='button' i]):not(:disabled):active {
  transform: translate(1px, 1px);
}

body[data-pixel-skin] :focus-visible {
  outline: 2px solid var(--dsw-alias-state-business-primary);
  outline-offset: 2px;
}

/* The conversation view tab strip already signals selection with its
   underline; the rectangular focus ring reads as a stray frame there. */
body[data-pixel-skin] :is([class*='tabs'] :focus-visible, [role='tab']:focus-visible) {
  outline: none !important;
  box-shadow: none !important;
}

/* Composer textareas are borderless by design; the skin focus ring reads as
   a frame around the user input. Original caret/border feedback remains. */
body[data-pixel-skin] :is(textarea:focus-visible, [class*='input' i]:focus-visible) {
  outline: none !important;
}

body[data-pixel-skin] ::selection {
  background: var(--pixel-selection-bg);
  color: var(--pixel-selection-fg);
}

/* Chunky scrollbars: l1 on the base surface, l2 on elevated surfaces. */
body[data-pixel-skin] {
  scrollbar-width: thin;
  scrollbar-color: var(--dsw-alias-scrollbar-bg-l1) transparent;
}

body[data-pixel-skin] ::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

body[data-pixel-skin] ::-webkit-scrollbar-track {
  background: transparent;
}

body[data-pixel-skin] ::-webkit-scrollbar-thumb {
  background: var(--dsw-alias-scrollbar-bg-l1);
  border: 2px solid var(--dsw-alias-bg-base);
}

body[data-pixel-skin] ::-webkit-scrollbar-thumb:hover {
  background: var(--dsw-alias-scrollbar-hover-l1);
}

/* Generated exact-selector patch: every component rule that still hard-codes
   a 10-16px font gets a readability bump. Selectors are hash-scoped to the
   repository's current CSS-Module output, so there is no local-name guessing. */
${literalPatches}

/* Phase 2 pixel details: bevels, window frames, dither, stepped motion. */
${PIXEL_DETAILS_CSS}

/* Subtle CRT scanlines. Static, pointer-transparent, and disabled when the
   OS asks for reduced motion so screenshots and animations stay clean. */
body[data-pixel-skin]::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, var(--pixel-scanline-alpha)) 0,
    rgba(0, 0, 0, var(--pixel-scanline-alpha)) 1px,
    transparent 1px,
    transparent 3px
  );
}

@media (prefers-reduced-motion: reduce) {
  body[data-pixel-skin] {
    transition: none;
  }

  body[data-pixel-skin]::after {
    display: none;
  }

  body[data-pixel-skin] :is(button, [role='button'], [class*='button' i]):not(:disabled):active {
    transform: none;
  }
}
`
}
