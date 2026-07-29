"use client";

/**
 * Hand-drawn-style ornamental SVGs used across the cover screen and the
 * invitation itself. Kept dependency-free (no image files) so the whole
 * thing works the moment you drop these components in.
 */

export function CornerFlourish({
  rotate = 0,
  size = 64,
}: {
  rotate?: number;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      {/* layered double border, rounded into the corner */}
      <path
        d="M6 44 V10 Q6 6 10 6 H44"
        stroke="#C6982F"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M6 34 V14 Q6 10.5 9.5 10.5 H34"
        stroke="#8E6B2E"
        strokeWidth="0.8"
        fill="none"
        opacity="0.55"
        strokeLinecap="round"
      />

      {/* meander-echoing tick marks along both edges */}
      {Array.from({ length: 5 }).map((_, i) => {
        const x = 15 + i * 6;
        return (
          <line
            key={`h${i}`}
            x1={x}
            y1={6}
            x2={x}
            y2={9.5}
            stroke="#C6982F"
            strokeWidth="0.7"
            opacity="0.45"
          />
        );
      })}
      {Array.from({ length: 5 }).map((_, i) => {
        const y = 15 + i * 6;
        return (
          <line
            key={`v${i}`}
            x1={6}
            y1={y}
            x2={9.5}
            y2={y}
            stroke="#C6982F"
            strokeWidth="0.7"
            opacity="0.45"
          />
        );
      })}

      {/* curling tendril unwinding from the corner */}
      <path
        d="M10 6 C 24 6 27 17 18 21 C 11 24 13 32 22 32"
        stroke="#C6982F"
        strokeWidth="1.1"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M22 32 C 29 32 30 26 24 23.5"
        stroke="#4F6B4A"
        strokeWidth="0.9"
        fill="none"
        opacity="0.75"
        strokeLinecap="round"
      />

      {/* small ulzii-style interlocking loop at the tendril's tip —
          a nod to the Mongolian endless-knot motif */}
      <path
        d="M24 23.5 C 26.8 21.2 26.8 18.3 24 17.1 C 21.3 15.9 21.3 13 24 11.2"
        stroke="#C6982F"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />

      {/* jewel accents */}
      <circle cx="10" cy="6" r="1.9" fill="#C6982F" />
      <circle cx="6" cy="44" r="1.5" fill="#C6982F" opacity="0.85" />
      <circle cx="44" cy="6" r="1.3" fill="#8E6B2E" opacity="0.7" />
      <circle cx="18" cy="21" r="1.1" fill="#4F6B4A" />
      <circle cx="24" cy="11.2" r="1" fill="#C6982F" opacity="0.9" />
    </svg>
  );
}

/**
 * A tileable strip of the traditional Mongolian "хээ угалз" (key-fret /
 * meander) pattern. This is the invitation's signature ornamental device —
 * used along frame edges and section rules instead of a plain line, so the
 * whole piece reads as Mongolian rather than generic-gold-wedding.
 *
 * Width is approximate: the pattern repeats in fixed-size units and simply
 * stops at the nearest unit boundary, so it tiles cleanly at any width.
 */
export function MongolianMeander({
  width = 280,
  height = 16,
  color = "#C6982F",
  opacity = 0.85,
}: {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
}) {
  const unit = 22;
  const count = Math.max(1, Math.round(width / unit));
  const w = count * unit;
  const top = height * 0.22;
  const mid = height * 0.5;
  const bottom = height * 0.82;

  const segments = Array.from({ length: count }).map((_, i) => {
    const x = i * unit;
    return (
      <path
        key={i}
        d={`M${x} ${bottom} V${mid} H${x + unit * 0.45} V${top} H${x + unit * 0.55} V${mid} H${x + unit} V${bottom}`}
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        strokeLinejoin="miter"
      />
    );
  });

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      preserveAspectRatio="none"
      style={{ opacity, display: "block" }}
      aria-hidden
    >
      {segments}
    </svg>
  );
}

/** Simple felt-tent silhouette used as a small motif — replaces the removed,
 *  never-finished YurtIllustration import that used to break CoverScreen. */
