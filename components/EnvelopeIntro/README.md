# EnvelopeIntro

A full-screen "open the invitation" intro: a closed, engraved envelope that a
visitor taps open — the wax seal lifts and breaks, the two flaps fold back in
3D, the invitation card rises out of the pocket, then the whole overlay fades
to reveal the site underneath. Plays once per browser session.

Built for reuse across every CF Weddings site — only the props change per
couple, never the component.

## Usage

```tsx
import { EnvelopeIntro } from "@/components/EnvelopeIntro";

<EnvelopeIntro
  names={["Jeremy", "Afriyie"]}
  tagline="are getting married"
  couplePalette={{
    envelope: "#4A2E17",
    envelopeShadow: "#20110A",
    card: "#F7F1E4",
    ink: "#3A2414",
    accent: "#E0BE55",
    ribbon: "#C6A253",
    wax: "#C6A253",
  }}
/>
```

Mount it once, near the top of the page (see `app/page.tsx`). It renders a
fixed-position overlay above everything else and unmounts itself when the
animation finishes — no wrapper markup required, no changes needed to the
rest of the page.

## Props

| Prop            | Type                                                              | Default                              | Notes |
|-----------------|--------------------------------------------------------------------|---------------------------------------|-------|
| `names`         | `[string, string]`                                                 | — (required)                          | Display order on the card, e.g. `["Afriyie", "Jeremy"]`. |
| `monogram`      | `string`                                                            | initials of `names`, e.g. `"A & J"`   | Shown on the seal and the card. |
| `tagline`       | `string`                                                            | `"request the pleasure of your company"` | One line under the names on the card. |
| `couplePalette` | `EnvelopeCouplePalette` — `envelope`, `envelopeShadow`, `card`, `ink`, `accent`, `ribbon`, `wax` (all optional colours) | engraved umber/gold/cream defaults | Recolour the whole piece without touching artwork files. `wax` defaults to `ribbon` if omitted. |
| `ribbonColour`  | `string`                                                            | `couplePalette.ribbon`               | Shorthand; wins over `couplePalette.ribbon` if both are set. Also colours the thin foil trim + diamond under the seal. |
| `artwork`       | `ReactNode \| (ctx: { palette, monogram }) => ReactNode`            | built-in raised wax-seal SVG          | Swap in a per-couple crest/monogram. See below. |
| `envelopeTexture` | `string` (URL)                                                    | none — flat gradient                  | Photographed/rendered paper texture for the envelope surface. Applied to the back, both flaps, and the side folds so it reads as one continuous sheet. |
| `envelopeStyle` | `"engraved"`                                                        | `"engraved"`                          | Reserved for future envelope silhouettes (square flap, etc.). Only one ships today. |
| `storageKey`    | `string`                                                            | slug of `names`                       | sessionStorage key that remembers "already played." |
| `trigger`       | `"tap" \| "auto"`                                                   | `"tap"`                               | `"tap"` shows a "Tap to open" prompt; `"auto"` plays after `autoDelay`. The envelope itself is always clickable/tappable either way. |
| `autoDelay`     | `number` (ms)                                                       | `600`                                 | Only used when `trigger="auto"`. |
| `skipLabel`     | `string`                                                            | `"Skip"`                              | Always-visible skip control (top-right). |
| `tapLabel`      | `string`                                                            | `"Tap to open"`                       | Only shown when `trigger="tap"`. |
| `onComplete`    | `() => void`                                                        | —                                      | Fires once the overlay has fully unmounted. |
| `disabled`      | `boolean`                                                           | `false`                               | Force-skip (e.g. Storybook, visual QA, tests). |

## Behaviour notes

- **Sizing is full-bleed on mobile, contained on desktop.** Below the
  `768px` breakpoint the envelope fills the viewport edge-to-edge
  (`100vw` / `100dvh`) — immersive, matching how most guests open the
  link. At `768px` and up it becomes a portrait card capped at
  `min(92vw, 520px)` wide / `min(90vh, 900px)` tall, centered, so it
  reads as an object held upright rather than stretching distorted
  across a wide screen.
- **Plays once per session.** Uses `sessionStorage` (not an Anthropic
  artifact concern here — this is a normal deployed web app), keyed by
  `storageKey` or a slug of `names`. Internal navigation within the same
  session won't replay it; a new tab / new session will.
- **`prefers-reduced-motion: reduce`** skips the intro entirely — the
  overlay never renders, the site is visible immediately. Checked
  synchronously before first paint (`useLayoutEffect`) so there's no flash.
