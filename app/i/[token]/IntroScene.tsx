"use client";

import { useEffect, useMemo, useState } from "react";

const TOTAL_MS = 7200;
const EMBER_COUNT = 20;
const DUST_COUNT = 26;
const GLINT_COUNT = 16;
const PETAL_COUNT = 10;
const RAY_COUNT = 14;
const BURST_COUNT = 30;

export default function IntroScene({
  coupleInitials,
  coupleNames = "Эрдэнэмандал & Чанцалдулам",
  onDone,
  onSkip,
}: {
  coupleInitials?: string;
  coupleNames?: string;
  onDone: () => void;
  onSkip?: () => void;
}) {
  const [fadingOut, setFadingOut] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
  }, []);

  useEffect(() => {
    const total = reduced ? 500 : TOTAL_MS;
    const doneTimer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onDone, reduced ? 200 : 750);
    }, total);
    return () => clearTimeout(doneTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

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
        const delay = 3.2 + (i / EMBER_COUNT) * 2.8 + (i % 4) * 0.15;
        const duration = 2.6 + (i % 5) * 0.45;
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
        const delay = 2.6 + ((i * 0.21) % 2.6);
        const duration = 1.6 + (i % 4) * 0.35;
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
        const delay = 3.4 + ((i * 0.31) % 3.6);
        const duration = 5.5 + (i % 4) * 0.8;
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
        delay: 0.1 + (i % 3) * 0.06,
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
        const delay = 2.55 + (i % 4) * 0.02;
        const gold = i % 2 === 0;
        return { dx, dy, size, delay, gold, key: i };
      }),
    [],
  );

  return (
    <div
      aria-hidden={fadingOut}
      className={`intro${reduced ? " intro--reduced" : ""}${
        fadingOut ? " intro--closing" : ""
      }`}
    >
      {!reduced && (
        <>
          <div className="intro-vignette" />

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
              style={{ animationDelay: `${5.1 + i * 0.026}s` }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </span>
      </div>

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
        .intro--closing .intro-logo,
        .intro--closing .intro-rings,
        .intro--closing .intro-hearth,
        .intro--closing .intro-hearth-core,
        .intro--closing .intro-sky,
        .intro--closing .intro-flame,
        .intro--closing .intro-rays,
        .intro--closing .intro-sweep,
        .intro--closing .intro-bloom {
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

        /* ---- Duality: sky above, fire below ---- */
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
            sky-descend 2.4s ease-out 0.3s forwards,
            sky-flicker 3s ease-in-out 2s infinite;
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

        /* ---- Radiant rays ---- */
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
          animation: ray-unfurl 1.6s ease-out forwards;
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

        /* ---- Two interlocking rings ---- */
        .intro-rings {
          position: absolute;
          left: 50%;
          top: 52%;
          width: min(80vw, 420px);
          height: min(65vw, 342px);
          transform: translate(-50%, -50%) scale(0.94);
          opacity: 0;
          animation: rings-hold 0.6s ease 1.9s forwards;
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
          animation-duration: 1.5s;
          animation-delay: 0.1s;
        }
        .ring-trace--sky {
          animation-name: ring-draw;
          animation-duration: 1.5s;
          animation-delay: 0.55s;
          filter: drop-shadow(0 0 5px rgba(150, 220, 255, 0.4));
        }
        @keyframes ring-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* ---- Burst where the rings cross (the union) ---- */
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
          animation: burst-flash 0.7s ease-out 2.5s forwards;
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
          animation-duration: 0.85s;
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

        /* ---- Hearth glow (earth / fire, below) ---- */
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
            hearth-rise 2.4s ease-out 0.5s forwards,
            hearth-flicker 2.6s ease-in-out 2s infinite;
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
            core-pulse 2.2s ease-out 1.1s forwards,
            hearth-flicker 1.9s ease-in-out 2.6s infinite;
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

        /* ---- Flame licks ---- */
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
            flame-a-in 1.4s ease 2.9s forwards,
            flame-flicker 1.8s ease-in-out 4.3s infinite;
        }
        .flame-lick--b {
          width: 18px;
          height: 42px;
          transform: translate(-140%, 6px);
          animation:
            flame-b-in 1.4s ease 3.1s forwards,
            flame-flicker 1.5s ease-in-out 4.5s infinite;
        }
        .flame-lick--c {
          width: 18px;
          height: 42px;
          transform: translate(40%, 6px);
          animation:
            flame-c-in 1.4s ease 3.2s forwards,
            flame-flicker 1.7s ease-in-out 4.6s infinite;
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

        /* ---- Embers ---- */
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

        /* ---- Gold dust shimmer (present from the very start) ---- */
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

        /* ---- Bright four-point glints near the rings ---- */
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

        /* ---- Drifting gold petals ---- */
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

        /* ---- Light sweep across the frame ---- */
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
          animation: sweep-pass 1.4s ease-out 3.3s forwards;
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

        /* ---- Full bloom before settle ---- */
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
          animation: bloom-fill 1.7s ease-in 4s forwards;
        }
        @keyframes bloom-fill {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 0.75;
          }
        }

        /* ---- Monogram + names ---- */
        .intro-logo {
          position: absolute;
          inset: 0;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          opacity: 0;
          filter: blur(6px);
          animation:
            logo-in 1.1s ease 4.55s forwards,
            logo-breathe 3.4s ease-in-out 5.8s infinite;
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
          width: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(230, 190, 130, 0.8),
            transparent
          );
          animation: rule-grow 900ms ease 4.8s forwards;
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
          .ember,
          .dust-mote,
          .glint,
          .petal {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