export function GerMotif({ width = 72 }: { width?: number }) {
  const h = width * 0.62;
  return (
    <svg width={width} height={h} viewBox="0 0 100 62" fill="none" aria-hidden>
      <path
        d="M18 34 C 30 14, 70 14, 82 34"
        stroke="#8E6B2E"
        strokeWidth="1.3"
        fill="none"
      />
      <circle cx="50" cy="16" r="3.2" fill="#C6982F" />
      <line
        x1="50"
        y1="19"
        x2="50"
        y2="34"
        stroke="#C6982F"
        strokeWidth="0.7"
        opacity="0.6"
      />
      <rect
        x="14"
        y="34"
        width="72"
        height="20"
        stroke="#8E6B2E"
        strokeWidth="1.2"
        fill="none"
      />
      <rect
        x="43"
        y="38"
        width="14"
        height="16"
        stroke="#C6982F"
        strokeWidth="1"
        fill="none"
      />
      <line
        x1="10"
        y1="54"
        x2="90"
        y2="54"
        stroke="#C6982F"
        strokeWidth="0.8"
        opacity="0.4"
      />
    </svg>
  );
}

/** A large, faint circular medallion — the kind of watermark pattern that
 *  sits behind a cover screen. Concentric rings, radiating spokes, and a
 *  small knot at the center. Meant to be used oversized and cropped by the
 *  screen edge, at low opacity, purely as atmosphere. */
