"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo de partículas no mesmo sistema do site DS (dseng *.github.io):
 * pontos nas cores da marca subindo devagar, com balanço lateral, brilho
 * pulsante e halo nas partículas maiores; reage de leve à rolagem.
 */
const CORES = ["196,132,252", "255,255,255", "217,70,239", "139,43,226"];

type Particula = {
  x: number;
  y: number;
  r: number;
  z: number;
  vy: number;
  ph: number;
  sw: number;
  c: string;
  a: number;
};

export default function FundoParticulas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    if (!cx) return;

    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let PW = 0;
    let PH = 0;
    let P: Particula[] = [];
    let ps = window.scrollY;
    let raf = 0;
    let parar = false;

    const mk = (inicial: boolean): Particula => {
      const z = Math.random();
      return {
        x: Math.random() * PW,
        y: inicial ? Math.random() * PH : PH + 20 * dpr,
        r: (0.6 + z * 1.7) * dpr,
        z,
        vy: (0.12 + z * 0.34) * dpr,
        ph: Math.random() * 6.28,
        sw: (8 + Math.random() * 22) * dpr,
        c: CORES[(Math.random() * CORES.length) | 0],
        a: 0.2 + z * 0.5,
      };
    };

    const montar = () => {
      PW = cv.width = window.innerWidth * dpr;
      PH = cv.height = window.innerHeight * dpr;
      P = Array.from({ length: window.innerWidth < 700 ? 42 : 90 }, () => mk(true));
    };
    montar();

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    const desenhar = (t: number) => {
      if (parar) return;
      cx.clearRect(0, 0, PW, PH);
      const d = window.scrollY - ps;
      const e = 140 * dpr;
      ps = window.scrollY;
      for (const p of P) {
        if (!reduz) p.y -= p.vy + d * dpr * 0.2 * p.z;
        if (p.y < -20 * dpr) Object.assign(p, mk(false));
        else if (p.y > PH + 40 * dpr) p.y = -10 * dpr;
        const x = p.x + (reduz ? 0 : Math.sin(t / 2200 + p.ph) * p.sw);
        const f = clamp(Math.min(p.y, PH - p.y) / e, 0, 1) * (0.75 + 0.25 * Math.sin(t / 900 + p.ph));
        cx.fillStyle = `rgba(${p.c},1)`;
        cx.globalAlpha = p.a * f;
        cx.beginPath();
        cx.arc(x, p.y, p.r, 0, 6.283);
        cx.fill();
        if (p.z > 0.6) {
          cx.globalAlpha = p.a * f * 0.18;
          cx.beginPath();
          cx.arc(x, p.y, p.r * 3.2, 0, 6.283);
          cx.fill();
        }
      }
      cx.globalAlpha = 1;
      raf = requestAnimationFrame(desenhar);
    };
    raf = requestAnimationFrame(desenhar);

    window.addEventListener("resize", montar);
    return () => {
      parar = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", montar);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
