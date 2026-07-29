"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Cormorant_Garamond, PT_Serif, PT_Sans } from "next/font/google";
import CoverScreen from "./CoverScreen";
import IntroScene from "./IntroScene";
import {
  KnotRing,
  MongolianMeander,
  OrnamentDivider,
  DateMedallion,
  CircularMotif,
} from "./Ornaments";

const display = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = PT_Serif({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  variable: "--font-body",
});
const caption = PT_Sans({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "700"],
  variable: "--font-caption",
});

const SCENES = [
  { key: "hero", duration: 3000 },
  { key: "invite-hero", duration: 5000 },
  { key: "gallery", duration: 5000 },
  { key: "blessing", duration: 3000 },
  { key: "date", duration: 2000 },
  { key: "venue", duration: 5000 },
  { key: "hosts", duration: 2000 },
  { key: "rsvp", duration: 1000 },
] as const;

function useAutoplaySections(active: boolean) {
  const refs = useRef<Record<string, HTMLElement | null>>({});
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userScrollLock = useRef(false);

  const setRef = (key: string) => (el: HTMLElement | null) => {
    refs.current[key] = el;
  };

  useEffect(() => {
    if (!active || paused) return;
    const scene = SCENES[index];
    if (!scene) return;

    timerRef.current = setTimeout(() => {
      const next = index + 1;
      if (next >= SCENES.length) return;
      userScrollLock.current = true;
      refs.current[SCENES[next].key]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setIndex(next);
      setTimeout(() => {
        userScrollLock.current = false;
      }, 900);
    }, scene.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, index, paused]);

  useEffect(() => {
    if (!active) return;
    function onUserScroll() {
      if (userScrollLock.current) return;
      setPaused(true);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        const viewportMid = window.scrollY + window.innerHeight / 2;
        let closest = 0;
        let closestDist = Infinity;
        SCENES.forEach((s, i) => {
          const el = refs.current[s.key];
          if (!el) return;
          const top = el.offsetTop;
          const dist = Math.abs(top - viewportMid + el.offsetHeight / 2);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setIndex(closest);
        setPaused(false);
      }, 5000);
    }
    window.addEventListener("scroll", onUserScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onUserScroll);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [active]);

  return { setRef };
}

const CONTENT = {
  coupleNames: "Эрдэнэмандал & Чанцалдулам",
  eventLabel: "Шинэ гэрийн найр",
  isoDateTime: "2026-08-15T11:00:00+08:00",
  dateDisplay: "2026 · 08 · 15",
  weekdayDisplay: "Бямба гараг · 9:30 цаг",
  venueName: "Дундговь аймаг, Дэрэн сум, Хулгар цагаан нуур",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=48.0710,98.8505",
  mapEmbedUrl:
    "https://www.google.com/maps?q=48.0710,98.8505&z=13&output=embed",
  calendarYear: 2026,
  calendarMonth: 8,
  calendarDay: 15,
  hosts: [
    { role: "Шинэ гэр бүл", names: "Эрдэнэмандал · Чанцалдулам" },
    { role: "Охин", names: "Баяржаргал" },
  ],
  contactPhone: "+976 9899 0593",
  musicSrc: "/assets/music.mp3",
  galleryPhotos: [] as string[],
  blessing: [
    "Эцгийн ариун голомтыг",
    "Ган тулгандаа бадрааж",
    "Золгон учирсан энэ өдрөөс",
    "Зочин таны сайхан ерөөлөөр",
    "Ургийн холбоо батжих болтугай",
    "Удмын өлзий дэлгэрэх болтугай",
    "Нарт хорвоогийн буяныг эдэлье",
    "Насан туршид хамтран жаргая…",
  ],
};

function useCountdown(target: string) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const tick = () =>
      setRemaining(Math.max(0, new Date(target).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (remaining === null)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ready: false };
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  return { days, hours, minutes, seconds, ready: true };
}

function useScrollProgress(active: boolean) {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    function measure() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setScrollY(window.scrollY);
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [active]);

  return { progress, scrollY };
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${visible ? " reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function MusicToggle({
  src,
  audioRef,
}: {
  src: string;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, [audioRef]);

  return (
    <div className="music">
      <audio ref={audioRef as any} src={src} loop preload="none" />
      <button
        className={`music-btn${playing ? " music-btn--on" : ""}`}
        onClick={toggle}
        aria-label="Хөгжим тоглуулах"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          {playing ? (
            <>
              <rect
                x="4"
                y="3"
                width="3"
                height="12"
                rx="1.5"
                fill="currentColor"
              />

              <rect
                x="11"
                y="3"
                width="3"
                height="12"
                rx="1.5"
                fill="currentColor"
              />
            </>
          ) : (
            <path d="M6 3.8L14 9L6 14.2V3.8Z" fill="currentColor" />
          )}
        </svg>
      </button>
      <div className="music-marquee" aria-hidden>
        <span>
          Хөгжим тоглуулах · Хөгжим тоглуулах· Хөгжим тоглуулах· Хөгжим
          тоглуулах ·&nbsp;
        </span>
        <span>
          Хөгжим тоглуулах · Хөгжим тоглуулах · Хөгжим тоглуулах · Хөгжим
          тоглуулах ·&nbsp;
        </span>
      </div>
    </div>
  );
}

function Panorama({ photos }: { photos: string[] }) {
  const frames = photos.length > 0 ? photos : Array.from({ length: 6 });
  const loop = [...frames, ...frames];

  return (
    <div className="panorama">
      <div className="panorama-ring" aria-hidden>
        <KnotRing size={340} ticks={60} opacity={0.22} />
      </div>
      <div className="panorama-track">
        {loop.map((src, i) => (
          <div className="panorama-frame" key={i}>
            {typeof src === "string" && src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" />
            ) : (
              <div className="panorama-placeholder" />
            )}
          </div>
        ))}
      </div>
      <div className="panorama-fade panorama-fade--left" aria-hidden />
      <div className="panorama-fade panorama-fade--right" aria-hidden />
    </div>
  );
}

