interface EnvelopeSealProps {
  monogram: string;
  wax: string;
}

/**
 * Default wax seal: a raised, irregular-edged wax medallion with the
 * monogram pressed INTO the wax (recessed letterpress, not printed on top),
 * a matte grain finish, and a soft ground shadow. Built entirely from SVG
 * filters — no raster image involved. Swap via the `artwork` prop on
 * `EnvelopeIntro` for a per-couple crest.
 */
export default function EnvelopeSeal({ monogram, wax }: EnvelopeSealProps) {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" role="img" aria-label={`${monogram} wax seal`}>
      <defs>
        <radialGradient id="waxDome" cx="35%" cy="28%" r="85%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="42%" stopColor={wax} stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>

        <clipPath id="sealClip">
          <circle cx="60" cy="60" r="51" />
        </clipPath>

        <filter id="waxEdge" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="waxGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="11" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
        </filter>

        {/* Recessed / letterpress emboss: shadow on the light-facing (top-left)
            side of each stroke, highlight on the far (bottom-right) side — the
            opposite of a raised bump, which reads as pressed INTO the wax. */}
        <filter id="waxEmboss" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="blur" />
          <feOffset in="blur" dx="-0.8" dy="-0.8" result="offsetDark" />
          <feFlood floodColor="#000" floodOpacity="0.5" result="colorDark" />
          <feComposite in="colorDark" in2="offsetDark" operator="in" result="shadowDark" />
          <feOffset in="blur" dx="0.7" dy="0.7" result="offsetLight" />
          <feFlood floodColor="#fff" floodOpacity="0.32" result="colorLight" />
          <feComposite in="colorLight" in2="offsetLight" operator="in" result="shadowLight" />
          <feMerge>
            <feMergeNode in="shadowDark" />
            <feMergeNode in="shadowLight" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="60" cy="60" r="50" fill={wax} filter="url(#waxEdge)" />
      <circle cx="60" cy="60" r="50" fill="url(#waxDome)" filter="url(#waxEdge)" />
      <circle
        cx="60"
        cy="60"
        r="50"
        fill="#fff"
        filter="url(#waxGrain)"
        clipPath="url(#sealClip)"
        style={{ mixBlendMode: "overlay" }}
      />

      <text
        x="60"
        y="71"
        textAnchor="middle"
        fontSize="34"
        fontStyle="italic"
        fontWeight="500"
        fill={wax}
        filter="url(#waxEmboss)"
        style={{ fontFamily: "var(--font-display, serif)" }}
      >
        {monogram}
      </text>
    </svg>
  );
}
