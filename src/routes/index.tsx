import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { DURATION, createFilm, type Film } from "@/film/engine";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [booting, setBooting] = useState(true);
  const [ended, setEnded] = useState(false);
  const [failed, setFailed] = useState(false);
  const filmRef = useRef<Film | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf = 0;
    let start = 0;
    let paused = false;
    let held = 0;
    let stop = false;
    const params = new URLSearchParams(window.location.search);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fixed = params.has("t") ? Number(params.get("t")) : null;

    const paintBar = (t: number) => {
      if (barRef.current) barRef.current.style.width = `${(t / DURATION) * 100}%`;
    };

    const loop = (now: number) => {
      if (stop) return;
      const film = filmRef.current;
      if (!film) return;
      const t = paused ? held : Math.min(DURATION, (now - start) / 1000);
      film.seek(t);
      paintBar(t);
      if (!paused && t >= DURATION) {
        paused = true;
        held = DURATION;
        setEnded(true);
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const api = {
      ready: false,
      duration: DURATION,
      seek(t: number) {
        paused = true;
        held = t;
        filmRef.current?.seek(t);
        paintBar(t);
      },
      play() {
        if (!filmRef.current) return;
        paused = false;
        start = performance.now() - held * 1000;
        setEnded(false);
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      },
      pause() {
        paused = true;
      },
    };

    createFilm(canvas)
      .then((film) => {
        filmRef.current = film;
        api.ready = true;
        window.__GROK_FILM__ = {
          ...api,
          scan: () => film.scan(),
        };
        setBooting(false);
        if (fixed !== null && !Number.isNaN(fixed)) {
          api.seek(fixed);
          return;
        }
        if (reduce) {
          api.seek(21);
          setEnded(true);
          return;
        }
        held = 0;
        start = performance.now();
        raf = requestAnimationFrame(loop);
      })
      .catch(() => setFailed(true));

    const onClick = () => {
      if (!filmRef.current || fixed !== null) return;
      if (paused && held >= DURATION - 0.01) return;
      if (paused) api.play();
      else {
        held = Math.min(DURATION, (performance.now() - start) / 1000);
        api.pause();
      }
    };
    canvas.addEventListener("click", onClick);
    return () => {
      stop = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <main className="stage">
      <h1 className="sr-only">Grok</h1>
      <p className="sr-only">Know about everything. A launch film.</p>
      <canvas ref={canvasRef} id="film" width={1440} height={1440} aria-label="Grok launch film" />
      {booting && !failed ? <div className="boot">Grok</div> : null}
      {failed ? <div className="boot">Couldn’t load the film</div> : null}
      <div className="progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
      <button
        type="button"
        className={ended ? "replay show" : "replay"}
        onClick={() => window.__GROK_FILM__?.play()}
      >
        Replay
      </button>
    </main>
  );
}

declare global {
  interface Window {
    __GROK_FILM__?: {
      ready: boolean;
      duration: number;
      seek: (t: number) => void;
      play: () => void;
      pause: () => void;
      scan: () => Promise<{
        frames: number;
        median: number;
        spikes: Array<{ t: number; diff: number; allowed: boolean }>;
        allowedCuts: number;
      }>;
    };
  }
}
