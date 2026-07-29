"use client";

import { useMemo, useState } from "react";
import { CircularMotif, OrnamentDivider, OrnateCorner } from "./Ornaments";

export default function CoverScreen({
  coupleNames = "Эрдэнэмандал & Чанцалдулам",
  eventLabel,
  dateDisplay,
  onOpen,
}: {
  coupleNames: string;
  eventLabel: string;
  dateDisplay: string;
  onOpen: () => void;
}) {
  const [opening, setOpening] = useState(false);

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, 1000);
  }

  const [first, second] = coupleNames.split("&").map((s) => s.trim());

  // Deterministic pseudo-random sparkle layout — Math.random() during render
  // causes a server/client markup mismatch in Next.js (the server renders one
  // set of positions, the client renders another). useMemo + a seeded formula
  // keeps the values stable across the hydration boundary while still
  // looking scattered.
  const sparkles = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const top = (i * 47.3) % 100;
        const left = (i * 71.7) % 100;
        const delay = (i * 0.37) % 5;
        const size = 1.5 + ((i * 13) % 30) / 10;
        const opacity = 0.1 + ((i * 7) % 40) / 100;
        const drift = i % 2 === 0 ? 1 : -1;
        return { top, left, delay, size, opacity, drift, key: i };
      }),
    [],
  );

  return (
    <button
      className={`cover${opening ? " cover--opening" : ""}`}
      onClick={handleOpen}
      aria-label="Урилгыг нээх"
    >
      <div className="cover-bg" aria-hidden>
        <div className="wave wave--1" />
        <div className="wave wave--2" />
        <div className="wave wave--3" />

        <div className="radial-glow glow--tl" />
        <div className="radial-glow glow--br" />
        <div className="radial-glow glow--center" />

        {/* Хээнүүд */}
        <div className="motif motif--tl">
          <CircularMotif size={320} opacity={0.14} />
        </div>
        <div className="motif motif--tr">
          <CircularMotif size={280} opacity={0.12} color="#C6982F" />
        </div>
        <div className="motif motif--bl">
          <CircularMotif size={240} opacity={0.08} />
        </div>
        <div className="motif motif--br">
          <CircularMotif size={200} opacity={0.06} color="#C6982F" />
        </div>

        <div className="sparkles">
          {sparkles.map((s) => (
            <span
              key={s.key}
              className="sparkle"
              style={
                {
                  top: `${s.top}%`,
                  left: `${s.left}%`,
                  animationDelay: `${s.delay}s`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  "--sparkle-opacity": s.opacity,
                  "--sparkle-drift": `${s.drift * 8}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>

      <div className="cover-stack">
        {/* <span className="corner-hee">
          <img
            src="/images/hee.png"
            alt="Ornament"
            className="absolute top-14 left-[136px] w-32 h-32 object-contain pointer-events-none"
          />
        </span> */}
        <div className="cover-frame">
          <div className="frame-glow" />
          <span className="corner corner--tl">
            <OrnateCorner size={80} />
          </span>
          <span className="corner corner--tr">
            <OrnateCorner size={80} />
          </span>
          <span className="corner corner--br">
            <OrnateCorner size={80} />
          </span>
          <span className="corner corner--bl">
            <OrnateCorner size={80} />
          </span>

          <div className="cover-body">
            <p className="cover-eyebrow">Урилга</p>

            <h1 className="cover-names">
              {first}
              <span className="cover-amp">&amp;</span>
              {second}
            </h1>

            <p className="cover-label">{eventLabel}</p>

            <div className="divider-wrap">
              <OrnamentDivider />
            </div>

            <p className="cover-date">
              {dateDisplay.replace(/\D+/g, " · ").trim()}
            </p>
          </div>
        </div>

        <div className="cover-ger">
          <div className="cover-ger-glow" />
          <img
            src="/images/ger-back.png"
            alt="Ger"
            className="cover-ger-image"
          />
          <div className="cover-ger-sparkle sparkle-1" />
          <div className="cover-ger-sparkle sparkle-2" />
          <div className="cover-ger-sparkle sparkle-3" />
        </div>

        <div className="cover-tap">
          <div className="cover-tap-ring">
            <span className="tap-ring-pulse" />
            <span className="tap-ring-pulse tap-ring-pulse--delay" />
            <span className="cover-tap-chevron">⌄</span>
          </div>

          <span className="cover-tap-text">Нээхийн тулд дарна уу</span>
        </div>
      </div>

      <style jsx>{`
        /* ----- ҮНДСЭН ----- */
        .cover {
          all: unset;
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background: #ece9e1;
          overflow: hidden;
          transition:
            opacity 800ms ease,
            transform 800ms ease;
        }
        .cover:active {
          transform: scale(0.985);
        }
        .cover--opening {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }

        /* ----- АРЫН ДЭВСГЭР ----- */
        .cover-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        /* Долгион */
        .wave {
          position: absolute;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.04);
          animation: wave-move 8s ease-in-out infinite alternate;
        }
        .wave--1 {
          width: 600px;
          height: 600px;
          top: -200px;
          right: -200px;
          animation-duration: 10s;
        }
        .wave--2 {
          width: 400px;
          height: 400px;
          bottom: -150px;
          left: -150px;
          animation-duration: 12s;
          animation-delay: 2s;
        }
        .wave--3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-duration: 14s;
          animation-delay: 4s;
          background: rgba(212, 175, 55, 0.025);
        }

        @keyframes wave-move {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.9);
          }
          100% {
            transform: translate(10px, -10px) scale(1.05);
          }
        }

        /* Гэрэлт цацраг */
        .radial-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          opacity: 0.15;
          animation: glow-pulse 5s ease-in-out infinite alternate;
        }
        .glow--tl {
          width: 250px;
          height: 250px;
          top: -60px;
          left: -60px;
          background: radial-gradient(circle, #d4af37 0%, transparent 70%);
        }
        .glow--br {
          width: 250px;
          height: 250px;
          bottom: -60px;
          right: -60px;
          background: radial-gradient(circle, #d4af37 0%, transparent 70%);
          animation-delay: 2.5s;
        }
        .glow--center {
          width: 350px;
          height: 350px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, #e6c35c 0%, transparent 70%);
          opacity: 0.06;
          animation-delay: 1.5s;
          filter: blur(90px);
        }

        @keyframes glow-pulse {
          0% {
            opacity: 0.08;
            transform: scale(0.9);
          }
          100% {
            opacity: 0.25;
            transform: scale(1.2);
          }
        }

        /* Хээ */
        .motif {
          position: absolute;
          animation: motif-spin 40s linear infinite;
        }
        .motif--tl {
          top: -50px;
          left: -60px;
          animation-duration: 45s;
        }
        .motif--tr {
          top: -40px;
          right: -70px;
          animation-duration: 50s;
          animation-direction: reverse;
        }
        .motif--bl {
          bottom: -70px;
          left: -50px;
          animation-duration: 55s;
        }
        .motif--br {
          bottom: -60px;
          right: -40px;
          animation-duration: 48s;
          animation-direction: reverse;
        }

        @keyframes motif-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Оддын ширхэглэг — одоо бага зэрэг хөвж, драйфтэй */
        .sparkles {
          position: absolute;
          inset: 0;
        }
        .sparkle {
          position: absolute;
          border-radius: 50%;
          background: #d4af37;
          opacity: 0;
          animation: sparkle-fade 4s ease-in-out infinite alternate;
          box-shadow: 0 0 4px rgba(212, 175, 55, 0.3);
        }
        @keyframes sparkle-fade {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(0);
          }
          100% {
            opacity: var(--sparkle-opacity, 0.5);
            transform: scale(1) translateY(var(--sparkle-drift, -6px));
          }
        }

        /* ----- ҮНДСЭН СТЭК ----- */
        .cover-stack {
          position: relative;
          width: min(90vw, 340px);
          max-height: 94vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          padding: 16px 0 28px;
          animation: cover-in 1000ms ease both;
        }

        @keyframes cover-in {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ----- LUXURY INVITATION FRAME ----- */

        .cover-frame {
          position: relative;

          width: 100%;

          padding: 48px 26px 42px;

          display: flex;
          justify-content: center;

          border-radius: 10px;

          /* subtle ivory paper */
          background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.72),
            rgba(250, 244, 232, 0.62)
          );

          backdrop-filter: blur(8px);

          border: 1px solid rgba(198, 152, 47, 0.45);

          overflow: hidden;

          isolation: isolate;

          animation: frameFloat 8s ease-in-out infinite;
        }

        /* Outer gold foil border */

        .cover-frame::before {
          content: "";

          position: absolute;

          inset: 8px;

          border-radius: 7px;

          border: 1px solid rgba(212, 175, 55, 0.28);

          pointer-events: none;
        }

        /* Moving gold light */

        .cover-frame::after {
          content: "";

          position: absolute;

          inset: -40%;

          background: linear-gradient(
            120deg,
            transparent 35%,
            rgba(255, 236, 170, 0.35) 48%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 236, 170, 0.25) 52%,
            transparent 65%
          );

          transform: translateX(-120%) rotate(15deg);

          animation: frameShine 9s ease-in-out infinite;

          pointer-events: none;

          mix-blend-mode: screen;
        }

        /* Inner luxury shadow */

        .cover-frame > * {
          position: relative;
          z-index: 2;
        }

        /* Floating paper feeling */

        @keyframes frameFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        /* Gold reflection */

        @keyframes frameShine {
          0% {
            transform: translateX(-120%) rotate(15deg);

            opacity: 0;
          }

          20% {
            opacity: 1;
          }

          45% {
            transform: translateX(120%) rotate(15deg);

            opacity: 0;
          }

          100% {
            transform: translateX(120%) rotate(15deg);

            opacity: 0;
          }
        }

        .cover-frame .corner {
          position: absolute;
          width: 35px;
          height: 35px;
          opacity: 0.45;
        }

        .cover-frame .corner.top-left {
          top: 14px;
          left: 14px;
          border-top: 1px solid #c9a24a;
          border-left: 1px solid #c9a24a;
        }

        .cover-frame .corner.top-right {
          top: 14px;
          right: 14px;
          border-top: 1px solid #c9a24a;
          border-right: 1px solid #c9a24a;
        }

        .cover-frame .corner.bottom-left {
          bottom: 14px;
          left: 14px;
          border-bottom: 1px solid #c9a24a;
          border-left: 1px solid #c9a24a;
        }

        .cover-frame .corner.bottom-right {
          bottom: 14px;
          right: 14px;
          border-bottom: 1px solid #c9a24a;
          border-right: 1px solid #c9a24a;
        }

        .frame-glow {
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          pointer-events: none;
          overflow: hidden;

          background:
    /* top highlight */
            linear-gradient(180deg, rgba(255, 243, 205, 0.22), transparent 20%),
            /* gold diagonal */
            linear-gradient(
                135deg,
                rgba(255, 224, 156, 0.18) 0%,
                rgba(212, 175, 55, 0.1) 18%,
                transparent 35%,
                transparent 65%,
                rgba(212, 175, 55, 0.12) 82%,
                rgba(255, 228, 168, 0.18) 100%
              ),
            /* warm vignette */
            radial-gradient(
                circle at center,
                transparent 62%,
                rgba(212, 175, 55, 0.08) 100%
              );

          box-shadow:
            inset 0 0 0 1px rgba(255, 230, 170, 0.18),
            inset 0 0 20px rgba(255, 215, 120, 0.08),
            0 0 18px rgba(212, 175, 55, 0.1),
            0 0 40px rgba(212, 175, 55, 0.06);

          animation:
            frameBreath 7s ease-in-out infinite,
            frameGlow 9s ease-in-out infinite;
        }

        /* Moving shine */
        .frame-glow::before {
          content: "";
          position: absolute;
          inset: -40%;

          background: linear-gradient(
            115deg,
            transparent 35%,
            rgba(255, 255, 255, 0.05) 44%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(255, 255, 255, 0.05) 56%,
            transparent 65%
          );

          transform: translateX(-180%) rotate(8deg);

          animation: frameSweep 6s ease-in-out infinite;

          mix-blend-mode: screen;
        }

        /* Corner sparkle */
        .frame-glow::after {
          content: "";
          position: absolute;
          inset: 0;

          background:
            radial-gradient(
              circle at 0% 0%,
              rgba(255, 238, 190, 0.28),
              transparent 18%
            ),
            radial-gradient(
              circle at 100% 0%,
              rgba(255, 238, 190, 0.2),
              transparent 18%
            ),
            radial-gradient(
              circle at 100% 100%,
              rgba(255, 238, 190, 0.24),
              transparent 18%
            ),
            radial-gradient(
              circle at 0% 100%,
              rgba(255, 238, 190, 0.2),
              transparent 18%
            );

          opacity: 0.7;

          animation: cornerPulse 5s ease-in-out infinite;
        }

        @keyframes frameBreath {
          0%,
          100% {
            opacity: 0.72;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.004);
          }
        }

        @keyframes frameGlow {
          0%,
          100% {
            filter: brightness(1);
          }

          50% {
            filter: brightness(1.18);
          }
        }

        @keyframes frameSweep {
          0% {
            transform: translateX(-180%) rotate(8deg);
          }

          40% {
            transform: translateX(220%) rotate(8deg);
          }

          100% {
            transform: translateX(220%) rotate(8deg);
          }
        }

        @keyframes cornerPulse {
          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }
        }

        /* Булангийн хээ — тус бүр өөрийн бачимдах гэрэлтэй */
        .corner-hee {
          position: relative;
          width: 70px;
          height: 70px;
          z-index: 3;
        }
        .corner {
          position: absolute;
          width: 54px;
          height: 54px;
          z-index: 2;
          filter: drop-shadow(0 0 0 rgba(212, 175, 55, 0));
          animation: corner-breathe 4.5s ease-in-out infinite;
        }
        .corner--tl {
          top: -1px;
          left: 1px;
          animation-delay: 0s;
        }
        .corner--tr {
          top: -1px;
          right: 1px;
          transform: scaleX(-1);
          animation-delay: 0.6s;
        }
        .corner--br {
          bottom: -1px;
          right: 1px;
          transform: scale(-1, -1);
          animation-delay: 1.2s;
        }
        .corner--bl {
          bottom: -1px;
          left: 1px;
          transform: scaleY(-1);
          animation-delay: 1.8s;
        }
        @keyframes corner-breathe {
          0%,
          100% {
            opacity: 0.45;
            filter: drop-shadow(0 0 0 rgba(212, 175, 55, 0));
          }
          50% {
            opacity: 0.85;
            filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.35));
          }
        }

        /* ----- БИЧВЭР ----- */
        .cover-body {
          display: flex;
          flex-direction: column;
          align-items: center;

          gap: 10px;

          position: relative;

          z-index: 1;

          animation: coverReveal 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* ----- TOP SMALL LABEL ----- */

        .cover-eyebrow {
          position: relative;

          display: flex;

          align-items: center;

          gap: 12px;

          font-family: var(--font-caption), sans-serif;

          font-size: clamp(0.58rem, 2vw, 0.7rem);

          letter-spacing: 0.48em;

          text-transform: uppercase;

          color: #7b5424;

          opacity: 0.78;

          font-weight: 500;

          text-shadow:
            0 1px 0 rgba(255, 255, 255, 0.45),
            0 0 12px rgba(212, 175, 55, 0.15);

          animation: eyebrowGlow 5s ease-in-out infinite;
        }

        /* decorative lines — endash grow-in on load, then hold */
        .cover-eyebrow::before,
        .cover-eyebrow::after {
          content: "";

          width: 36px;

          height: 1px;

          background: linear-gradient(90deg, transparent, #c9a24a, transparent);

          opacity: 0.7;

          transform: scaleX(0);
          animation: eyebrow-line-grow 900ms ease 300ms forwards;
        }
        .cover-eyebrow::after {
          animation-delay: 420ms;
        }
        @keyframes eyebrow-line-grow {
          to {
            transform: scaleX(1);
          }
        }

        /* reveal */

        @keyframes coverReveal {
          from {
            opacity: 0;

            transform: translateY(18px);
          }

          to {
            opacity: 1;

            transform: translateY(0);
          }
        }

        /* breathing gold */

        @keyframes eyebrowGlow {
          0%,
          100% {
            opacity: 0.65;
          }

          50% {
            opacity: 0.95;
          }
        }

        .cover-names {
          position: relative;
          display: inline-block;

          font-family: var(--font-display), serif;
          font-style: italic;
          font-weight: 800;

          font-size: clamp(2.9rem, 8vw, 3.3rem);
          line-height: 1.08;
          letter-spacing: 0.02em;

          text-align: center;

          background: linear-gradient(
            135deg,
            #4b3412 0%,
            #8e6a2b 18%,
            #5b4e26 34%,
            #b6883b 48%,
            #fdf2c8 58%,
            #997032 74%,
            #4d3513 100%
          );

          background-size: 280% 280%;

          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;

          animation:
            goldFlow 8s ease-in-out infinite,
            shimmer 5s linear infinite;

          filter: drop-shadow(0 1px 0 rgba(255, 255, 255, 0.18))
            drop-shadow(0 4px 12px rgba(178, 134, 52, 0.22));

          transition:
            transform 0.5s ease,
            filter 0.5s ease;
        }

        .cover-names:hover {
          transform: scale(1.02);
          filter: drop-shadow(0 2px 0 rgba(255, 255, 255, 0.25))
            drop-shadow(0 8px 22px rgba(191, 145, 60, 0.35));
        }

        /* Soft golden glow — now gently breathing behind the names */
        .cover-names::before {
          content: "";
          position: absolute;
          inset: -18%;
          z-index: -1;

          background: radial-gradient(
            circle,
            rgba(247, 210, 128, 0.22),
            transparent 70%
          );

          filter: blur(28px);
          animation: names-halo-breathe 4.2s ease-in-out infinite;
        }
        @keyframes names-halo-breathe {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        /* Luxury light sweep */

        .cover-names::after {
          content: "";
          position: absolute;
          inset: -10%;

          background: linear-gradient(
            115deg,
            transparent 28%,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0.55) 50%,
            rgba(255, 255, 255, 0) 60%,
            transparent 72%
          );

          transform: translateX(-180%) skewX(-22deg);

          animation: shineSweep 6s ease-in-out infinite;

          mix-blend-mode: screen;

          pointer-events: none;
        }

        @keyframes goldFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes shimmer {
          0%,
          100% {
            filter: brightness(1)
              drop-shadow(0 4px 10px rgba(148, 113, 47, 0.15));
          }

          50% {
            filter: brightness(1.18)
              drop-shadow(0 6px 22px rgba(147, 119, 55, 0.28));
          }
        }

        @keyframes shineSweep {
          0% {
            transform: translateX(-180%) skewX(-22deg);
          }

          35% {
            transform: translateX(220%) skewX(-22deg);
          }

          100% {
            transform: translateX(220%) skewX(-22deg);
          }
        }

        .cover-amp {
          display: block;

          margin: 0.25rem 0;

          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-weight: 600;

          font-size: 0.8em;

          color: #8b6b32;
          -webkit-text-fill-color: #8b6b32;

          opacity: 0.9;

          text-shadow:
            0 1px 0 rgba(255, 255, 255, 0.35),
            0 0 10px rgba(214, 174, 92, 0.25);

          animation: ampGlow 4s ease-in-out infinite;
        }

        @keyframes ampGlow {
          0%,
          100% {
            opacity: 0.7;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }

        .cover-label {
          margin-top: 1rem;

          font-family: var(--font-caption), sans-serif;
          font-size: 0.72rem;

          letter-spacing: 0.42em;

          text-transform: uppercase;

          color: #8b7355;

          opacity: 0.82;

          position: relative;
        }

        .cover-label::before,
        .cover-label::after {
          content: "";

          display: inline-block;

          margin: 0 14px;
          margin-bottom: 4px;

          background: linear-gradient(
            to right,
            transparent,
            #c8a35d,
            transparent
          );
        }

        .divider-wrap {
          width: 50%;
          margin: 4px 0;
          opacity: 0.7;
        }

        .cover-date {
          font-family: var(--font-caption), sans-serif;
          font-size: 0.9rem;
          letter-spacing: 0.14em;
          color: #5b2620;
          font-weight: 700;
          animation: date-glow 3s ease-in-out infinite alternate;
        }

        @keyframes date-glow {
          0% {
            opacity: 0.6;
            text-shadow: 0 0 10px rgba(212, 175, 55, 0);
          }
          100% {
            opacity: 1;
            text-shadow: 0 0 30px rgba(212, 175, 55, 0.15);
          }
        }

        /* ----- ГЭР ----- */
        .cover-ger {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .cover-ger-image {
          position: relative;
          z-index: 2;
          max-width: 100%;
          height: auto;
        }
        /* Гэрийн ард зөөлөн бачимдах гэрэлт цацраг */
        .cover-ger-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 70%;
          height: 70%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(230, 195, 92, 0.35) 0%,
            rgba(212, 175, 55, 0.12) 45%,
            transparent 72%
          );
          filter: blur(18px);
          z-index: 1;
          animation: ger-glow-breathe 5s ease-in-out infinite;
        }
        @keyframes ger-glow-breathe {
          0%,
          100% {
            opacity: 0.55;
            transform: translate(-50%, -50%) scale(0.94);
          }
          50% {
            opacity: 0.9;
            transform: translate(-50%, -50%) scale(1.06);
          }
        }
        /* Гэрийн эргэн тойронд анивалзах гурван оч */
        .cover-ger-sparkle {
          position: absolute;
          z-index: 3;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #f7dfa0;
          box-shadow: 0 0 8px rgba(230, 195, 92, 0.8);
          opacity: 0;
          animation: ger-sparkle-twinkle 3.2s ease-in-out infinite;
        }
        .sparkle-1 {
          top: 14%;
          left: 22%;
          animation-delay: 0s;
        }
        .sparkle-2 {
          top: 30%;
          right: 18%;
          width: 4px;
          height: 4px;
          animation-delay: 1.1s;
        }
        .sparkle-3 {
          bottom: 20%;
          left: 46%;
          width: 6px;
          height: 6px;
          animation-delay: 2s;
        }
        @keyframes ger-sparkle-twinkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0.4);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        /* ----- НЭЭХ ТОВЧ ----- */
        .cover-tap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-family: var(--font-caption), sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #5c4316;
          animation: tap-pulse 2.8s ease-in-out infinite;
        }

        .cover-tap-ring {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
        }

        /* Тэлж алгасагдах хос давалгаа — "энд дар" гэсэн дохио */
        .tap-ring-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 55, 0.55);
          opacity: 0;
          animation: tap-ring-expand 2.4s ease-out infinite;
        }
        .tap-ring-pulse--delay {
          animation-delay: 1.2s;
        }
        @keyframes tap-ring-expand {
          0% {
            opacity: 0.7;
            transform: scale(0.6);
          }
          70% {
            opacity: 0;
          }
          100% {
            opacity: 0;
            transform: scale(1.9);
          }
        }

        .cover-tap-chevron {
          position: relative;
          z-index: 1;
          font-size: 1.3rem;
          animation: chevron-bounce 1.8s ease-in-out infinite;
          color: #d4af37;
        }

        .cover-tap-text {
          opacity: 0.7;
        }

        @keyframes tap-pulse {
          0%,
          100% {
            opacity: 0.5;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        @keyframes chevron-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cover-stack,
          .cover-tap,
          .motif,
          .wave,
          .radial-glow,
          .sparkle,
          .cover-names,
          .cover-names::before,
          .cover-date,
          .cover-tap-chevron,
          .tap-ring-pulse,
          .frame-glow,
          .corner,
          .cover-ger-glow,
          .cover-ger-sparkle,
          .cover-eyebrow::before,
          .cover-eyebrow::after {
            animation: none !important;
          }
        }

        /* ----- SCROLLBAR ----- */
        .cover-stack::-webkit-scrollbar {
          width: 2px;
        }
        .cover-stack::-webkit-scrollbar-track {
          background: transparent;
        }
        .cover-stack::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 4px;
        }
      `}</style>
    </button>
  );
}