export function CircularMotif({
  size = 320,
  opacity = 0.14,
  color = "#B08A3C",
}: {
  size?: number;
  opacity?: number;
  color?: string;
}) {
  const r = size / 2;

  const spokeCount = 48;

  const spokes = Array.from({ length: spokeCount }).map((_, i) => {
    const a = (i / spokeCount) * Math.PI * 2;

    const inner = r * 0.45;
    const outer = r * 0.88;

    return (
      <line
        key={i}
        x1={r + Math.cos(a) * inner}
        y1={r + Math.sin(a) * inner}
        x2={r + Math.cos(a) * outer}
        y2={r + Math.sin(a) * outer}
        stroke="url(#gold)"
        strokeWidth={i % 4 === 0 ? "1.5" : "0.6"}
        opacity={i % 4 === 0 ? ".7" : ".35"}
      />
    );
  });

  const dots = Array.from({ length: 24 }).map((_, i) => {
    const a = (i / 24) * Math.PI * 2;

    const rr = r * 0.94;

    return (
      <circle
        key={i}
        cx={r + Math.cos(a) * rr}
        cy={r + Math.sin(a) * rr}
        r={size * 0.008}
        fill="url(#gold)"
      />
    );
  });

  const stars = Array.from({ length: 12 }).map((_, i) => {
    const a = (i / 12) * Math.PI * 2;

    const rr = r * 0.72;

    return (
      <g
        key={i}
        transform={`
          translate(
            ${r + Math.cos(a) * rr},
            ${r + Math.sin(a) * rr}
          )
        `}
      >
        <path
          d="
          M0 -6
          L1.5 -1.5
          L6 0
          L1.5 1.5
          L0 6
          L-1.5 1.5
          L-6 0
          L-1.5 -1.5Z
          "
          fill="url(#gold)"
          opacity=".55"
        />
      </g>
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      style={{
        opacity,
        animation: "mandalaRotate 60s linear infinite",
      }}
    >
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff1b8" />

          <stop offset="30%" stopColor="#d4af37" />

          <stop offset="60%" stopColor="#8e6b2e" />

          <stop offset="100%" stopColor="#f6d98b" />
        </linearGradient>

        <radialGradient id="centerGlow">
          <stop offset="0%" stopColor="#f7dc91" stopOpacity=".5" />

          <stop offset="100%" stopColor="#b58a35" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft aura */}

      <circle cx={r} cy={r} r={r * 0.98} fill="url(#centerGlow)" />

      {/* outer gold rings */}

      {[0.96, 0.86, 0.72, 0.58, 0.42].map((v, i) => (
        <circle
          key={i}
          cx={r}
          cy={r}
          r={r * v}
          fill="none"
          stroke="url(#gold)"
          strokeWidth={i === 0 ? "1.8" : "0.7"}
          opacity={1 - i * 0.15}
        />
      ))}

      {spokes}

      {dots}

      {stars}

      {/* Mongolian endless knot */}

      <path
        d={`
        M ${r} ${r - r * 0.18}

        C 
        ${r + r * 0.15} ${r - r * 0.1},
        ${r + r * 0.15} ${r + r * 0.1},
        ${r} ${r + r * 0.18}

        C
        ${r - r * 0.15} ${r + r * 0.1},
        ${r - r * 0.15} ${r - r * 0.1},
        ${r} ${r - r * 0.18}
        `}
        fill="none"
        stroke="url(#gold)"
        strokeWidth="2"
      />

      {/* center jewel */}

      <circle cx={r} cy={r} r={size * 0.018} fill="#f7dc91" />

      <style>
        {`

      @keyframes mandalaRotate {

        from{
          transform:rotate(0deg);
        }

        to{
          transform:rotate(360deg);
        }

      }

      `}
      </style>
    </svg>
  );
}

/** A denser, lace-like corner ornament for the invitation frame: fanning
 *  concentric arcs, beadwork dots, a small quatrefoil at the vertex, and
 *  meander-echoing ticks. Meant to read as "filigree", not a single line. */
export function OrnateCorner({
  size = 90,
  flip = false,
}: {
  size?: number;
  flip?: boolean;
}) {
  const arcs = [12, 20, 28, 36, 44];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <defs>
        <linearGradient id="goldCorner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7D98B" />
          <stop offset="35%" stopColor="#C6982F" />
          <stop offset="70%" stopColor="#8E6B2E" />
          <stop offset="100%" stopColor="#E7C66B" />
        </linearGradient>

        <radialGradient id="jewel">
          <stop offset="0%" stopColor="#FFE9A9" />
          <stop offset="60%" stopColor="#C6982F" />
          <stop offset="100%" stopColor="#8E6B2E" />
        </radialGradient>
      </defs>

      {/* Main L frame */}

      <path
        d="
        M6 72
        V10
        Q6 6 10 6
        H72
        "
        fill="none"
        stroke="url(#goldCorner)"
        strokeWidth="1.8"
      />

      {/* inner thin line */}

      <path
        d="
        M12 58
        V16
        Q12 12 16 12
        H58
        "
        fill="none"
        stroke="#8E6B2E"
        strokeWidth=".7"
        opacity=".5"
      />

      {/* curved royal ornaments */}

      {arcs.map((r, i) => (
        <path
          key={r}
          d={`
          M6 ${6 + r}
          A ${r} ${r}
          0 0 1
          ${6 + r} 6
          `}
          fill="none"
          stroke="url(#goldCorner)"
          strokeWidth={i === 0 ? "1.2" : ".65"}
          opacity={0.9 - i * 0.12}
        />
      ))}

      {/* golden beads */}

      {arcs.map((r, i) => (
        <circle
          key={i}
          cx={6 + r * 0.7}
          cy={6 + r * 0.7}
          r={i === 0 ? "2" : "1"}
          fill="url(#jewel)"
          opacity={0.85 - i * 0.1}
        />
      ))}

      {/* Mongolian flower center */}

      <g transform="translate(6 6)">
        <circle r="4" fill="url(#jewel)" />

        <circle r="1.4" fill="#FFF1C7" />

        <path
          d="
          M0 -7
          C2 -3 3 -2 7 0
          C3 2 2 3 0 7
          C-2 3 -3 2 -7 0
          C-3 -2 -2 -3 0 -7
          "
          fill="none"
          stroke="#C6982F"
          strokeWidth=".8"
        />
      </g>

      {/* small engraved lines */}

      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={22 + i * 8}
          y1="8"
          x2={22 + i * 8}
          y2="12"
          stroke="#C6982F"
          strokeWidth=".5"
          opacity=".45"
        />
      ))}

      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="8"
          y1={22 + i * 8}
          x2="12"
          y2={22 + i * 8}
          stroke="#C6982F"
          strokeWidth=".5"
          opacity=".45"
        />
      ))}

      {/* sparkle */}

      <path
        d="
        M42 42
        L44 47
        L49 49
        L44 51
        L42 56
        L40 51
        L35 49
        L40 47Z
        "
        fill="#E8C875"
        opacity=".7"
      />
    </svg>
  );
}

/** A detailed ger (yurt) illustration: curved roof with radiating uni
 *  (rafters) converging on a lattice-crossed toono, a two-tone roof trim
 *  band, lattice-banded walls, and an ornamented door. This is the cover
 *  screen's signature illustration. */
