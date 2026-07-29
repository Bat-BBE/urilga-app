"use client";

import { useEffect, useMemo, useState } from "react";
import { useMusic } from "./MusicProvider";

// The whole reveal sequence (rings tracing, burst, pillar, flame, names)
// now runs ~11s after the tap — slow and ceremonial rather than rushed.
const TOTAL_MS = 11000;
const EMBER_COUNT = 20;
const DUST_COUNT = 26;
const GLINT_COUNT = 16;
const PETAL_COUNT = 10;
const RAY_COUNT = 14;
const BURST_COUNT = 30;
const CONVERGE_COUNT = 22;
const MANDALA_TICKS = 24;
const GATE_TICKS = 40;

export default function IntroScene({
  coupleInitials,
  coupleNames = "Мөнгөншагай & Пүрэвням",
  musicVolume = 0.55,
  onDone,
  onSkip,
}: {
  coupleInitials?: string;
  coupleNames?: string;
  /** Target volume for the music once it has faded in (0 - 1) */
  musicVolume?: number;
  onDone: () => void;
  onSkip?: () => void;
}) {
  const [fadingOut, setFadingOut] = useState(false);
  const [reduced, setReduced] = useState(false);

  // The big ceremonial sequence — and the music — only begin once the
  // visitor has actually tapped. Browsers refuse to play audio (and we
  // don't want the "show" to run silently) until there has been a real
  // user gesture, so we gate the reveal behind a single tap. The soft
  // ambient background (mandala, dust, corner frame) runs the whole
  // time regardless, so the gate screen never feels empty.
  const [started, setStarted] = useState(false);

  const { play } = useMusic();

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
  }, []);

  useEffect(() => {
    if (!started) return;
    const total = reduced ? 500 : TOTAL_MS;
    const doneTimer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onDone, reduced ? 200 : 750);
    }, total);
    return () => clearTimeout(doneTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, reduced]);

  // Note: music is intentionally left playing when IntroScene closes —
  // it's meant to carry on into the rest of the invitation. Call
  // useMusic().fadeOut() from wherever the site's music should actually end.

  function beginIntro() {
    if (started) return;
    setStarted(true);
    // Called directly from a click/tap handler — this is the user
    // gesture browsers require before they'll allow audio.play().
    play(musicVolume, 1800);
  }

  function handleSkip() {
    setFadingOut(true);
    setTimeout(() => {
      onSkip ? onSkip() : onDone();
    }, 300);
  }

  const embers = useMemo(
    () =>
      Array.from({ length: EMBER_COUNT }).map((_, i) => {
        const left = 50 + Math.sin(i * 2.1) * 26 + (i % 3) * 2.5;
        const delay = 4.48 + (i / EMBER_COUNT) * 3.92 + (i % 4) * 0.21;
        const duration = 3.64 + (i % 5) * 0.63;
        const size = 2.5 + (i % 4) * 2;
        const drift = (i % 2 === 0 ? 1 : -1) * (14 + (i % 6) * 6);
        return { left, delay, duration, size, drift, key: i };
      }),
    [],
  );

  const dust = useMemo(
    () =>
      Array.from({ length: DUST_COUNT }).map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const delay = 0.3 + ((i * 0.17) % 3.4);
        const duration = 3 + (i % 6) * 0.5;
        const size = 1 + (i % 3);
        return { left, top, delay, duration, size, key: i };
      }),
    [],
  );

  // Four-point glints: brighter, star-shaped twinkles scattered near center
  const glints = useMemo(
    () =>
      Array.from({ length: GLINT_COUNT }).map((_, i) => {
        const angle = (360 / GLINT_COUNT) * i + (i % 2) * 11;
        const radius = 22 + ((i * 13) % 30);
        const x = 50 + Math.cos((angle * Math.PI) / 180) * radius * 0.9;
        const y = 50 + Math.sin((angle * Math.PI) / 180) * radius * 0.55;
        const delay = 3.64 + ((i * 0.294) % 3.64);
        const duration = 2.24 + (i % 4) * 0.49;
        const size = 5 + (i % 3) * 3;
        const hue = i % 2 === 0 ? "#ffe9c2" : "#bfe9ff";
        return { x, y, delay, duration, size, hue, key: i };
      }),
    [],
  );

  const petals = useMemo(
    () =>
      Array.from({ length: PETAL_COUNT }).map((_, i) => {
        const left = (i * 91) % 100;
        const delay = 4.76 + ((i * 0.434) % 5.04);
        const duration = 7.7 + (i % 4) * 1.12;
        const size = 8 + (i % 3) * 4;
        const spin = (i % 2 === 0 ? 1 : -1) * (220 + (i % 3) * 90);
        const sway = 30 + (i % 5) * 12;
        return { left, delay, duration, size, spin, sway, key: i };
      }),
    [],
  );

  const rays = useMemo(
    () =>
      Array.from({ length: RAY_COUNT }).map((_, i) => ({
        rotate: (360 / RAY_COUNT) * i,
        delay: 0.14 + (i % 3) * 0.084,
        key: i,
      })),
    [],
  );

  // Burst sparks fired outward from the point the two rings cross —
  // alternating gold (fire/earth) and cyan (sky) to read as one union.
  const burst = useMemo(
    () =>
      Array.from({ length: BURST_COUNT }).map((_, i) => {
        const angle = (360 / BURST_COUNT) * i + (i % 3) * 4;
        const distance = 70 + ((i * 17) % 90);
        const dx = Math.cos((angle * Math.PI) / 180) * distance;
        const dy = Math.sin((angle * Math.PI) / 180) * distance * 0.82;
        const size = 2 + (i % 3) * 1.6;
        const delay = 3.57 + (i % 4) * 0.028;
        const gold = i % 2 === 0;
        return { dx, dy, size, delay, gold, key: i };
      }),
    [],
  );

  // Motes that spiral inward toward the center just before the rings
  // appear — builds anticipation for the "coming together" moment.
  const converge = useMemo(
    () =>
      Array.from({ length: CONVERGE_COUNT }).map((_, i) => {
        const angle = (360 / CONVERGE_COUNT) * i + (i % 3) * 6;
        const radius = 128 + ((i * 11) % 90);
        const sx = Math.cos((angle * Math.PI) / 180) * radius;
        const sy = Math.sin((angle * Math.PI) / 180) * radius * 0.72;
        const delay = 0.77 + (i % 7) * 0.126;
        const duration = 1.54 + (i % 5) * 0.196;
        const gold = i % 2 === 0;
        return { sx, sy, delay, duration, gold, key: i };
      }),
    [],
  );

  const mandalaTicks = useMemo(
    () =>
      Array.from({ length: MANDALA_TICKS }).map((_, i) => {
        const a = (i / MANDALA_TICKS) * Math.PI * 2;
        const r1 = 182;
        const r2 = i % 6 === 0 ? 148 : 164;
        // Fixed to 4 decimal places so the server-rendered markup and the
        // client's first render produce byte-identical numbers — plain
        // Math.cos/sin values can differ in their last digit between
        // server and browser floating point, which triggers a hydration
        // mismatch warning even though the values are visually identical.
        return {
          x1: (200 + Math.cos(a) * r1).toFixed(4),
          y1: (200 + Math.sin(a) * r1).toFixed(4),
          x2: (200 + Math.cos(a) * r2).toFixed(4),
          y2: (200 + Math.sin(a) * r2).toFixed(4),
          key: i,
          major: i % 6 === 0,
        };
      }),
    [],
  );

  // A small decorative ring of ticks around the tap-gate seal, echoing
  // the larger mandala further out — makes the gate read as a designed
  // object rather than a placeholder screen.
  const gateTicks = useMemo(
    () =>
      Array.from({ length: GATE_TICKS }).map((_, i) => {
        const a = (i / GATE_TICKS) * Math.PI * 2;
        const r1 = 58;
        const r2 = i % 5 === 0 ? 48 : 53;
        return {
          x1: (60 + Math.cos(a) * r1).toFixed(3),
          y1: (60 + Math.sin(a) * r1).toFixed(3),
          x2: (60 + Math.cos(a) * r2).toFixed(3),
          y2: (60 + Math.sin(a) * r2).toFixed(3),
          key: i,
          major: i % 5 === 0,
        };
      }),
    [],
  );

  return (
    <div
      aria-hidden={fadingOut}
      className={`intro${reduced ? " intro--reduced" : ""}${
        fadingOut ? " intro--closing" : ""
      }${started ? " intro--started" : ""}`}
    >
      {/* ---- Ambient backdrop: alive from the very first frame, on the
          gate screen as much as during the reveal ---- */}
      {!reduced && (
        <>
          <div className="intro-vignette" />

          <svg
            className="intro-mandala"
            viewBox="0 0 400 400"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            {mandalaTicks.map((t) => (
              <line
                key={t.key}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.major ? "#8fd9ff" : "#f3d9a4"}
                strokeWidth={t.major ? 0.9 : 0.5}
                opacity={t.major ? 0.4 : 0.28}
              />
            ))}
            <circle
              cx="200"
              cy="200"
              r="182"
              stroke="#f3d9a4"
              strokeWidth="0.6"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="200"
              cy="200"
              r="148"
              stroke="#8fd9ff"
              strokeWidth="0.5"
              fill="none"
              opacity="0.22"
            />
          </svg>

          <div className="intro-dust">
            {dust.map((d) => (
              <span
                key={d.key}
                className="dust-mote"
                style={{
                  left: `${d.left}%`,
                  top: `${d.top}%`,
                  width: d.size,
                  height: d.size,
                  animationDelay: `${d.delay}s`,
                  animationDuration: `${d.duration}s`,
                }}
              />
            ))}
          </div>

          <div className="intro-corners" aria-hidden>
            <span className="corner-flourish corner-flourish--tl" />
            <span className="corner-flourish corner-flourish--tr" />
            <span className="corner-flourish corner-flourish--bl" />
            <span className="corner-flourish corner-flourish--br" />
          </div>
        </>
      )}

      {/* ---- Tap gate: a small designed seal, not a blank screen ---- */}
      {!started && (
        <button
          type="button"
          className="intro-gate"
          onClick={beginIntro}
          aria-label="Дарж нээх"
        >
          <span className="intro-gate-glow" />
          <span className="intro-gate-seal">
            <svg
              className="intro-gate-ticks"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              {gateTicks.map((t) => (
                <line
                  key={t.key}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke="#f3d9a4"
                  strokeWidth={t.major ? 1.1 : 0.6}
                  opacity={t.major ? 0.8 : 0.45}
                />
              ))}
              <circle
                cx="60"
                cy="60"
                r="58"
                fill="none"
                stroke="#f3d9a4"
                strokeWidth="0.6"
                opacity="0.5"
              />
            </svg>
            <span className="intro-gate-initials">{coupleInitials ?? "♥"}</span>
          </span>
          <span className="intro-gate-welcome">Тавтай морилно уу</span>
          <span className="intro-gate-hint">
            Дарж нээнэ үү
            <span className="intro-gate-chevron" aria-hidden>
              ﹀
            </span>
          </span>
        </button>
      )}

      {started && !reduced && (
        <>
          {/* Duality backdrop: sky above, fire below */}
          <div className="intro-sky" />
          <div className="intro-hearth" />
          <div className="intro-hearth-core" />

          {/* Radiant rays unfurling from center */}
          <div className="intro-rays">
            {rays.map((r) => (
              <span
                key={r.key}
                className="ray"
                style={
                  {
                    "--r": `${r.rotate}deg`,
                    transform: `rotate(${r.rotate}deg)`,
                    animationDelay: `${r.delay}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Motes spiralling inward — anticipation before the rings meet */}
          <div className="intro-converge">
            {converge.map((c) => (
              <span
                key={c.key}
                className={`converge-mote ${
                  c.gold ? "converge-mote--gold" : "converge-mote--sky"
                }`}
                style={
                  {
                    animationDelay: `${c.delay}s`,
                    animationDuration: `${c.duration}s`,
                    "--sx": `${c.sx}px`,
                    "--sy": `${c.sy}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Two interlocking rings — gold (earth/fire) and sky-blue — trace and cross */}
          <svg
            className="intro-rings"
            viewBox="0 0 320 260"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffe3ab" stopOpacity="0" />
                <stop offset="45%" stopColor="#ffcf7a" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#ff9a4d" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ringSky" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eaf8ff" stopOpacity="0" />
                <stop offset="45%" stopColor="#8fd9ff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#4fb6e6" stopOpacity="0" />
              </linearGradient>
            </defs>

            <circle
              cx="122"
              cy="130"
              r="92"
              fill="none"
              stroke="url(#ringGold)"
              strokeWidth="2.2"
              strokeLinecap="round"
              pathLength={100}
              className="ring-trace ring-trace--gold"
            />
            <circle
              cx="198"
              cy="130"
              r="92"
              fill="none"
              stroke="url(#ringSky)"
              strokeWidth="2.2"
              strokeLinecap="round"
              pathLength={100}
              className="ring-trace ring-trace--sky"
            />
          </svg>

          {/* Burst at the point the rings cross */}
          <div className="intro-burst-flash" />
          <div className="intro-shockwave" />
          <div className="intro-burst">
            {burst.map((b) => (
              <span
                key={b.key}
                className={`spark ${b.gold ? "spark--gold" : "spark--sky"}`}
                style={
                  {
                    width: b.size,
                    height: b.size,
                    animationDelay: `${b.delay}s`,
                    "--dx": `${b.dx}px`,
                    "--dy": `${b.dy}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* A pillar of light joining hearth (earth/fire) and sky — the union */}
          <div className="intro-pillar" />

          <div className="intro-flame">
            <span className="flame-lick flame-lick--a" />
            <span className="flame-lick flame-lick--b" />
            <span className="flame-lick flame-lick--c" />
          </div>

          <div className="intro-embers">
            {embers.map((e) => (
              <span
                key={e.key}
                className="ember"
                style={
                  {
                    left: `${e.left}%`,
                    width: e.size,
                    height: e.size,
                    animationDelay: `${e.delay}s`,
                    animationDuration: `${e.duration}s`,
                    "--drift": `${e.drift}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="intro-glints">
            {glints.map((g) => (
              <span
                key={g.key}
                className="glint"
                style={
                  {
                    left: `${g.x}%`,
                    top: `${g.y}%`,
                    width: g.size,
                    height: g.size,
                    background: g.hue,
                    animationDelay: `${g.delay}s`,
                    animationDuration: `${g.duration}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="intro-petals">
            {petals.map((p) => (
              <span
                key={p.key}
                className="petal"
                style={
                  {
                    left: `${p.left}%`,
                    width: p.size,
                    height: p.size * 0.75,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`,
                    "--spin": `${p.spin}deg`,
                    "--sway": `${p.sway}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="intro-sweep" />
          <div className="intro-bloom" />
        </>
      )}

      {started && (
        <div className="intro-logo">
          {coupleInitials ? (
            <span className="intro-initials">{coupleInitials}</span>
          ) : null}
          <span className="intro-rule" />
          <span className="intro-names">
            {coupleNames.split("").map((ch, i) => (
              <span
                key={i}
                className="intro-char"
                style={{ animationDelay: `${7.14 + i * 0.0364}s` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </span>
        </div>
      )}

      {started && onSkip && (
        <button
          type="button"
          className="intro-skip"
          onClick={handleSkip}
          aria-label="Алгасах"
        >
          Алгасах →
        </button>
      )}

      <div className="intro-close-iris" />
      <style jsx>{`
        .intro {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #0b0706;
          overflow: hidden;
          pointer-events: auto;
        }

        /* ================= Ambient backdrop (always on) ================= */
        .intro-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 55%,
            transparent 40%,
            rgba(0, 0, 0, 0.6) 100%
          );
          z-index: 1;
        }
        .intro-mandala {
          position: absolute;
          left: 50%;
          top: 52%;
          width: min(120vw, 640px);
          height: min(120vw, 640px);
          transform: translate(-50%, -50%);
          opacity: 0;
          z-index: 0;
          animation:
            mandala-in 2s ease 0.15s forwards,
            mandala-spin 110s linear infinite;
        }
        @keyframes mandala-in {
          to {
            opacity: 0.45;
          }
        }
        @keyframes mandala-spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .intro-dust {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .dust-mote {
          position: absolute;
          border-radius: 50%;
          background: #ffe9c2;
          opacity: 0;
          animation-name: dust-twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        @keyframes dust-twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.6);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.3);
          }
        }
        .intro-corners {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
        }
        .corner-flourish {
          position: absolute;
          width: 64px;
          height: 64px;
          opacity: 0;
          animation: corner-in 1.2s ease 0.5s forwards;
        }
        .corner-flourish::before {
          content: "";
          position: absolute;
          inset: 0;
        }
        .corner-flourish--tl {
          top: 22px;
          left: 22px;
        }
        .corner-flourish--tl::before {
          border-top: 1px solid rgba(243, 217, 164, 0.4);
          border-left: 1px solid rgba(243, 217, 164, 0.4);
        }
        .corner-flourish--tr {
          top: 22px;
          right: 22px;
        }
        .corner-flourish--tr::before {
          border-top: 1px solid rgba(243, 217, 164, 0.4);
          border-right: 1px solid rgba(243, 217, 164, 0.4);
        }
        .corner-flourish--bl {
          bottom: 22px;
          left: 22px;
        }
        .corner-flourish--bl::before {
          border-bottom: 1px solid rgba(243, 217, 164, 0.4);
          border-left: 1px solid rgba(243, 217, 164, 0.4);
        }
        .corner-flourish--br {
          bottom: 22px;
          right: 22px;
        }
        .corner-flourish--br::before {
          border-bottom: 1px solid rgba(243, 217, 164, 0.4);
          border-right: 1px solid rgba(243, 217, 164, 0.4);
        }
        @keyframes corner-in {
          to {
            opacity: 1;
          }
        }

        /* ================= Tap gate — a small designed seal ================= */
        .intro-gate {
          position: absolute;
          inset: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          background: radial-gradient(
            ellipse at 50% 55%,
            rgba(26, 18, 12, 0.35) 0%,
            rgba(11, 7, 6, 0.75) 70%
          );
          border: none;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          animation: gate-in 900ms ease both;
        }
        @keyframes gate-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .intro-gate-glow {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 207, 122, 0.22) 0%,
            transparent 70%
          );
          filter: blur(6px);
          animation: gate-glow-pulse 3.4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes gate-glow-pulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(0.94);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        .intro-gate-seal {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: gate-seal-breathe 4s ease-in-out infinite;
        }
        @keyframes gate-seal-breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.035);
          }
        }
        .intro-gate-ticks {
          position: absolute;
          top: 60px;
          left: 60px;
          width: 100%;
          height: 100%;
          animation: mandala-spin 70s linear infinite reverse;
        }
        .intro-gate-initials {
          position: relative;
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-weight: 600;
          font-size: 1.55rem;
          letter-spacing: 0.06em;
          color: #f3d9a4;
          text-shadow: 0 0 22px rgba(255, 190, 110, 0.55);
        }
        .intro-gate-welcome {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-size: 1.05rem;
          letter-spacing: 0.04em;
          color: #e9d9bd;
          opacity: 0.9;
          animation: gate-text-in 900ms ease 200ms both;
        }
        .intro-gate-hint {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: "PT Sans", sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #e6c68b;
          opacity: 0.85;
          animation:
            gate-text-in 900ms ease 400ms both,
            gate-hint-pulse 2s ease-in-out 1.3s infinite;
        }
        .intro-gate-chevron {
          display: inline-block;
          font-size: 0.9em;
          transform: translateY(-1px);
          animation: gate-chevron-bounce 1.6s ease-in-out 1.3s infinite;
        }
        @keyframes gate-text-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes gate-hint-pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes gate-chevron-bounce {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: translateY(4px);
            opacity: 1;
          }
        }
        .intro--started .intro-gate,
        .intro--closing .intro-gate {
          display: none;
        }

        .intro--closing .intro-logo,
        .intro--closing .intro-rings,
        .intro--closing .intro-hearth,
        .intro--closing .intro-hearth-core,
        .intro--closing .intro-sky,
        .intro--closing .intro-flame,
        .intro--closing .intro-rays,
        .intro--closing .intro-sweep,
        .intro--closing .intro-bloom,
        .intro--closing .intro-mandala,
        .intro--closing .intro-corners,
        .intro--closing .intro-skip {
          transition: opacity 400ms ease;
          opacity: 0;
        }
        .intro-close-iris {
          position: absolute;
          inset: 0;
          z-index: 10;
          background: #0b0706;
          pointer-events: none;
          clip-path: circle(0% at 50% 55%);
          transition: clip-path 750ms cubic-bezier(0.7, 0, 0.3, 1);
        }
        .intro--closing .intro-close-iris {
          clip-path: circle(150% at 50% 55%);
        }
        .intro--reduced .intro-close-iris {
          clip-path: circle(0% at 50% 55%) !important;
          transition: none;
        }
        .intro--reduced.intro--closing {
          transition: opacity 200ms ease;
          opacity: 0;
        }

        /* ================= Duality: sky above, fire below ================= */
        .intro-sky {
          position: absolute;
          left: 50%;
          top: -18%;
          width: 70vw;
          max-width: 460px;
          height: 60vw;
          max-height: 400px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(140, 214, 255, 0.55) 0%,
            rgba(90, 170, 230, 0.28) 40%,
            transparent 72%
          );
          opacity: 0;
          filter: blur(4px);
          animation:
            sky-descend 3.2s ease-out 0.4s forwards,
            sky-flicker 3.6s ease-in-out 3s infinite;
        }
        @keyframes sky-descend {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-30px) scale(0.85);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
        @keyframes sky-flicker {
          0%,
          100% {
            opacity: 0.75;
          }
          50% {
            opacity: 0.95;
          }
        }

        /* ================= Radiant rays unfurling from center ================= */
        .intro-rays {
          position: absolute;
          left: 50%;
          top: 52%;
          width: 0;
          height: 0;
          z-index: 1;
        }
        .ray {
          position: absolute;
          left: 0;
          top: 0;
          width: 1px;
          height: 46vh;
          max-height: 320px;
          transform-origin: top center;
          background: linear-gradient(
            to bottom,
            rgba(255, 226, 180, 0.5),
            transparent 75%
          );
          opacity: 0;
          animation: ray-unfurl 2.24s ease-out forwards;
        }
        @keyframes ray-unfurl {
          0% {
            opacity: 0;
            transform: rotate(var(--r, 0deg)) scaleY(0.2);
          }
          25% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: rotate(var(--r, 0deg)) scaleY(1);
          }
        }

        /* ================= Motes converging toward the center ================= */
        .intro-converge {
          position: absolute;
          left: 50%;
          top: 52%;
          width: 0;
          height: 0;
          z-index: 2;
        }
        .converge-mote {
          position: absolute;
          left: 0;
          top: 0;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          opacity: 0;
          animation-name: converge-in;
          animation-timing-function: cubic-bezier(0.3, 0, 0.2, 1);
          animation-fill-mode: forwards;
        }
        .converge-mote--gold {
          background: radial-gradient(
            circle,
            #fff3d6 0%,
            #ffb865 70%,
            transparent 100%
          );
          box-shadow: 0 0 6px rgba(255, 190, 110, 0.6);
        }
        .converge-mote--sky {
          background: radial-gradient(
            circle,
            #eaf8ff 0%,
            #7fd0ff 70%,
            transparent 100%
          );
          box-shadow: 0 0 6px rgba(140, 210, 255, 0.6);
        }
        @keyframes converge-in {
          0% {
            opacity: 0;
            transform: translate(var(--sx), var(--sy)) scale(1.4);
          }
          18% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(0, 0) scale(0.2);
          }
        }

        /* ================= Two interlocking rings ================= */
        .intro-rings {
          position: absolute;
          left: 50%;
          top: 52%;
          width: min(80vw, 420px);
          height: min(65vw, 342px);
          transform: translate(-50%, -50%) scale(0.94);
          opacity: 0;
          animation: rings-hold 0.84s ease 2.66s forwards;
          z-index: 2;
        }
        @keyframes rings-hold {
          to {
            opacity: 1;
          }
        }
        .ring-trace {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation-timing-function: cubic-bezier(0.65, 0, 0.35, 1);
          animation-fill-mode: forwards;
          filter: drop-shadow(0 0 5px rgba(255, 210, 150, 0.35));
        }
        .ring-trace--gold {
          animation-name: ring-draw;
          animation-duration: 2.1s;
          animation-delay: 0.14s;
        }
        .ring-trace--sky {
          animation-name: ring-draw;
          animation-duration: 2.1s;
          animation-delay: 0.77s;
          filter: drop-shadow(0 0 5px rgba(150, 220, 255, 0.4));
        }
        @keyframes ring-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* ================= Burst where the rings cross (the union) ================= */
        .intro-burst-flash {
          position: absolute;
          left: 50%;
          top: 52%;
          width: 46vw;
          max-width: 240px;
          height: 46vw;
          max-height: 240px;
          transform: translate(-50%, -50%) scale(0.3);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #ffffff 0%,
            #ffe4b3 30%,
            rgba(140, 214, 255, 0.5) 60%,
            transparent 78%
          );
          opacity: 0;
          z-index: 2;
          animation: burst-flash 0.98s ease-out 3.5s forwards;
        }
        @keyframes burst-flash {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.25);
          }
          35% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.15);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.9);
          }
        }
        .intro-shockwave {
          position: absolute;
          left: 50%;
          top: 52%;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 230, 190, 0.8);
          transform: translate(-50%, -50%) scale(0.4);
          opacity: 0;
          z-index: 2;
          animation: shockwave-out 1.54s cubic-bezier(0.2, 0.7, 0.3, 1) 3.57s
            forwards;
        }
        @keyframes shockwave-out {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.4);
          }
          15% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(9);
          }
        }
        .intro-burst {
          position: absolute;
          left: 50%;
          top: 52%;
          width: 0;
          height: 0;
          z-index: 3;
        }
        .spark {
          position: absolute;
          left: 0;
          top: 0;
          border-radius: 50%;
          opacity: 0;
          animation-name: spark-fire;
          animation-timing-function: ease-out;
          animation-duration: 1.19s;
          animation-fill-mode: forwards;
        }
        .spark--gold {
          background: radial-gradient(
            circle,
            #fff3d6 0%,
            #ffab5e 70%,
            transparent 100%
          );
        }
        .spark--sky {
          background: radial-gradient(
            circle,
            #f0fbff 0%,
            #7fd0ff 70%,
            transparent 100%
          );
        }
        @keyframes spark-fire {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(1);
          }
          12% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--dx), var(--dy)) scale(0.3);
          }
        }

        /* ================= Pillar of light joining hearth and sky ================= */
        .intro-pillar {
          position: absolute;
          left: 50%;
          bottom: 8%;
          width: 3px;
          height: 0;
          transform: translateX(-50%);
          background: linear-gradient(
            to top,
            rgba(255, 207, 122, 0.9) 0%,
            rgba(255, 240, 210, 0.65) 45%,
            rgba(140, 214, 255, 0.55) 80%,
            transparent 100%
          );
          filter: blur(1.5px);
          opacity: 0;
          z-index: 2;
          animation:
            pillar-rise 1.82s cubic-bezier(0.2, 0.8, 0.2, 1) 3.57s forwards,
            pillar-fade 1.26s ease 5.39s forwards;
        }
        @keyframes pillar-rise {
          0% {
            height: 0;
            opacity: 0;
          }
          25% {
            opacity: 0.9;
          }
          100% {
            height: 76vh;
            opacity: 0.9;
          }
        }
        @keyframes pillar-fade {
          to {
            opacity: 0;
          }
        }

        /* ================= Hearth glow (earth / fire, below) ================= */
        .intro-hearth {
          position: absolute;
          left: 50%;
          bottom: -12%;
          width: 64vw;
          max-width: 440px;
          height: 64vw;
          max-height: 440px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255, 154, 77, 0.85) 0%,
            rgba(255, 138, 61, 0.4) 35%,
            transparent 70%
          );
          opacity: 0;
          filter: blur(3px);
          animation:
            hearth-rise 3.2s ease-out 0.7s forwards,
            hearth-flicker 3.2s ease-in-out 3s infinite;
        }
        .intro-hearth-core {
          position: absolute;
          left: 50%;
          bottom: 6%;
          width: 34vw;
          max-width: 180px;
          height: 34vw;
          max-height: 180px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #fff3d6 0%,
            #ffcf7a 40%,
            transparent 75%
          );
          opacity: 0;
          filter: blur(1px);
          mix-blend-mode: screen;
          animation:
            core-pulse 2.8s ease-out 1.5s forwards,
            hearth-flicker 2.4s ease-in-out 3.6s infinite;
        }
        @keyframes hearth-rise {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.65);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scale(1);
          }
        }
        @keyframes core-pulse {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.5);
          }
          100% {
            opacity: 0.9;
            transform: translateX(-50%) scale(1);
          }
        }
        @keyframes hearth-flicker {
          0%,
          100% {
            opacity: 0.85;
          }
          50% {
            opacity: 1;
          }
        }

        /* ================= Flame licks ================= */
        .intro-flame {
          position: absolute;
          left: 50%;
          bottom: 9%;
          width: 1px;
          height: 1px;
          z-index: 2;
          mix-blend-mode: screen;
        }
        .flame-lick {
          position: absolute;
          bottom: 0;
          left: 50%;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          background: radial-gradient(
            circle at 50% 70%,
            #fff6df 0%,
            #ffcf7a 45%,
            rgba(255, 138, 61, 0) 80%
          );
          opacity: 0;
          transform-origin: bottom center;
        }
        .flame-lick--a {
          width: 30px;
          height: 60px;
          transform: translateX(-50%);
          animation:
            flame-a-in 1.96s ease 4.06s forwards,
            flame-flicker 2.2s ease-in-out 6.02s infinite;
        }
        .flame-lick--b {
          width: 18px;
          height: 42px;
          transform: translate(-140%, 6px);
          animation:
            flame-b-in 1.96s ease 4.34s forwards,
            flame-flicker 1.9s ease-in-out 6.3s infinite;
        }
        .flame-lick--c {
          width: 18px;
          height: 42px;
          transform: translate(40%, 6px);
          animation:
            flame-c-in 1.96s ease 4.48s forwards,
            flame-flicker 2.1s ease-in-out 6.44s infinite;
        }
        @keyframes flame-a-in {
          0% {
            opacity: 0;
            transform: translateX(-50%) scaleY(0.3);
          }
          100% {
            opacity: 0.95;
            transform: translateX(-50%) scaleY(1);
          }
        }
        @keyframes flame-b-in {
          0% {
            opacity: 0;
            transform: translate(-140%, 6px) scaleY(0.3);
          }
          100% {
            opacity: 0.8;
            transform: translate(-140%, 6px) scaleY(1);
          }
        }
        @keyframes flame-c-in {
          0% {
            opacity: 0;
            transform: translate(40%, 6px) scaleY(0.3);
          }
          100% {
            opacity: 0.8;
            transform: translate(40%, 6px) scaleY(1);
          }
        }
        @keyframes flame-flicker {
          0%,
          100% {
            transform: scaleY(1) scaleX(1) skewX(0deg);
          }
          30% {
            transform: scaleY(1.08) scaleX(0.94) skewX(-2deg);
          }
          60% {
            transform: scaleY(0.94) scaleX(1.05) skewX(2deg);
          }
        }

        /* ================= Embers ================= */
        .intro-embers {
          position: absolute;
          inset: 0;
          z-index: 2;
        }
        .ember {
          position: absolute;
          bottom: 14%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            #ffe3ab 0%,
            #ff9a4d 60%,
            transparent 100%
          );
          opacity: 0;
          animation-name: ember-rise;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        @keyframes ember-rise {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(1);
          }
          12% {
            opacity: 0.95;
          }
          100% {
            opacity: 0;
            transform: translate(var(--drift), -260px) scale(0.4);
          }
        }

        /* ================= Bright four-point glints near the rings ================= */
        .intro-glints {
          position: absolute;
          inset: 0;
          z-index: 3;
        }
        .glint {
          position: absolute;
          opacity: 0;
          clip-path: polygon(
            50% 0%,
            63% 37%,
            100% 50%,
            63% 63%,
            50% 100%,
            37% 63%,
            0% 50%,
            37% 37%
          );
          animation-name: glint-twinkle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          filter: drop-shadow(0 0 4px rgba(255, 240, 210, 0.7));
        }
        @keyframes glint-twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.3) rotate(0deg);
          }
          50% {
            opacity: 0.95;
            transform: scale(1) rotate(25deg);
          }
        }

        /* ================= Drifting gold petals ================= */
        .intro-petals {
          position: absolute;
          inset: 0;
          z-index: 2;
        }
        .petal {
          position: absolute;
          top: -8%;
          border-radius: 100% 0 100% 0;
          background: linear-gradient(135deg, #ffdca3, #d99a52);
          opacity: 0;
          animation-name: petal-fall;
          animation-timing-function: ease-in;
          animation-fill-mode: forwards;
        }
        @keyframes petal-fall {
          0% {
            opacity: 0;
            transform: translate(0, 0) rotate(0deg);
          }
          10% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translate(var(--sway), 128vh) rotate(var(--spin));
          }
        }

        /* ================= Light sweep across the frame ================= */
        .intro-sweep {
          position: absolute;
          inset: -20% -50%;
          background: linear-gradient(
            75deg,
            transparent 42%,
            rgba(255, 230, 180, 0.28) 50%,
            transparent 58%
          );
          opacity: 0;
          transform: translateX(-30%);
          animation: sweep-pass 1.96s ease-out 4.62s forwards;
        }
        @keyframes sweep-pass {
          0% {
            opacity: 0;
            transform: translateX(-30%);
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(30%);
          }
        }

        /* ================= Full bloom before settle ================= */
        .intro-bloom {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 55%,
            #ffcf7a 0%,
            #f3b25a 30%,
            transparent 68%
          );
          opacity: 0;
          animation: bloom-fill 2.38s ease-in 5.6s forwards;
        }
        @keyframes bloom-fill {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.75;
          }
        }

        /* ================= Monogram + names ================= */
        .intro-logo {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          opacity: 0;
          filter: blur(6px);
          animation:
            logo-in 1.54s ease 6.37s forwards,
            logo-breathe 4.2s ease-in-out 8.12s infinite;
        }
        .intro--reduced .intro-logo {
          opacity: 1;
          filter: none;
          animation: none;
        }
        @keyframes logo-in {
          0% {
            opacity: 0;
            filter: blur(6px);
            transform: translateY(10px) scale(0.96);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0) scale(1);
          }
        }
        @keyframes logo-breathe {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-2px) scale(1.012);
          }
        }
        .intro-initials {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.6rem, 8vw, 4rem);
          letter-spacing: 0.14em;
          color: #f3d9a4;
          text-shadow: 0 0 44px rgba(255, 190, 110, 0.6);
        }
        .intro-rule {
          position: relative;
          width: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(230, 190, 130, 0.8),
            transparent
          );
          animation: rule-grow 1.26s ease 6.72s forwards;
        }
        .intro-rule::before,
        .intro-rule::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 5px;
          height: 5px;
          background: #f3d9a4;
          transform: translateY(-50%) rotate(45deg) scale(0);
          box-shadow: 0 0 6px rgba(243, 217, 164, 0.7);
          animation: rule-spark-in 500ms ease 7.84s forwards;
        }
        .intro-rule::before {
          left: -3px;
        }
        .intro-rule::after {
          right: -3px;
          animation-delay: 7.98s;
        }
        @keyframes rule-spark-in {
          to {
            transform: translateY(-50%) rotate(45deg) scale(1);
          }
        }
        @keyframes rule-grow {
          to {
            width: 64px;
          }
        }
        .intro-names {
          font-family: "PT Sans", sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #dad8d6;
          display: inline-flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .intro-char {
          opacity: 0;
          transform: translateY(4px);
          display: inline-block;
          animation: char-in 500ms ease forwards;
        }
        .intro--reduced .intro-char {
          opacity: 1;
          transform: none;
          animation: none;
        }
        @keyframes char-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .intro-skip {
          position: absolute;
          bottom: 28px;
          right: 28px;
          z-index: 11;
          background: transparent;
          border: 1px solid rgba(230, 190, 130, 0.35);
          color: #e6c68b;
          font-family: "PT Sans", sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 999px;
          cursor: pointer;
          opacity: 0.75;
          transition:
            opacity 200ms ease,
            background 200ms ease,
            transform 200ms ease;
        }
        .intro-skip:hover {
          opacity: 1;
          background: rgba(230, 190, 130, 0.1);
          transform: translateY(-1px);
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-hearth,
          .intro-hearth-core,
          .intro-sky,
          .intro-flame,
          .intro-bloom,
          .intro-sweep,
          .intro-rings,
          .intro-rays,
          .intro-burst,
          .intro-burst-flash,
          .intro-shockwave,
          .intro-pillar,
          .intro-mandala,
          .intro-converge,
          .intro-corners,
          .ember,
          .dust-mote,
          .glint,
          .petal,
          .converge-mote,
          .corner-flourish,
          .intro-gate-glow,
          .intro-gate-seal,
          .intro-gate-ticks {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