- **Skip control** is always present (top-right, safe-area aware) and jumps
  straight to the finished state.
- **Body scroll is locked** while the overlay is mounted and restored the
  moment it unmounts.
- **No extra network requests.** All artwork is inline SVG/CSS — no raster
  images to fetch, which matters on the mobile networks this ships to.

## Supplying per-couple artwork

Two levels, cheapest first:

1. **Recolour only (most couples).** Pass `couplePalette` /
   `ribbonColour`. The built-in wax seal, flap trim, and card all pick
   up the new colours automatically — no new files.
2. **Custom seal/crest.** Pass `artwork`, either a `ReactNode` or a
   function `({ palette, monogram }) => ReactNode` if the artwork needs to
   read the resolved colours. It renders inside a `~26%`-of-envelope-width
   square centered on the top flap, so keep custom SVGs roughly square and
   let them fill their viewBox. Example:

   ```tsx
   <EnvelopeIntro
     names={["Ama", "Kojo"]}
     artwork={({ palette, monogram }) => (
       <CustomCrest fill={palette.accent} label={monogram} />
     )}
   />
   ```

There's currently one envelope silhouette (`envelopeStyle="engraved"`, a
pointed four-flap wallet fold). The type is already a union so a second
silhouette (e.g. a square-flap envelope) can be added later as
`envelopeStyle="square"` without a breaking change — build it as a sibling
component (`EnvelopeShapeSquare.tsx`) and switch on the prop inside
`EnvelopeIntro.tsx` when a second couple actually needs it. Don't build it
speculatively before then.

## Files

```
components/EnvelopeIntro/
  EnvelopeIntro.tsx           the component + GSAP timeline
  EnvelopeIntro.module.css    layout, 3D flap geometry, palette CSS vars
  EnvelopeSeal.tsx            default raised wax-seal SVG
  useSeenThisSession.ts       sessionStorage helpers
  types.ts                    prop types
  index.ts                    barrel export
```

## Extending the timeline

The whole sequence is one `gsap.timeline()` in `play()`:

1. wax seal lifts + fades (small scale/translate, as if cracking off the paper)
2. top flap `rotateX` open (hinge at top edge, starts as the seal is finishing)
3. bottom flap `rotateX` open (hinge at bottom edge, overlaps step 2)
4. card rises out of the pocket, fades/scales in
5. overlay fades + scales out, then unmounts

Total runtime is ~2.5s, eased throughout — tune by adjusting the `duration`/
overlap (`"-="`/`"+="`) values on each `.to()` call. The flap tweens
(1.4s each) are deliberately slow: fast enough felt like a flap snapping
rather than folding. The thin foil trim + diamond under the seal
(`.flapSeamLine` / `.flapSeamDiamond`) isn't part of the timeline — it's
static CSS on `.flapTop`, so it simply rotates away with it.

Each step is a normal `.to()` call — retime or re-ease by editing the
tween in place, no architectural changes needed.

## Flap paper structure

Each flap (`.flapTop`, `.flapBottom`) is a 3D group (`transform-style:
preserve-3d`) containing two clipped layers, not one:

- `.flapFace` — the front, same `envelope-texture.jpeg` and same
  `background-size: cover; background-position: center` box as `.back`
  and `.sideFlap`, so the grain lines up continuously across the fold
  seam with no manual offset needed — every layer samples the identical
  region of the same full-size, `inset: 0` box; only the `clip-path`
  differs per element.
- `.flapBack` — a plain dark shade (unprinted paper has no embossed
  florals on its reverse), pre-rotated `rotateX(180deg)` so it only
  becomes visible once the live rotation carries the flap past 90deg —
  right as `.flapFace`'s own `backface-visibility: hidden` makes the
  front disappear. This is what makes the fold read as a real sheet of
  paper turning over, not a flat image swinging on a hinge.

The seal and the foil trim/diamond are children of `.flapTop` (so they
rotate away with it as one rigid unit) but are deliberately **outside**
`.flapFace`'s clip-path — a wax seal glued across a real fold seam
straddles both surfaces rather than being confined to one paper
triangle. Repositioning the seal is a matter of the `.seal` rule's
`top`, not the flap geometry; keep it a few points shy of the flap's
clip-path apex (58% of the envelope's height, currently) rather than
exactly on it, since `seal-gold.webp` is a near-edge-to-edge wax blob
with almost no transparent margin to absorb a hard clip.
