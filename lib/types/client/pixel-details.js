/**
 * Phase 2 detail layer. Colors still come from the theme tokens; this sheet
 * adds the 8-bit material treatment on top of the existing component
 * geometry: bevels, hard window shadows, pixel grooves, and stepped motion.
 * Selectors use the CSS-Module local-name suffix (`[hash]_[local]`), which
 * the repository's lightningcss pattern guarantees.
 */
import { STRUCTURAL_PATCHES } from './structural-patches.js';
export const PIXEL_DETAILS_CSS = `
/* Bevel colors derive from the active palette, so light/dark both stay in key. */
body[data-pixel-skin] {
  --pixel-edge-hi: color-mix(in srgb, var(--dsw-alias-bg-layer-1), white 30%);
  --pixel-edge-lo: color-mix(in srgb, var(--dsw-alias-bg-base), black 36%);
  --pixel-ink: var(--dsw-alias-border-l4);
}

body[data-pixel-skin][data-ds-dark-theme] {
  --pixel-edge-hi: color-mix(in srgb, var(--dsw-alias-bg-layer-1), white 14%);
  --pixel-edge-lo: color-mix(in srgb, var(--dsw-alias-bg-base), black 55%);
}

/* Buttons keep their original chrome; only the square corners and the
   active-state 1px press offset from the base skin remain. */

/* Inputs keep their original chrome. The composer textarea is borderless and
   outline-less by design; any skin border here reads as a stray frame. */

/* Windowed surfaces keep the original chrome; only the menu hover accent
   gets the pixel treatment. */
body[data-pixel-skin] [class*='itemWrap' i]:hover {
  box-shadow: inset 2px 0 0 var(--dsw-alias-state-business-primary);
}

/* Sidebar column: hard rail edge, pixel session rows. */
body[data-pixel-skin] [class*='sidebarCol' i] {
  border-right: 2px solid var(--pixel-ink) !important;
}

body[data-pixel-skin] [class*='sessionRow' i],
body[data-pixel-skin] [class*='projectRow' i] {
  border: 1px solid transparent;
  border-left: 3px solid transparent;
}

body[data-pixel-skin] :is([class*='sessionRow' i], [class*='projectRow' i]):hover {
  border-color: var(--dsw-alias-border-l3);
  border-left-color: var(--dsw-alias-state-business-primary);
}

body[data-pixel-skin] :is([class*='sessionRow' i], [class*='projectRow' i])[class*='selected' i] {
  border-color: var(--dsw-alias-state-business-primary);
  border-left-color: var(--dsw-alias-state-business-primary);
  box-shadow: inset 2px 2px 0 var(--pixel-edge-hi), inset -2px -2px 0 var(--pixel-edge-lo);
}

/* Session rows keep the original folder/status-dot geometry; no extra markers. */

/* Markdown reading surface: hard, low-noise 8-bit document details. */
body[data-pixel-skin] [class*='markdown' i] blockquote {
  border-left: 4px solid var(--pixel-ink) !important;
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1), transparent 30%) !important;
  padding: 8px 12px !important;
}

body[data-pixel-skin] [class*='markdown' i] hr {
  border: none !important;
  height: 2px !important;
  background-image: repeating-linear-gradient(
    90deg,
    var(--pixel-ink) 0,
    var(--pixel-ink) 6px,
    transparent 6px,
    transparent 10px
  ) !important;
}

body[data-pixel-skin] [class*='markdown' i] a:hover,
body[data-pixel-skin] [class*='markdown' i] a:focus {
  text-decoration-thickness: 2px;
  text-underline-offset: 3px;
}

body[data-pixel-skin] [class*='markdown' i] input[type='checkbox'] {
  appearance: none;
  width: 14px;
  height: 14px;
  margin: 0 8px 0 0;
  vertical-align: -2px;
  border: 2px solid var(--pixel-ink);
  background: var(--dsw-alias-bg-layer-1);
}

body[data-pixel-skin] [class*='markdown' i] input[type='checkbox']:checked {
  background: var(--dsw-alias-state-business-primary);
  box-shadow: inset 0 0 0 3px var(--dsw-alias-bg-layer-1);
}

body[data-pixel-skin] [class*='tableScroll' i] table {
  border-collapse: collapse !important;
  border: 2px solid var(--pixel-ink) !important;
}

body[data-pixel-skin] [class*='tableScroll' i] :is(th, td) {
  border: 1px solid var(--pixel-ink) !important;
}

body[data-pixel-skin] [class*='tableScroll' i] th {
  background: var(--dsw-alias-bg-layer-2) !important;
}

/* Context-occupancy ring: larger hit area, larger dial, lighter dashed track
   and a bright but not heavy progress arc. */
body[data-pixel-skin] .${STRUCTURAL_PATCHES.contextMeter.trigger} {
  width: 32px;
  height: 32px;
}

body[data-pixel-skin] .${STRUCTURAL_PATCHES.contextMeter.trigger} svg {
  width: 18px;
  height: 18px;
}

body[data-pixel-skin] .${STRUCTURAL_PATCHES.contextMeter.track} {
  stroke: var(--dsw-alias-border-l2);
  stroke-width: 2;
}

body[data-pixel-skin] .${STRUCTURAL_PATCHES.contextMeter.fill} {
  stroke: var(--pixel-meter-fill, var(--dsw-alias-state-warn-primary));
  stroke-width: 3;
}

body[data-pixel-skin] .${STRUCTURAL_PATCHES.contextMeter.trigger}::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 3px;
  height: 3px;
  transform: translate(-50%, -50%);
  background: var(--pixel-meter-fill, var(--dsw-alias-state-warn-primary));
}

/* Running rows get the same stepped scan bar. Generic tool rows carry
   [data-tool] with the sweep on an inner row; Think sweeps its inner
   DisclosureRow; the keyed Bash row sweeps its own root ::after. */
body[data-pixel-skin] [data-tool][data-state='running'] [class*='row']::after,
body[data-pixel-skin] [data-variant='think'][data-state='running'] [class*='row']::after,
body[data-pixel-skin] [data-variant='bash'][data-state='running']::after,
body[data-pixel-skin] [data-variant='others'][data-state='running'] [class*='row']::after {
  background: repeating-linear-gradient(
    90deg,
    var(--pixel-meter-fill, var(--dsw-alias-state-warn-primary)) 0,
    var(--pixel-meter-fill, var(--dsw-alias-state-warn-primary)) 6px,
    transparent 6px,
    transparent 12px
  ) !important;
  animation: dsh-pixel-skeleton-blink 1s steps(2, end) infinite;
}

body[data-pixel-skin] [data-tool][data-state='success'] [class*='row'] {
  box-shadow: inset 3px 0 0 var(--dsw-alias-state-success-primary);
}

body[data-pixel-skin] [data-tool][data-state='error'] [class*='row'] {
  box-shadow: inset 3px 0 0 var(--dsw-alias-state-error-primary);
}

/* Conversation stats line: widen it and tighten separators so cache-hit and
   token figures survive the larger skin type instead of ellipsizing. */
body[data-pixel-skin] .${STRUCTURAL_PATCHES.statsLine.root} {
  max-width: min(calc(var(--dsh-chat-content-width, 748px) + 180px), calc(100vw - 40px)) !important;
  font-size: 14px !important;
  line-height: 22px !important;
}

body[data-pixel-skin] .${STRUCTURAL_PATCHES.statsLine.sep} {
  margin: 0 6px !important;
}

/* Chat and tooltip bubbles: outlined, hard-shadowed blocks. */
body[data-pixel-skin] [class*='bubble' i] {
  border: 2px solid var(--pixel-ink) !important;
  box-shadow: 3px 3px 0 var(--pixel-edge-lo) !important;
}

/* Message bubbles get one small pixel corner badge; tooltips (which carry
   data-side) keep their original corner geometry. */
body[data-pixel-skin] [class*='bubble' i]:not([data-side])::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  width: 6px;
  height: 6px;
  background: var(--pixel-meter-fill, var(--dsw-alias-state-warn-primary));
}

/* Dialog corner brackets: pixel corners without a full window frame. */
body[data-pixel-skin] [class*='dialog' i] {
  position: relative;
}

body[data-pixel-skin] [class*='dialog' i]::before {
  content: '';
  position: absolute;
  left: -2px;
  top: -2px;
  width: 7px;
  height: 7px;
  border-top: 2px solid var(--pixel-ink);
  border-left: 2px solid var(--pixel-ink);
  pointer-events: none;
}

body[data-pixel-skin] [class*='dialog' i]::after {
  content: '';
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 7px;
  height: 7px;
  border-right: 2px solid var(--pixel-ink);
  border-bottom: 2px solid var(--pixel-ink);
  pointer-events: none;
}

/* Copy buttons blink in stepped frames on activation. */
body[data-pixel-skin] [class*='copyButton' i]:active {
  animation: dsh-pixel-skeleton-blink 0.3s steps(2, end) 1;
}

/* Tabs keep the original underline treatment; only small pills and status
   markers get the square pixel treatment. */
body[data-pixel-skin] :is([class*='pill' i], [class*='badge' i], [class*='stateDot' i], [class*='dot' i]) {
  border: 1px solid var(--pixel-ink) !important;
  border-radius: 0 !important;
  box-shadow: inset 1px 1px 0 var(--pixel-edge-hi);
}

/* Code windows: inset screen, hard frame, striped banner. */
body[data-pixel-skin] :is(pre, [class*='codeBlock' i]) {
  border: 2px solid var(--pixel-ink) !important;
  box-shadow:
    inset 2px 2px 0 var(--pixel-edge-lo),
    3px 3px 0 var(--pixel-edge-lo) !important;
}

body[data-pixel-skin] :is([class*='codeBlock' i], [class*='code-block' i]) :is([class*='header' i], [class*='banner' i]) {
  border-bottom: 2px solid var(--pixel-ink) !important;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.08) 0,
    rgba(0, 0, 0, 0.08) 2px,
    transparent 2px,
    transparent 4px
  ) !important;
}

/* Language hint becomes a square cartridge label. */
body[data-pixel-skin] [class*='infostring' i] {
  box-sizing: border-box;
  padding: 1px 6px;
  border: 1px solid var(--pixel-ink);
  background: var(--dsw-alias-bg-layer-2);
}

/* Inline code keeps the original chrome; only the outer code window gets the
   pixel frame above. */

/* Headings cast hard pixel shadows instead of soft gradients. */
body[data-pixel-skin] :is(h1, h2, h3, h4, [class*='headline' i], [class*='headlineText' i]) {
  text-shadow: 2px 2px 0 var(--pixel-edge-lo);
}

/* Vector icons snap to the pixel grid. */
body[data-pixel-skin] svg * {
  shape-rendering: crispEdges;
}

/* Scrollbar grooves read as recessed tracks. */
body[data-pixel-skin] ::-webkit-scrollbar-track {
  background: var(--dsw-alias-bg-layer-1);
}

/* Skeletons shimmer as discrete pixel bars with a stepped game-loop blink. */
@keyframes dsh-pixel-skeleton-blink {
  0% { opacity: 0.35; }
  50% { opacity: 1; }
  100% { opacity: 0.35; }
}

body[data-pixel-skin] [class*='skeleton' i] {
  background-image: repeating-linear-gradient(
    90deg,
    var(--dsw-alias-bg-skeleton) 0,
    var(--dsw-alias-bg-skeleton) 6px,
    transparent 6px,
    transparent 12px
  ) !important;
  animation: dsh-pixel-skeleton-blink 1.2s steps(2, end) infinite;
}

/* Windowed surfaces open on stepped, game-like ticks. */
body[data-pixel-skin] :is([class*='menu' i], [class*='dialog' i], [class*='popover' i], [class*='tooltip' i], [class*='toast' i]) {
  transition-duration: 120ms !important;
  transition-timing-function: steps(2, end) !important;
}

@media (prefers-reduced-motion: reduce) {
  body[data-pixel-skin] :is(button, [role='button'], [class*='button' i], [class*='menu' i], [class*='dialog' i], [class*='popover' i], [class*='tooltip' i], [class*='toast' i], [class*='skeleton' i]),
body[data-pixel-skin] [data-tool][data-state='running'] [class*='row']::after,
body[data-pixel-skin] [data-variant='think'][data-state='running'] [class*='row']::after,
body[data-pixel-skin] [data-variant='bash'][data-state='running']::after,
body[data-pixel-skin] [data-variant='others'][data-state='running'] [class*='row']::after {
    transition: none !important;
    animation: none !important;
  }
}
`;
