"use client";
export default function HorseRaceSection({
  label = "Их насны морь уралдана",
}: {
  label?: string;
}) {
  return (
    <section className="section horse-race">
      <div className="race-track">
        <div className="race-sky" />
        <div className="race-ground-line" />
        <div className="race-ground-line race-ground-line--far" />

        <img src="/horses/tomoo.gif" alt="Wedding crest" />

        <div className="race-track-fade race-track-fade--left" />
        <div className="race-track-fade race-track-fade--right" />
      </div>
      <div className="hero-hee">
        <img src="/images/hee-1.png" alt="Wedding crest" />
      </div>

      <p className="host-names">{label}</p>

      <style jsx>{`
        .horse-race {
          overflow: visible;
        }
        .horse-race-detail {
          position: relative;
          z-index: 1;
          margin-bottom: 22px;
          font-family: var(--font-caption), sans-serif;
          font-size: 0.82rem;
          letter-spacing: 0.06em;
          color: #6b5f4f;
        }

        .race-track {
          position: relative;
          width: 100%;
          max-width: 640px;
          height: auto;
          margin: 0 auto;
          overflow: hidden;
          border-radius: 14px;
          margin-bottom: 20px;
          background: linear-gradient(
            180deg,
            #eef2e2 0%,
            #e3dcb8 42%,
            #cdb277 78%,
            #b89a5f 100%
          );
          border: 1px solid rgba(198, 152, 47, 0.3);
          box-shadow:
            0 18px 40px rgba(80, 55, 20, 0.14),
            inset 0 0 30px rgba(120, 90, 40, 0.08);
        }
        .race-sky {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% -10%,
            rgba(255, 255, 255, 0.5),
            transparent 55%
          );
          pointer-events: none;
        }

        .race-ground-line {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 14%;
          height: 1px;
          background: rgba(90, 60, 20, 0.22);
        }
        .race-ground-line--far {
          bottom: 32%;
          opacity: 0.5;
        }

        .horse-wrap {
          position: absolute;
          left: -120px;
          display: flex;
          align-items: flex-end;
          animation-name: race-run;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes race-run {
          from {
            left: -120px;
          }
          to {
            left: calc(100% + 40px);
          }
        }

        .horse-dust {
          position: absolute;
          left: -16px;
          bottom: 4px;
          width: 34px;
          height: 9px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse,
            rgba(160, 130, 75, 0.5),
            transparent 72%
          );
          filter: blur(2px);
        }

        .gif-horse-container {
          filter: drop-shadow(0 3px 3px rgba(50, 35, 15, 0.25));
        }

        .race-track-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 36px;
          pointer-events: none;
        }
        .race-track-fade--left {
          left: 0;
          background: linear-gradient(
            90deg,
            rgba(238, 242, 226, 0.9),
            transparent
          );
        }
        .race-track-fade--right {
          right: 0;
          background: linear-gradient(
            270deg,
            rgba(184, 154, 95, 0.75),
            transparent
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .horse-wrap {
            animation: none !important;
          }
          .horse-wrap {
            left: 40% !important;
          }
        }
      `}</style>
    </section>
  );
}
