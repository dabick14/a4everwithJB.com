"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./EnvelopeIntro.module.css";
import EnvelopeSeal from "./EnvelopeSeal";
import { hasSeenThisSession, markSeenThisSession, slugifyKey } from "./useSeenThisSession";
import type { EnvelopeCouplePalette, EnvelopeIntroProps } from "./types";

const DEFAULT_PALETTE: Required<EnvelopeCouplePalette> = {
  envelope: "#4A2E17",
  envelopeShadow: "#20110A",
  card: "#F7F1E4",
  ink: "#3A2414",
  accent: "#E0BE55",
  ribbon: "#C6A253",
  wax: "#C6A253",
};

function defaultMonogram(names: [string, string]): string {
  return names.map((n) => n.trim().charAt(0).toUpperCase()).join(" & ");
}

export default function EnvelopeIntro({
  names,
  monogram,
  tagline = "request the pleasure of your company",
  couplePalette,
  ribbonColour,
  artwork,
  envelopeTexture,
  storageKey,
  trigger = "tap",
  autoDelay = 600,
  skipLabel = "Skip",
  tapLabel = "Tap to open",
  onComplete,
  disabled = false,
}: EnvelopeIntroProps) {
  const palette = useMemo<Required<EnvelopeCouplePalette>>(
    () => ({
      ...DEFAULT_PALETTE,
      ...couplePalette,
      ribbon: ribbonColour ?? couplePalette?.ribbon ?? DEFAULT_PALETTE.ribbon,
      wax: couplePalette?.wax ?? ribbonColour ?? couplePalette?.ribbon ?? DEFAULT_PALETTE.wax,
    }),
    [couplePalette, ribbonColour],
  );

  const resolvedMonogram = monogram ?? defaultMonogram(names);
  const storageSlug = storageKey ?? slugifyKey(names);

  const [stage, setStage] = useState<"closed" | "playing" | "done">("closed");
  const [visible, setVisible] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const flapTopRef = useRef<HTMLDivElement>(null);
  const flapBottomRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Runs before paint so a returning/reduced-motion visitor never sees the overlay flash in.
  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (disabled || reduceMotion || hasSeenThisSession(storageSlug)) {
      setStage("done");
      setVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stage === "done") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "closed" || trigger !== "auto") return;
    const timeout = setTimeout(() => play(), autoDelay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, trigger, autoDelay]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  function finish() {
    setVisible(false);
    setStage("done");
    onComplete?.();
  }

  function play() {
    if (stage !== "closed") return;
    markSeenThisSession(storageSlug);
    setStage("playing");

    const tl = gsap.timeline({ onComplete: finish });
    timelineRef.current = tl;

    // The wax seal breaks first — a small lift + fade, as if cracking off the
    // paper — before the flap itself starts to fold back.
    tl.to(sealRef.current, { scale: 0.85, y: -6, opacity: 0, duration: 0.3, ease: "power2.in" })
      .to(flapTopRef.current, { rotateX: -165, duration: 1.4, ease: "power3.inOut" }, "-=0.08")
      .to(flapBottomRef.current, { rotateX: 165, duration: 1.4, ease: "power3.inOut" }, "<")
      .to(
        cardRef.current,
        { opacity: 1, y: "-38vh", scale: 1.03, duration: 0.7, ease: "power2.out" },
        "-=0.75",
      )
      .to(overlayRef.current, { opacity: 0, scale: 1.05, duration: 0.45, ease: "power1.in" }, "+=0.12");
  }

  function skip() {
    if (stage === "done") return;
    markSeenThisSession(storageSlug);
    timelineRef.current?.kill();
    setStage("playing");
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power1.in", onComplete: finish });
  }

  if (!visible) return null;

  const paletteVars = {
    "--ei-envelope": palette.envelope,
    "--ei-envelope-shadow": palette.envelopeShadow,
    "--ei-card": palette.card,
    "--ei-ink": palette.ink,
    "--ei-accent": palette.accent,
    "--ei-ribbon": palette.ribbon,
    "--ei-wax": palette.wax,
    ...(envelopeTexture ? { "--ei-envelope-texture": `url(${envelopeTexture})` } : {}),
  } as React.CSSProperties;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      style={paletteVars}
      role="dialog"
      aria-modal="true"
      aria-label={`Opening invitation for ${names[0]} and ${names[1]}`}
    >
      <button type="button" className={styles.skip} onClick={skip}>
        {skipLabel}
      </button>

      <div className={styles.stage}>
        <div
          className={styles.envelope}
          onClick={stage === "closed" ? play : undefined}
          role="button"
          tabIndex={stage === "closed" ? 0 : -1}
          onKeyDown={(e) => {
            if (stage === "closed" && (e.key === "Enter" || e.key === " ")) play();
          }}
          aria-hidden={stage !== "closed"}
        >
          <div className={styles.back} />
          <div className={`${styles.sideFlap} ${styles.sideFlapLeft}`} />
          <div className={`${styles.sideFlap} ${styles.sideFlapRight}`} />

          <div ref={cardRef} className={styles.card}>
            <span className={styles.cardMonogram}>{resolvedMonogram}</span>
            <span className={styles.cardNames}>
              {names[0]} &amp; {names[1]}
            </span>
            <span className={styles.cardRule} aria-hidden="true" />
            <span className={styles.cardTagline}>{tagline}</span>
          </div>

          <div ref={flapBottomRef} className={`${styles.flap} ${styles.flapBottom}`}>
            <div className={styles.flapFace} aria-hidden="true" />
            <div className={styles.flapBack} aria-hidden="true" />
          </div>

          <div ref={flapTopRef} className={`${styles.flap} ${styles.flapTop}`}>
            <div className={styles.flapFace} aria-hidden="true" />
            <div className={styles.flapBack} aria-hidden="true" />

            {/* Thin foil trim + diamond, on the fold seam — static, rotates with the flap. */}
            <div className={styles.flapSeamLine} aria-hidden="true" />
            <div className={styles.flapSeamDiamond} aria-hidden="true" />

            <div ref={sealRef} className={styles.seal}>
              {typeof artwork === "function"
                ? artwork({ palette, monogram: resolvedMonogram })
                : artwork ?? <EnvelopeSeal monogram={resolvedMonogram} wax={palette.wax} />}
            </div>
          </div>
        </div>

        {trigger === "tap" && stage === "closed" && (
          <button type="button" className={styles.tapPrompt} onClick={play}>
            {tapLabel}
          </button>
        )}
      </div>
    </div>
  );
}
