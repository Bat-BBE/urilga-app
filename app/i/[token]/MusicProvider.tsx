"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";

type MusicContextValue = {
  /** Starts (or resumes) playback and fades to `targetVolume`.
   *  Call this from a real user gesture (e.g. a click handler) —
   *  that's what lets the browser allow the very first play(). */
  play: (targetVolume?: number, fadeMs?: number) => void;
  /** Fades the current volume down to 0 over `fadeMs`, then pauses. */
  fadeOut: (fadeMs?: number) => void;
  /** True once play() has successfully started audio at least once. */
  isPlayingRef: React.MutableRefObject<boolean>;
};

const MusicContext = createContext<MusicContextValue | null>(null);

/** Fades a single <audio> element's volume and calls back when done.
 *  Returns the interval id so callers can cancel it if needed. */
function fadeElementVolume(
  el: HTMLAudioElement,
  target: number,
  durationMs: number,
  onDone?: () => void,
) {
  const steps = 24;
  const stepTime = Math.max(16, durationMs / steps);
  const start = el.volume;
  const diff = target - start;
  let i = 0;
  const id = setInterval(() => {
    i += 1;
    const t = i / steps;
    el.volume = Math.min(1, Math.max(0, start + diff * t));
    if (i >= steps) {
      clearInterval(id);
      onDone?.();
    }
  }, stepTime);
  return id;
}

export function MusicProvider({
  src,
  loop = true,
  defaultVolume = 0.55,
  crossfadeMs = 900,
  children,
}: {
  src: string;
  loop?: boolean;
  defaultVolume?: number;
  crossfadeMs?: number;
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeIntervalsRef = useRef<Set<ReturnType<typeof setInterval>>>(
    new Set(),
  );
  const isPlayingRef = useRef(false);
  const isFirstSrcRef = useRef(true);

  function trackedFade(
    el: HTMLAudioElement,
    target: number,
    durationMs: number,
    onDone?: () => void,
  ) {
    const id = fadeElementVolume(el, target, durationMs, () => {
      activeIntervalsRef.current.delete(id);
      onDone?.();
    });
    activeIntervalsRef.current.add(id);
  }

  function clearAllFades() {
    activeIntervalsRef.current.forEach((id) => clearInterval(id));
    activeIntervalsRef.current.clear();
  }
  useEffect(() => {
    const previousAudio = audioRef.current;
    const wasPlaying = isPlayingRef.current;

    const nextAudio = new Audio(src);
    nextAudio.loop = loop;
    nextAudio.volume = 0;
    nextAudio.preload = "auto";
    nextAudio.addEventListener("error", () => {
      const err = nextAudio.error;
      // eslint-disable-next-line no-console
      console.error(
        `[MusicProvider] Failed to load "${src}" (code ${err?.code}). ` +
          `Check that the file exists at that path under /public and that ` +
          `the format is supported (mp3/ogg). Open the URL directly in a ` +
          `new tab to confirm it loads.`,
      );
    });

    if (isFirstSrcRef.current || !wasPlaying || !previousAudio) {
      audioRef.current = nextAudio;
      if (previousAudio) previousAudio.pause();
    } else {
      audioRef.current = nextAudio;
      trackedFade(previousAudio, 0, crossfadeMs, () => {
        previousAudio.pause();
      });
      nextAudio
        .play()
        .then(() => {
          isPlayingRef.current = true;
          trackedFade(nextAudio, defaultVolume, crossfadeMs);
        })
        .catch((err) => {
          console.warn(
            `[MusicProvider] play() blocked on track switch:`,
            err?.name,
            err?.message,
          );
          isPlayingRef.current = false;
        });
    }

    isFirstSrcRef.current = false;

    return () => {
      nextAudio.pause();
      if (audioRef.current === nextAudio) audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => clearAllFades, []);

  const play = useCallback(
    (targetVolume = defaultVolume, fadeMs = crossfadeMs) => {
      const audio = audioRef.current;
      if (!audio) return;
      if (isPlayingRef.current) {
        trackedFade(audio, targetVolume, fadeMs);
        return;
      }
      audio
        .play()
        .then(() => {
          isPlayingRef.current = true;
          trackedFade(audio, targetVolume, fadeMs);
        })
        .catch((err) => {
          console.warn(
            `[MusicProvider] play() blocked:`,
            err?.name,
            err?.message,
          );
          isPlayingRef.current = false;
        });
    },
    [defaultVolume, crossfadeMs],
  );

  const fadeOut = useCallback(
    (fadeMs = crossfadeMs) => {
      const audio = audioRef.current;
      if (!audio) return;
      trackedFade(audio, 0, fadeMs, () => {
        audio.pause();
        isPlayingRef.current = false;
      });
    },
    [crossfadeMs],
  );

  return (
    <MusicContext.Provider value={{ play, fadeOut, isPlayingRef }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used inside a <MusicProvider>");
  }
  return ctx;
}
