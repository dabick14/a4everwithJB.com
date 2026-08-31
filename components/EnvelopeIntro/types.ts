import type { ReactNode } from "react";

/** Per-couple colour overrides. Any omitted value falls back to the default engraved-envelope palette. */
export interface EnvelopeCouplePalette {
  /** Envelope paper base colour (front of flaps + back plate). */
  envelope?: string;
  /** Darker shade used for the envelope's inner pocket / shadow depth. */
  envelopeShadow?: string;
  /** Invitation card stock colour. */
  card?: string;
  /** Ink colour for text printed on the card. */
  ink?: string;
  /** Foil / engraving line colour (card rule + monogram). */
  accent?: string;
  /** Ribbon colour. Overridden by the top-level `ribbonColour` prop if both are set. */
  ribbon?: string;
  /** Wax-seal colour. Defaults to the ribbon colour if omitted. */
  wax?: string;
}

export interface EnvelopeIntroProps {
  /** Couple's names in display order, e.g. `["Afriyie", "Jeremy"]`. */
  names: [string, string];
  /**
   * Text shown on the wax-seal medallion and as the card's monogram.
   * Defaults to the two names' initials joined with "&", e.g. "A & J".
   */
  monogram?: string;
  /** Short line printed on the invitation card beneath the monogram. */
  tagline?: string;
  /** Colour overrides for this couple. See {@link EnvelopeCouplePalette}. */
  couplePalette?: EnvelopeCouplePalette;
  /** Shorthand for `couplePalette.ribbon`. Takes precedence if both are supplied. */
  ribbonColour?: string;
  /**
   * URL of a photographed/rendered paper texture (e.g. embossed cotton stock)
   * to use as the envelope's surface instead of the flat gradient. Falls back
   * to `couplePalette.envelope` / `envelopeShadow` when omitted.
   */
  envelopeTexture?: string;
  /**
   * Swap the default engraved wax-seal medallion for custom per-couple artwork
   * (a crest, an SVG monogram, an illustration). Receives the resolved palette
   * and monogram text so custom art can stay colour-consistent.
   */
  artwork?: ReactNode | ((ctx: { palette: Required<EnvelopeCouplePalette>; monogram: string }) => ReactNode);
  /**
   * Reserved for future built-in envelope silhouettes (e.g. square flap vs.
   * pointed wallet flap). Only `"engraved"` ships today.
   */
  envelopeStyle?: "engraved";
  /** sessionStorage key used to remember the intro has played this session. */
  storageKey?: string;
  /** `"tap"` waits for the visitor to tap the envelope; `"auto"` plays on load. */
  trigger?: "tap" | "auto";
  /** Delay (ms) before auto-playing when `trigger="auto"`. */
  autoDelay?: number;
  /** Label for the always-visible skip control. */
  skipLabel?: string;
  /** Label for the tap-to-open prompt. */
  tapLabel?: string;
  /** Called once the reveal animation finishes and the overlay unmounts. */
  onComplete?: () => void;
  /** Force-skip the intro entirely (e.g. in tests or previews). */
  disabled?: boolean;
}