export function GerIllustration({ width = 220 }: { width?: number }) {
  const h = width * 0.78;
  return (
    <svg width={width} height={h} viewBox="0 0 220 172" fill="none" aria-hidden>
      {/* ground shadow */}
      <ellipse cx="110" cy="151" rx="88" ry="6" fill="#8E6B2E" opacity="0.08" />

      {/* roof, gently domed */}
      <path
        d="M36 82 C 58 44, 92 26, 110 26 C 128 26, 162 44, 184 82 Z"
        fill="#FFFDF8"
        stroke="#8E6B2E"
        strokeWidth="1.3"
      />

      {/* uni (rafters) radiating to the toono */}
      {Array.from({ length: 13 }).map((_, i) => {
        const t = i / 12;
        const x = 40 + t * 140;
        return (
          <line
            key={i}
            x1={x}
            y1={81}
            x2={110}
            y2={31}
            stroke="#C6982F"
            strokeWidth="0.55"
            opacity="0.55"
          />
        );
      })}

      {/* toono — the crown ring, with a small cross lattice */}
      <circle
        cx="110"
        cy="30"
        r="8"
        fill="#FFFDF8"
        stroke="#C6982F"
        strokeWidth="1.3"
      />
      <line
        x1="102"
        y1="30"
        x2="118"
        y2="30"
        stroke="#C6982F"
        strokeWidth="0.7"
        opacity="0.7"
      />
      <line
        x1="110"
        y1="22"
        x2="110"
        y2="38"
        stroke="#C6982F"
        strokeWidth="0.7"
        opacity="0.7"
      />
      <circle cx="110" cy="30" r="2.2" fill="#C6982F" />

      {/* finial */}
      <line
        x1="110"
        y1="22"
        x2="110"
        y2="15"
        stroke="#8E6B2E"
        strokeWidth="1.2"
      />
      <circle cx="110" cy="13" r="2" fill="#C6982F" />

      {/* two-tone roof trim band */}
      <path d="M36 82 H184" stroke="#5B2620" strokeWidth="2.2" opacity="0.75" />
      <path d="M36 85.5 H184" stroke="#C6982F" strokeWidth="1.4" />
      {Array.from({ length: 30 }).map((_, i) => {
        const x = 38 + i * 5;
        return (
          <line
            key={i}
            x1={x}
            y1={85.5}
            x2={x}
            y2={89}
            stroke="#C6982F"
            strokeWidth="0.7"
            opacity="0.55"
          />
        );
      })}

      {/* walls, with lattice (khana) hint between two bands */}
      <rect
        x="28"
        y="89"
        width="164"
        height="52"
        fill="#FFFDF8"
        stroke="#8E6B2E"
        strokeWidth="1.3"
      />
      <line
        x1="28"
        y1="105"
        x2="192"
        y2="105"
        stroke="#C6982F"
        strokeWidth="0.7"
        opacity="0.55"
      />
      <line
        x1="28"
        y1="123"
        x2="192"
        y2="123"
        stroke="#C6982F"
        strokeWidth="0.7"
        opacity="0.55"
      />
      {Array.from({ length: 22 }).map((_, i) => {
        const x = 30 + i * 7.6;
        return (
          <g key={i}>
            <line
              x1={x}
              y1="105"
              x2={x + 7.6}
              y2="123"
              stroke="#C6982F"
              strokeWidth="0.4"
              opacity="0.28"
            />
            <line
              x1={x + 7.6}
              y1="105"
              x2={x}
              y2="123"
              stroke="#C6982F"
              strokeWidth="0.4"
              opacity="0.28"
            />
          </g>
        );
      })}

      {/* door, with a small ornamental diamond and gold trim */}
      <rect
        x="92"
        y="106"
        width="36"
        height="35"
        fill="#FFFDF8"
        stroke="#5B2620"
        strokeWidth="1.3"
      />
      <line
        x1="88"
        y1="106"
        x2="132"
        y2="106"
        stroke="#C6982F"
        strokeWidth="1.5"
      />
      <rect
        x="99"
        y="113"
        width="22"
        height="21"
        stroke="#C6982F"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M110 116 L117 123.5 L110 131 L103 123.5 Z"
        stroke="#8E6B2E"
        strokeWidth="0.8"
        fill="none"
      />
      <circle cx="122" cy="124" r="1.3" fill="#C6982F" />

      {/* ground line */}
      <line
        x1="12"
        y1="141"
        x2="208"
        y2="141"
        stroke="#C6982F"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}

export function WheatCrest({ width = 80 }: { width?: number }) {
  const h = width * 1.55;

  const grains = Array.from({ length: 7 });

  return (
    <svg width={width} height={h} viewBox="0 0 100 155" fill="none" aria-hidden>
      <defs>
        <linearGradient id="wheatGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE7A3" />

          <stop offset="35%" stopColor="#C6982F" />

          <stop offset="70%" stopColor="#8E6B2E" />

          <stop offset="100%" stopColor="#F5D889" />
        </linearGradient>

        <radialGradient id="seedGlow">
          <stop offset="0%" stopColor="#FFF1C7" />

          <stop offset="60%" stopColor="#D4AF37" />

          <stop offset="100%" stopColor="#9B742A" />
        </radialGradient>
      </defs>

      {/* outer crown circle */}

      <circle
        cx="50"
        cy="18"
        r="13"
        stroke="url(#wheatGold)"
        strokeWidth="1.8"
      />

      <circle cx="50" cy="18" r="5" fill="url(#seedGlow)" />

      {/* small rays */}

      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;

        return (
          <line
            key={i}
            x1={50 + Math.cos(a) * 17}
            y1={18 + Math.sin(a) * 17}
            x2={50 + Math.cos(a) * 22}
            y2={18 + Math.sin(a) * 22}
            stroke="#C6982F"
            strokeWidth=".8"
            opacity=".6"
          />
        );
      })}

      {/* stem */}

      <path
        d="
        M50 35
        C47 65 47 95 50 135
        "
        stroke="#506B42"
        strokeWidth="2"
        fill="none"
      />

      {/* left + right wheat leaves */}

      {grains.map((_, i) => {
        const y = 45 + i * 13;

        return (
          <g key={i}>
            {/* left leaf */}

            <path
              d={`
              M50 ${y}
              C38 ${y - 8},
              28 ${y + 2},
              22 ${y + 13}
              `}
              stroke="url(#wheatGold)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* right leaf */}

            <path
              d={`
              M50 ${y}
              C62 ${y - 8},
              72 ${y + 2},
              78 ${y + 13}
              `}
              stroke="url(#wheatGold)"
              strokeWidth="1.5"
              fill="none"
            />

            {/* seeds */}

            <circle cx="22" cy={y + 13} r="2.2" fill="url(#seedGlow)" />

            <circle cx="78" cy={y + 13} r="2.2" fill="url(#seedGlow)" />
          </g>
        );
      })}

      {/* bottom ribbon */}

      <path
        d="
        M25 140
        Q50 150
        75 140
        "
        stroke="#C6982F"
        strokeWidth="1.2"
        fill="none"
      />

      {/* center mongolian knot */}

      <path
        d="
        M50 55
        C58 62 58 70 50 77
        C42 70 42 62 50 55
        "
        stroke="#506B42"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