function SectionMotif({
  side = "left",
  size = 260,
  color,
}: {
  side?: "left" | "right";
  size?: number;
  color?: string;
}) {
  return (
    <div className={`section-motif section-motif--${side}`} aria-hidden>
      <CircularMotif size={size} opacity={0.07} color={color} />
    </div>
  );
}

type Stage = "intro" | "cover" | "invite";

export default function InvitationClient({ name }: { name: string }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [homeVisible, setHomeVisible] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown(CONTENT.isoDateTime);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const audioRef = useRef<HTMLAudioElement>(null);
  const { progress, scrollY } = useScrollProgress(stage === "invite");
  const { setRef } = useAutoplaySections(stage === "invite");

  useEffect(() => {
    if (stage !== "invite") return;
    const t = requestAnimationFrame(() => setHomeVisible(true));
    audioRef.current?.play().catch(() => {});
    return () => cancelAnimationFrame(t);
  }, [stage]);

  const guestName = name?.trim() || "хүндэт зочин";
  const greetingClosing =
    'таныг гэр бүлийн хамт өргөжин дэвшиж буй өргөө гэрийнхээ өрхийг татаж, гал голомтоо бадрааж буй "Шинэ гэрийн найр"-нд хүрэлцэн ирэхийг урьж байна.';
  const weekdayIndex = new Date(CONTENT.isoDateTime).getDay();
  const [namesFirst, namesSecond] = CONTENT.coupleNames
    .split("&")
    .map((s) => s.trim());
  const initials = `${namesFirst?.[0] ?? ""} · ${namesSecond?.[0] ?? ""}`;

  const [first, second] = CONTENT.coupleNames.split("&").map((s) => s.trim());

  return (
    <div className={`${display.variable} ${body.variable} ${caption.variable}`}>
      {stage === "intro" && (
        <IntroScene
          coupleInitials={initials}
          coupleNames={CONTENT.coupleNames}
          onDone={() => setStage("cover")}
          onSkip={() => setStage("cover")}
        />
      )}

      {stage === "cover" && (
        <CoverScreen
          coupleNames={CONTENT.coupleNames}
          eventLabel={CONTENT.eventLabel}
          dateDisplay={CONTENT.dateDisplay}
          onOpen={() => setStage("invite")}
        />
      )}

      {stage === "invite" && (
        <main
          className={`invite-root${homeVisible ? " invite-root--visible" : ""}`}
        >
          <div className="scroll-rail" aria-hidden>
            <div
              className="scroll-rail-fill"
              style={{ transform: `scaleY(${progress})` }}
            />
          </div>

          <section ref={setRef("hero")} className="hero">
            <div
              className="motif-layer"
              style={{ transform: `translateY(${scrollY * 0.12}px)` }}
              aria-hidden
            >
              <div className="motif motif--tl">
                <CircularMotif size={320} opacity={0.14} />
              </div>
              <div className="motif motif--br">
                <CircularMotif size={200} opacity={0.06} color="#C6982F" />
              </div>
            </div>
            <div
              className="motif-layer"
              style={{ transform: `translateY(${scrollY * 0.22}px)` }}
              aria-hidden
            >
              <div className="motif motif--tr">
                <CircularMotif size={280} opacity={0.12} color="#C6982F" />
              </div>
              <div className="motif motif--bl">
                <CircularMotif size={240} opacity={0.08} />
              </div>
            </div>

            <div className="hero-crest">
              <img src="/images/crest.png" alt="Wedding crest" />
            </div>
            <h1 className="cover-names">
              {first}
              <span className="cover-amp">&amp;</span>
              {second}
            </h1>
            <p className="cover-label">{CONTENT.eventLabel}</p>
            <OrnamentDivider />
            <div className="hero-hee">
              <img src="/images/hee-1.png" alt="Wedding crest" />
            </div>

            <p className="hero-countdown-label">Найр эхлэх хүртэл:</p>
            <div className="countdown-grid">
              <div>
                <span className="countdown-num">{days}</span>
                <span className="countdown-unit">өдөр</span>
              </div>
              <span className="countdown-sep">:</span>
              <div>
                <span className="countdown-num">{pad(hours)}</span>
                <span className="countdown-unit">цаг</span>
              </div>
              <span className="countdown-sep">:</span>
              <div>
                <span className="countdown-num">{pad(minutes)}</span>
                <span className="countdown-unit">минут</span>
              </div>
              <span className="countdown-sep">:</span>
              <div>
                <span className="countdown-num">{pad(seconds)}</span>
                <span className="countdown-unit">секунд</span>
              </div>
            </div>

            <MusicToggle src={CONTENT.musicSrc} audioRef={audioRef} />

            <div className="hero-ring" aria-hidden>
              <KnotRing size={260} ticks={54} opacity={0.16} />
            </div>

            <div className="hero-scroll-cue" aria-hidden>
              <span />
            </div>
          </section>

          <OrnamentDivider />
          <Reveal className="reveal--wide">
            <section
              ref={setRef("invite-hero")}
              className="section invite-hero"
            >
              <SectionMotif side="left" size={340} />
              <SectionMotif side="right" size={260} />

              <div className="invite-card">
                <div className="invite-top-line" />

                <p className="invite-hero-kicker">УРИЛГА</p>

                <p className="invite-hero-eyebrow">Эрхэм хүндэт</p>

                <h2 className="guest-name">{guestName}</h2>

                <div className="invite-divider">
                  <MongolianMeander width={220} height={12} />
                </div>

                <p className="invite-hero-body">{greetingClosing}</p>

                <div className="greeting-signature">
                  <MongolianMeander width={120} height={10} />

                  <span>{CONTENT.coupleNames}</span>

                  <MongolianMeander width={120} height={10} />
                </div>

                <div className="invite-bottom-line" />
              </div>
            </section>
          </Reveal>

          <OrnamentDivider />

          <Reveal className="reveal--full">
            <section
              ref={setRef("gallery")}
              className="section section--full gallery"
            >
              <p className="section-label">Дурсамж</p>
              <Panorama photos={CONTENT.galleryPhotos} />
            </section>
          </Reveal>

          <OrnamentDivider />

          <Reveal>
            <section ref={setRef("blessing")} className="section blessing">
              <SectionMotif side="right" size={260} />
              <p className="section-label">Ерөөл</p>
              <p className="blessing-verse">
                {CONTENT.blessing.map((line, i) => (
                  <Reveal key={i} delay={i * 160} className="blessing-line">
                    <span>{line}</span>
                  </Reveal>
                ))}
              </p>
              <div className="hero-hee">
                <img src="/images/hee-1.png" alt="Wedding crest" />
              </div>
            </section>
          </Reveal>

          <OrnamentDivider />

          <Reveal>
            <section ref={setRef("date")} className="section">
              <SectionMotif side="left" size={220} />
              <p className="section-label">Огноо</p>
              <DateMedallion
                day={CONTENT.calendarDay}
                month={CONTENT.calendarMonth}
                year={CONTENT.calendarYear}
                weekday={weekdayIndex}
              />
              <div className="hero-hee">
                <img src="/images/hee-1.png" alt="Wedding crest" />
              </div>
              <p className="date-detail">{CONTENT.weekdayDisplay}</p>
            </section>
          </Reveal>

          <OrnamentDivider />

          <Reveal>
            <section ref={setRef("venue")} className="section">
              <div
                className="motif-layer"
                style={{ transform: `translateY(${scrollY * 0.12}px)` }}
                aria-hidden
              >
                <div className="motif motif--tl">
                  <CircularMotif size={320} opacity={0.14} />
                </div>
                <div className="motif motif--br">
                  <CircularMotif size={200} opacity={0.06} color="#C6982F" />
                </div>
              </div>
              <p className="section-label">Хаяг</p>
              <p className="venue-name">{CONTENT.venueName}</p>
              <div className="hero-hee">
                <img src="/images/hee-1.png" alt="Wedding crest" />
              </div>
              <p className="date-detail">
                {CONTENT.dateDisplay} · {CONTENT.weekdayDisplay}
              </p>
              <div className="map-frame">
                <iframe
                  src={CONTENT.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Хурим болох газрын байршил"
                />
              </div>
              <a
                className="btn-outline"
                href={CONTENT.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Газрын зурагт нээх
              </a>
            </section>
          </Reveal>

          <OrnamentDivider />

          <Reveal>
            <section ref={setRef("hosts")} className="section hosts">
              <div
                className="motif-layer"
                style={{ transform: `translateY(${scrollY * 0.12}px)` }}
                aria-hidden
              >
                <div className="motif motif--tl">
                  <CircularMotif size={320} opacity={0.14} />
                </div>
                <div className="motif motif--br">
                  <CircularMotif size={200} opacity={0.06} color="#C6982F" />
                </div>
              </div>
              <SectionMotif side="right" size={240} color="#C6982F" />
              <p className="section-label">Хүндэтгэсэн</p>
              <div className="hosts-card">
                {CONTENT.hosts.map((h) => (
                  <div key={h.role} className="host-row">
                    <span className="host-role">{h.role}</span>
                    <span className="host-names">{h.names}</span>
                  </div>
                ))}
              </div>
              <div className="hero-crest">
                <img src="/images/crest.png" alt="Wedding crest" />
              </div>
            </section>
          </Reveal>

          <OrnamentDivider />

          <Reveal>
            <section ref={setRef("rsvp")} className="section rsvp">
              <div
                className="motif-layer"
                style={{ transform: `translateY(${scrollY * 0.22}px)` }}
                aria-hidden
              >
                <div className="motif motif--tr">
                  <CircularMotif size={280} opacity={0.12} color="#C6982F" />
                </div>
                <div className="motif motif--bl">
                  <CircularMotif size={240} opacity={0.08} />
                </div>
              </div>
              <div className="rsvp-card">
                <div className="hero-hee">
                  <img src="/images/hee-1.png" alt="Wedding crest" />
                </div>
                <blockquote className="rsvp-quote">
                  <p className="rsvp-text">Урьсан бидний ураг батжиж</p>
                  <p className="rsvp-text">Уригдсан таны өлмий бат оршиг</p>
                </blockquote>
                <div className="hero-hee1">
                  <img src="/images/hee-1.png" alt="Wedding crest" />
                </div>
              </div>
            </section>
          </Reveal>
        </main>
      )}

      <style jsx global>{`
        :root {
          --gold: #c6982f;
          --gold-light: #e9cd8b;
          --cream: #f6f0e3;
          --maroon: #5b2620;
          --green: #4f6b4a;
          --text: #2a2118;
        }
        .invite-root {
          position: relative;
          font-family: var(--font-body), serif;
          color: var(--text);
          background: var(--cream);
          background-image: radial-gradient(
            ellipse at top,
            rgba(198, 152, 47, 0.08),
            transparent 60%
          );
          opacity: 0;
          transform: translateY(10px) scale(0.99);
          transition:
            opacity 900ms ease,
            transform 900ms ease;
        }
        .invite-root--visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ---------- cinematic scroll progress rail ---------- */
        .scroll-rail {
          position: fixed;
          top: 12vh;
          bottom: 12vh;
          right: 10px;
          width: 2px;
          z-index: 40;
          background: rgba(198, 152, 47, 0.16);
          pointer-events: none;
          border-radius: 999px;
        }
        .scroll-rail-fill {
          position: absolute;
          inset: 0;
          transform-origin: top;
          background: linear-gradient(
            to bottom,
            var(--gold-light),
            var(--gold)
          );
          border-radius: inherit;
          box-shadow: 0 0 8px rgba(198, 152, 47, 0.5);
          transition: transform 60ms linear;
        }
        @media (max-width: 640px) {
          .scroll-rail {
            right: 6px;
          }
        }

        /* Хээ */
        .motif-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .motif {
          position: absolute;
          animation: motif-spin 40s linear infinite;
        }
        .motif--tl {
          top: -180px;
          left: -150px;
          animation-duration: 45s;
        }
        .motif--tr {
          top: 50px;
          right: -170px;
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

        /* Section-level faint motif backdrop, used across the story */
        .section-motif {
          position: absolute;
          top: 50%;
          z-index: 0;
          pointer-events: none;
          transform: translateY(-50%);
        }
        .section-motif--left {
          left: -120px;
        }
        .section-motif--right {
          right: -120px;
        }
        @media (max-width: 640px) {
          .section-motif--left {
            left: -160px;
          }
          .section-motif--right {
            right: -160px;
          }
        }

        /* Оддын ширхэглэг */
        .sparkles {
          position: absolute;
          inset: 0;
        }
        .sparkle {
          position: absolute;
          border-radius: 50%;
          background: #d4af37;
          animation: sparkle-fade 4s ease-in-out infinite alternate;
          box-shadow: 0 0 4px rgba(212, 175, 55, 0.3);
        }
        @keyframes sparkle-fade {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          100% {
            opacity: 0.6;
            transform: scale(1);
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

        /* Cinematic reveal — fade, rise, un-blur, settle */
        .reveal {
          opacity: 0;
          transform: translateY(36px) scale(0.975);
          filter: blur(4px);
          transition:
            opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 1100ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 1100ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .reveal--visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0);
        }
        .reveal--full {
          width: 100%;
        }
        .reveal--wide {
          width: 100%;
        }
        .blessing-line {
          transform: translateY(14px);
          display: block;
        }
        .blessing-line + .blessing-line {
          margin-top: 2px;
        }
        .program-reveal {
          transform: translateY(18px) scale(1);
          filter: none;
        }

        .hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 10px;
          padding: 32px;
          overflow: hidden;
        }
        .hero-ring {
          position: absolute;
          right: -80px;
          bottom: -60px;
          pointer-events: none;
        }
        .hero-crest {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;

          width: 90px;
          height: 90px;

          margin: 0 auto 18px;

          animation: crestFloat 6s ease-in-out infinite;
        }

        .hero-hee {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100px;
          padding-top: 20px;
          margin: 0 auto 18px;
        }
        .hero-hee1 {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100px;
          margin: 0 auto 18px;
        }

        .hero-crest::before {
          content: "";
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          filter: blur(12px);
          z-index: -1;
        }

        .hero-crest img {
          width: 100%;
          height: 100%;

          object-fit: contain;

          filter: drop-shadow(0 10px 25px rgba(80, 50, 15, 0.25))
            drop-shadow(0 0 15px rgba(212, 175, 55, 0.35));

          transition: transform 0.5s ease;
        }

        .hero-crest img:hover {
          transform: scale(1.08);
        }

        @keyframes crestFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px);
          }
        }

        /* A quiet cue that there is more below, on the hero itself */
        .hero-scroll-cue {
          position: absolute;
          bottom: 22px;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 32px;
          border: 1px solid rgba(198, 152, 47, 0.55);
          border-radius: 999px;
        }
        .hero-scroll-cue span {
          position: absolute;
          top: 6px;
          left: 50%;
          width: 3px;
          height: 6px;
          margin-left: -1.5px;
          border-radius: 999px;
          background: var(--gold);
          animation: scroll-cue-drop 2.1s ease-in-out infinite;
        }
        @keyframes scroll-cue-drop {
          0% {
            opacity: 0;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
          }
          80% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 0;
            transform: translateY(12px);
          }
        }

        /* ----- COUPLE NAMES ----- */
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

        /* Soft golden glow */

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

        .hero-countdown-label {
          font-family: var(--font-display), serif;
          font-style: italic;
          color: var(--green);
          margin-top: 6px;
        }
        .countdown-grid {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: clamp(8px, 3vw, 18px);
          margin-top: 4px;
        }
        .countdown-grid > div {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 34px;
        }
        .countdown-sep {
          font-family: var(--font-display), serif;
          font-size: 1.6rem;
          color: var(--gold);
          margin-top: -2px;
        }
        .countdown-num {
          font-family: var(--font-display), serif;
          font-size: clamp(1.6rem, 5vw, 2.2rem);
          color: var(--maroon);
          line-height: 1;
        }
        .countdown-unit {
          font-family: var(--font-caption), sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
        }
        /* ----- LUXURY MUSIC PLAYER ----- */

        .music {
          position: relative;

          display: flex;

          align-items: center;

          gap: 12px;

          margin-top: 24px;

          padding: 7px 18px 7px 7px;

          border-radius: 999px;

          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.75),
            rgba(250, 242, 225, 0.55)
          );

          border: 1px solid rgba(198, 152, 47, 0.38);

          backdrop-filter: blur(8px);

          box-shadow:
            0 12px 35px rgba(90, 55, 20, 0.12),
            inset 0 0 18px rgba(212, 175, 55, 0.08);

          animation: musicFloat 6s ease-in-out infinite;
        }

        /* golden shine border */

        .music::before {
          content: "";

          position: absolute;

          inset: -1px;

          border-radius: inherit;

          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 225, 150, 0.7),
            transparent
          );

          opacity: 0.35;

          animation: musicShine 5s ease-in-out infinite;

          pointer-events: none;
        }

        /* button */

        .music-btn {
          position: relative;

          width: 38px;

          height: 38px;

          border-radius: 50%;

          border: 1px solid rgba(212, 175, 55, 0.8);

          background: radial-gradient(circle, #fff0bb, #d4af37);

          display: flex;

          align-items: center;

          justify-content: center;

          cursor: pointer;

          color: #fff;

          font-size: 15px;

          box-shadow: 0 0 20px rgba(212, 175, 55, 0.25);

          transition: 0.3s ease;
        }

        .music-btn:hover {
          transform: scale(1.08);
        }

        /* playing state */

        .music-btn--on {
          background: radial-gradient(circle, #fff4c9, #b88928);

          animation: musicPulse 2s ease-in-out infinite;
        }

        /* text */

        .music-marquee {
          width: 150px;

          overflow: hidden;

          white-space: nowrap;

          font-family: var(--font-caption), sans-serif;

          font-size: 0.65rem;

          letter-spacing: 0.22em;

          text-transform: uppercase;

          color: #7b5424;

          -webkit-mask-image: linear-gradient(
            90deg,
            transparent,
            black 15%,
            black 85%,
            transparent
          );

          mask-image: linear-gradient(
            90deg,
            transparent,
            black 15%,
            black 85%,
            transparent
          );
        }

        .music-marquee span {
          display: inline-block;

          padding-left: 100%;

          animation: marquee 12s linear infinite;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-100%);
          }
        }

        @keyframes musicPulse {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
          }

          50% {
            box-shadow: 0 0 35px rgba(212, 175, 55, 0.65);
          }
        }

        @keyframes musicFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes musicShine {
          0%,
          100% {
            opacity: 0.15;
          }

          50% {
            opacity: 0.7;
          }
        }
        .ornament-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          max-width: 420px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .ornament-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            var(--gold),
            transparent
          );
          opacity: 0.6;
        }
        .section {
          position: relative;
          max-width: 560px;
          margin: 0 auto;
          padding: 56px 32px;
          text-align: center;
          overflow: hidden;
        }
        .section--full {
          max-width: 100%;
          padding-left: 0;
          padding-right: 0;
        }
        .section-label {
          position: relative;
          z-index: 1;
          font-family: var(--font-display), serif;
          letter-spacing: 0.28em;
          font-size: 1rem;
          color: var(--green);
          margin-bottom: 18px;
        }
        .gallery .section-label {
          padding: 0 32px;
        }

        .invite-card {
          position: relative;

          max-width: 620px;

          margin: auto;

          padding: 60px 38px;

          border-radius: 18px;

          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.82),
            rgba(249, 243, 232, 0.74)
          );

          backdrop-filter: blur(10px);

          border: 1px solid rgba(198, 152, 47, 0.28);

          overflow: hidden;

          box-shadow:
            0 30px 80px rgba(90, 60, 20, 0.08),
            inset 0 0 45px rgba(212, 175, 55, 0.05);
        }
        .invite-card::before {
          content: "";

          position: absolute;

          inset: -25%;

          background: radial-gradient(
            circle,
            rgba(255, 223, 150, 0.18),
            transparent 65%
          );

          filter: blur(40px);

          animation: cardGlow 7s ease-in-out infinite;

          pointer-events: none;
        }

        @keyframes cardGlow {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }
        .guest-name {
          margin: 12px 0 26px;

          font-size: clamp(2.8rem, 9vw, 4rem);

          letter-spacing: 0.03em;

          line-height: 1.15;

          text-align: center;

          font-weight: 700;

          background: linear-gradient(
            135deg,
            #6d4a18,
            #d4af37 35%,
            #fff1b5 50%,
            #b8892c 70%,
            #5d3f18
          );

          background-size: 300% auto;

          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;

          animation: goldFlow 10s linear infinite;
        }
        .invite-hero-eyebrow {
          font-size: 1.35rem;

          font-style: italic;

          letter-spacing: 0.04em;

          color: #7a5220;

          opacity: 0.9;

          margin-bottom: 10px;
        }
        .invite-hero-body {
          max-width: 480px;

          margin: auto;

          font-size: 1.08rem;

          line-height: 2;

          color: #56473c;
        }
        .greeting-signature {
          margin-top: 36px;

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 18px;

          color: #b8892c;

          font-style: italic;

          font-size: 1.15rem;
        }
        .invite-top-line,
        .invite-bottom-line {
          width: 90px;

          height: 2px;

          margin: auto;

          background: linear-gradient(90deg, transparent, #d4af37, transparent);

          opacity: 0.8;
        }

        .invite-top-line {
          margin-bottom: 28px;
        }

        .invite-bottom-line {
          margin-top: 34px;
        }
        /* ---------- panorama gallery ---------- */
        .panorama {
          position: relative;
          width: 100%;
          height: 300px;
          overflow: hidden;
        }
        .panorama-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          pointer-events: none;
          animation: ring-spin 60s linear infinite;
        }
        @keyframes ring-spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .panorama-track {
          position: absolute;
          inset: 0;
          display: flex;
          gap: 10px;
          width: max-content;
          animation: panorama-drift 32s linear infinite;
        }
        @keyframes panorama-drift {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .panorama-frame {
          position: relative;
          width: 230px;
          height: 300px;
          flex-shrink: 0;
        }
        .panorama-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .panorama-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(160deg, #eadfc4, #d9c79a);
        }
        .panorama-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          z-index: 3;
          pointer-events: none;
        }
        .panorama-fade--left {
          left: 0;
          background: linear-gradient(90deg, var(--cream), transparent);
        }
        .panorama-fade--right {
          right: 0;
          background: linear-gradient(270deg, var(--cream), transparent);
        }

        .date-detail {
          position: relative;
          z-index: 1;
          margin-top: 14px;
          color: #6b5f4f;
        }
        .venue-name {
          position: relative;
          z-index: 1;
          font-family: var(--font-display), serif;
          font-style: italic;
          font-size: 1.5rem;
          color: var(--maroon);
        }
        .map-frame {
          position: relative;
          z-index: 1;
          margin-top: 20px;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(198, 152, 47, 0.35);
        }
        .map-frame iframe {
          width: 100%;
          height: 100%;
          border: 0;
          filter: sepia(12%) saturate(92%);
        }
        .btn-outline {
          position: relative;
          z-index: 1;
          display: inline-block;
          margin-top: 18px;
          padding: 10px 22px;
          border: 1px solid var(--gold);
          border-radius: 999px;
          color: var(--maroon);
          text-decoration: none;
          font-family: var(--font-caption), sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          transition:
            background 200ms ease,
            transform 200ms ease;
        }
        .btn-outline:hover {
          background: rgba(198, 152, 47, 0.12);
          transform: translateY(-1px);
        }
        .btn-solid {
          position: relative;
          z-index: 1;
          display: inline-block;
          margin-top: 20px;
          padding: 13px 34px;
          border-radius: 999px;
          color: #fff8e8;
          text-decoration: none;
          font-family: var(--font-caption), sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          background: linear-gradient(135deg, #d4af37, #a97d24);
          box-shadow:
            0 10px 26px rgba(169, 125, 36, 0.32),
            inset 0 0 0 1px rgba(255, 240, 200, 0.35);
          transition:
            transform 200ms ease,
            box-shadow 200ms ease;
        }
        .btn-solid:hover {
          transform: translateY(-2px);
          box-shadow:
            0 14px 32px rgba(169, 125, 36, 0.4),
            inset 0 0 0 1px rgba(255, 240, 200, 0.45);
        }
        /* ---------- RSVP / BLESSING ---------- */

        .rsvp {
          text-align: center;
          padding: 70px 24px;
        }

        .rsvp-card {
          position: relative;
          max-width: 620px;
          margin: 0 auto;
          padding: 4px 10px;
          border-radius: 20px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.82),
            rgba(248, 242, 230, 0.7)
          );
          backdrop-filter: blur(10px);
          border: 1px solid rgba(198, 152, 47, 0.22);
          box-shadow:
            0 20px 55px rgba(70, 45, 18, 0.08),
            inset 0 0 30px rgba(212, 175, 55, 0.05);
          overflow: hidden;
        }

        .rsvp-card::before {
          content: "";
          position: absolute;
          inset: -35%;
          background: radial-gradient(
            circle,
            rgba(212, 175, 55, 0.14),
            transparent 65%
          );
          animation: blessingGlow 8s ease-in-out infinite;
          pointer-events: none;
        }
        .rsvp-quote {
          margin: 0;
          padding: 0;

          position: relative;
        }
        .rsvp-text {
          position: relative;
          margin: 14px auto;
          max-width: 420px;
          font-family: var(--font-display), serif;
          font-style: italic;
          font-size: clamp(1.2rem, 3vw, 1.6rem);
          line-height: 1;
          letter-spacing: 0.03em;
          color: #5b4334;
        }
        .rsvp-divider {
          width: 110px;
          height: 2px;

          margin: 22px auto;

          background: linear-gradient(90deg, transparent, #c6982f, transparent);

          opacity: 0.8;
        }
        @keyframes blessingGlow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }

          50% {
            opacity: 0.8;
            transform: scale(1.08);
          }
        }
        .program-section .program {
          position: relative;
          z-index: 1;
        }
        .program {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 320px;
          margin: 0 auto;
        }
        .program-row {
          display: grid;
          grid-template-columns: 60px 1fr;
          align-items: center;
          gap: 12px;
          text-align: left;
          padding: 10px 0;
          border-bottom: 1px solid rgba(198, 152, 47, 0.18);
        }
        .program-row:last-child {
          border-bottom: none;
        }
        .program-time {
          font-family: var(--font-display), serif;
          font-style: italic;
          font-size: 1.1rem;
          color: var(--gold);
        }
        .program-title {
          color: var(--text);
        }
        .blessing-verse {
          position: relative;
          z-index: 1;
          font-family: var(--font-display), serif;
          font-style: italic;
          font-size: 1.15rem;
          line-height: 2;
          color: var(--maroon);
        }
        .hosts-card {
          position: relative;
          z-index: 1;
          display: inline-flex;
          flex-direction: column;
          gap: 20px;
          padding: 28px 40px;
          border-radius: 8px;
        }
        .host-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .host-role {
          font-family: var(--font-caption), sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          color: var(--gold);
          text-transform: uppercase;
        }
        .host-names {
          font-family: var(--font-display), serif;
          font-style: italic;
          font-size: 1.3rem;
          color: var(--maroon);
        }
        .footer {
          text-align: center;
          padding: 48px 32px 64px;
          font-family: var(--font-caption), sans-serif;
          font-size: 0.78rem;
          color: #8a7c63;
        }
        .footer a {
          color: var(--maroon);
          text-decoration: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .invite-root,
          .music-marquee span,
          .panorama-track,
          .panorama-ring,
          .reveal,
          .scroll-rail-fill,
          .hero-scroll-cue span,
          .guest-name::before,
          .motif-layer {
            transition: none !important;
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      `}</style>
    </div>
  );
}