export function OrnamentDivider() {
  return (
    <div className="ornament-divider" aria-hidden>
      <span className="ornament-line" />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 1 L13 7 L19 10 L13 13 L10 19 L7 13 L1 10 L7 7 Z"
          stroke="#C6982F"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="10" cy="10" r="1.6" fill="#C6982F" />
      </svg>
      <span className="ornament-line" />
    </div>
  );
}

const MONTH_NAMES = [
  "1-р сар",
  "2-р сар",
  "3-р сар",
  "4-р сар",
  "5-р сар",
  "6-р сар",
  "7-р сар",
  "8-р сар",
  "9-р сар",
  "10-р сар",
  "11-р сар",
  "12-р сар",
];
export const WEEKDAY_NAMES = [
  "Ням",
  "Даваа",
  "Мягмар",
  "Лхагва",
  "Пүрэв",
  "Баасан",
  "Бямба",
];

/** A circular date badge — replaces the old boxed month-grid calendar. */
export function DateMedallion({
  day,
  month,
  year,
  weekday,
}: {
  day: number;
  month: number;
  year: number;
  weekday: number; // 0 = Sunday
}) {
  return (
    <div className="date-medallion">
      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        aria-hidden
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="medallionGlow" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#fbf3df" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#f6ead0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f6ead0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a6420" />
            <stop offset="50%" stopColor="#e9cd8b" />
            <stop offset="100%" stopColor="#8a6420" />
          </linearGradient>
        </defs>

        {/* soft inner glow */}
        <circle cx="110" cy="110" r="90" fill="url(#medallionGlow)" />

        {/* outer ring */}
        <circle
          cx="110"
          cy="110"
          r="104"
          stroke="url(#ringGold)"
          strokeWidth="1.1"
          fill="none"
          opacity="0.7"
        />
        {/* thin secondary ring */}
        <circle
          cx="110"
          cy="110"
          r="97.5"
          stroke="#4F6B4A"
          strokeWidth="0.5"
          fill="none"
          opacity="0.35"
        />
        {/* innermost hairline */}
        <circle
          cx="110"
          cy="110"
          r="84"
          stroke="#C6982F"
          strokeWidth="0.4"
          fill="none"
          opacity="0.3"
        />

        {/* tick marks — clock-like hierarchy: minutes / hours / quarters */}
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
          const isQuarter = i % 15 === 0;
          const isHour = i % 5 === 0;
          const r1 = 104;
          const r2 = isQuarter ? 95.5 : isHour ? 98 : 101;
          const width = isQuarter ? 1.1 : isHour ? 0.8 : 0.5;
          const opacity = isQuarter ? 0.75 : isHour ? 0.55 : 0.35;
          return (
            <line
              key={i}
              x1={110 + Math.cos(a) * r1}
              y1={110 + Math.sin(a) * r1}
              x2={110 + Math.cos(a) * r2}
              y2={110 + Math.sin(a) * r2}
              stroke="#C6982F"
              strokeWidth={width}
              opacity={opacity}
            />
          );
        })}

        {/* four small diamond accents at N/E/S/W */}
        {[0, 90, 180, 270].map((deg) => {
          const a = (deg * Math.PI) / 180 - Math.PI / 2;
          const cx = 110 + Math.cos(a) * 104;
          const cy = 110 + Math.sin(a) * 104;
          return (
            <rect
              key={deg}
              x={cx - 3}
              y={cy - 3}
              width="6"
              height="6"
              fill="#C6982F"
              opacity="0.8"
              transform={`rotate(45 ${cx} ${cy})`}
            />
          );
        })}
      </svg>

      <div className="date-medallion-inner">
        <span className="date-medallion-month">{MONTH_NAMES[month - 1]}</span>
        <span className="date-medallion-flourish" aria-hidden>
          ✦
        </span>
        <span className="date-medallion-day">{day}</span>
        <span className="date-medallion-divider" aria-hidden />
      </div>

      <style jsx>{`
        .date-medallion {
          position: relative;
          width: 220px;
          height: 220px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .date-medallion-inner {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        .date-medallion-month {
          font-family: var(--font-caption), sans-serif;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-size: 0.72rem;
          color: #5b2620;
          opacity: 0.9;
        }
        .date-medallion-flourish {
          font-size: 0.55rem;
          color: #c6982f;
          opacity: 0.7;
          margin: 1px 0 3px;
        }
        .date-medallion-day {
          font-style: italic;
          font-weight: 600;
          font-size: 4rem;
          line-height: 1;
          background: linear-gradient(
            120deg,
            #8a6420,
            #c2a249 42%,
            #debb6c 58%,
            #dd9822
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 1px 1px rgba(90, 60, 10, 0.25));
        }
        .date-medallion-divider {
          width: 28px;
          height: 1px;
          margin: 6px 0 5px;
          background: linear-gradient(
            90deg,
            transparent,
            #4f6b4a 50%,
            transparent
          );
          opacity: 0.55;
        }
        .date-medallion-weekday {
          font-family: var(--font-caption), sans-serif;
          font-size: 0.76rem;
          letter-spacing: 0.09em;
          color: #6b5f4f;
        }
      `}</style>
    </div>
  );
}

export function KnotRing({
  size = 220,
  ticks = 48,
  opacity = 0.35,
}: {
  size?: number;
  ticks?: number;
  opacity?: number;
}) {
  const r = size / 2;
  const inner = r - 10;
  const marks = Array.from({ length: ticks }).map((_, i) => {
    const angle = (i / ticks) * Math.PI * 2;
    const x1 = r + Math.cos(angle) * inner;
    const y1 = r + Math.sin(angle) * inner;
    const x2 = r + Math.cos(angle) * r;
    const y2 = r + Math.sin(angle) * r;
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#4F6B4A"
        strokeWidth="1"
      />
    );
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity }}
      aria-hidden
    >
      <circle
        cx={r}
        cy={r}
        r={inner}
        stroke="#C6982F"
        strokeWidth="1"
        fill="none"
      />
      <circle
        cx={r}
        cy={r}
        r={inner - 14}
        stroke="#C6982F"
        strokeWidth="0.6"
        fill="none"
        opacity="0.6"
      />
      {marks}
    </svg>
  );
}
