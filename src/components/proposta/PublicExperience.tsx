"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { LOGO_DS_BRANCA } from "@/assets/logo";
import { FOTO_DOUGLAS } from "@/assets/douglas";

export interface EtapaPublica {
  numero: number;
  titulo: string;
  duracaoTexto: string;
  voceRecebe: string;
  precisoDeVoce: string;
  inicioCurta: string;
  fimCurta: string;
}

export interface PropostaPublica {
  clienteNome: string;
  primeiroNome: string;
  empresa: string;
  projetoNome: string;
  projetoResumo: string;
  valorVistaCentavos: number;
  valorParceladoCentavos: number;
  parcelasCartao: number;
  validadeCurta: string;
  validadeLonga: string;
  hojeLonga: string;
  saudacao: string;
  leituraMin: number;
  totalDiasUteis: number;
  etapas: EtapaPublica[];
  trabalhos: string[];
}

const WHATS_DSENG = "5511941199648";
const NICHOS = [
  "lojas", "moda", "beleza", "estética", "gastronomia", "advocacia",
  "arquitetura", "serviços", "saúde", "educação", "tecnologia", "varejo",
];
const INCLUSO = [
  "Logo principal exclusiva, criada do zero",
  "Variação da logo para usos diferentes",
  "Marca d'água para proteger suas fotos",
  "Paleta de cores da marca",
  "Tipografia definida (as fontes da sua marca)",
  "Arquivos finais em alta, para impressão e para redes sociais",
  "Apresentação da marca aplicada em exemplos reais",
];
const GARANTIAS = [
  {
    titulo: "Exclusiva de verdade",
    texto: "Sua marca nasce do zero, pensada para o seu negócio. Nada de modelo pronto nem arte copiada de banco de imagens.",
  },
  {
    titulo: "Os arquivos são seus",
    texto: "Na entrega, todos os arquivos finais são seus, em alta qualidade, para usar onde quiser: loja, embalagem, rede social e impressão.",
  },
  {
    titulo: "Segunda metade só na entrega",
    texto: "Na opção entrada + entrega, você paga a segunda metade somente quando receber os arquivos finais aprovados.",
  },
];
const FAQ = [
  {
    p: "O que eu preciso enviar para começarmos?",
    r: "O nome da loja como você quer na logo, o ramo do negócio e, se tiver, referências de estilos que você gosta. O resto a gente define junto na conversa de início.",
  },
  {
    p: "Posso pedir ajustes na logo?",
    r: "Pode. Na etapa de apresentação você escolhe o conceito e pede os ajustes até ficar do seu jeito, antes da entrega final.",
  },
  {
    p: "Os arquivos são meus mesmo?",
    r: "São. Você recebe os arquivos finais em alta, para impressão e para redes sociais, e pode usar a marca sem limitação nos seus materiais.",
  },
  {
    p: "E se depois eu quiser outros materiais?",
    r: "É só chamar no WhatsApp. Quem já é cliente da DSENG tem caminho direto para novos materiais seguindo a mesma identidade da marca.",
  },
];

function fmt(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type Forma = "pix" | "entrada" | "cartao";

const SECOES = [
  { id: "abertura", rotulo: "Proposta" },
  { id: "trabalhos", rotulo: "Trabalhos" },
  { id: "jornada", rotulo: "A jornada" },
  { id: "investimento", rotulo: "Investimento" },
  { id: "faq", rotulo: "Dúvidas" },
];

export default function PublicExperience({ d }: { d: PropostaPublica }) {
  const raiz = useRef<HTMLDivElement>(null);
  const fotoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const precoRef = useRef<HTMLSpanElement>(null);
  const [secao, setSecao] = useState(0);
  const [indiceAberto, setIndiceAberto] = useState(false);
  const [ativo, setAtivo] = useState(0);
  const [forma, setForma] = useState<Forma>("pix");
  const [faqAberto, setFaqAberto] = useState<number | null>(0);
  const [progresso, setProgresso] = useState(0);
  const arrasto = useRef<{ x: number } | null>(null);

  const totalTrabalhos = d.trabalhos.length;
  const metade = Math.round(d.valorParceladoCentavos / 2);
  const outraMetade = d.valorParceladoCentavos - metade;
  const parcela = Math.round(d.valorParceladoCentavos / Math.max(1, d.parcelasCartao));

  const resumoForma =
    forma === "pix"
      ? `${fmt(d.valorVistaCentavos)} à vista no Pix`
      : forma === "entrada"
        ? `${fmt(metade)} de entrada + ${fmt(outraMetade)} na entrega`
        : `${d.parcelasCartao}x de ${fmt(parcela)} no cartão`;

  const linkAprovacao = `https://wa.me/${WHATS_DSENG}?text=${encodeURIComponent(
    `Olá, Douglas! Sou ${d.clienteNome}${d.empresa ? `, da ${d.empresa}` : ""}. Vi a minha proposta e quero aprovar: projeto ${d.projetoNome}. Forma de pagamento que prefiro: ${resumoForma}.`
  )}`;
  const linkFalar = `https://wa.me/${WHATS_DSENG}?text=${encodeURIComponent(
    `Olá, Douglas! Sou ${d.clienteNome}. Estou vendo a minha proposta e quero tirar uma dúvida.`
  )}`;

  /* ---------- motions: Lenis + GSAP + cursor + partículas ---------- */
  useEffect(() => {
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fino = window.matchMedia("(pointer: fine)").matches;
    let lenis: Lenis | null = null;
    let ctx: gsap.Context | null = null;

    if (!reduz) {
      gsap.registerPlugin(ScrollTrigger);
      lenis = new Lenis({ lerp: 0.09, anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-revela]").forEach((el) => {
          gsap.from(el, {
            y: 44, opacity: 0, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%" },
          });
        });
        // Preço gigante: contagem ao entrar na tela
        if (precoRef.current) {
          const alvo = precoRef.current;
          const obj = { v: 0 };
          gsap.to(obj, {
            v: d.valorVistaCentavos, duration: 1.4, ease: "power2.out",
            scrollTrigger: { trigger: alvo, start: "top 85%" },
            onUpdate: () => { alvo.textContent = fmt(Math.round(obj.v)); },
          });
        }
      }, raiz);
    }

    // Barra de progresso de leitura
    const aoRolar = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgresso(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar();

    // Indicador de seção
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            const i = SECOES.findIndex((s) => s.id === e.target.id);
            if (i >= 0) setSecao(i);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECOES.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });

    // Cursor customizado (só com mouse)
    let cursorRaf = 0;
    if (fino && !reduz && cursorRef.current) {
      document.body.classList.add("cursor-dseng");
      const cur = cursorRef.current;
      const qx = gsap.quickTo(cur, "x", { duration: 0.35, ease: "power3" });
      const qy = gsap.quickTo(cur, "y", { duration: 0.35, ease: "power3" });
      const mover = (e: MouseEvent) => {
        qx(e.clientX); qy(e.clientY);
        const alvo = e.target as HTMLElement | null;
        const interativo = alvo?.closest("a,button,[data-cursor]");
        if (interativo) cur.dataset.ativo = "1";
        else delete cur.dataset.ativo;
      };
      window.addEventListener("mousemove", mover);
      cursorRaf = 1;
      var limparCursor = () => {
        window.removeEventListener("mousemove", mover);
        document.body.classList.remove("cursor-dseng");
      };
    }

    // Partículas sutis
    let parar = false;
    const cv = canvasRef.current;
    if (cv && !reduz) {
      const c2d = cv.getContext("2d");
      if (c2d) {
        const pontos = Array.from({ length: 70 }, () => ({
          x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + 0.4,
          vx: (Math.random() - 0.5) * 0.00035, vy: (Math.random() - 0.5) * 0.00035,
          roxo: Math.random() > 0.45,
        }));
        const desenhar = () => {
          if (parar) return;
          cv.width = window.innerWidth; cv.height = window.innerHeight;
          c2d.clearRect(0, 0, cv.width, cv.height);
          pontos.forEach((p) => {
            p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1;
            c2d.beginPath();
            c2d.arc(p.x * cv.width, p.y * cv.height, p.r, 0, Math.PI * 2);
            c2d.fillStyle = p.roxo ? "rgba(217,52,247,0.5)" : "rgba(139,43,226,0.45)";
            c2d.fill();
          });
          requestAnimationFrame(desenhar);
        };
        desenhar();
      }
    }

    return () => {
      parar = true;
      window.removeEventListener("scroll", aoRolar);
      obs.disconnect();
      if (cursorRaf) limparCursor();
      ctx?.revert();
      lenis?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- foto com revelação pelo mouse / dedo ---------- */
  useEffect(() => {
    const caixa = fotoRef.current;
    if (!caixa) return;
    const camada = caixa.querySelector<HTMLElement>("[data-revela-foto]");
    if (!camada) return;
    const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;

    const posiciona = (px: number, py: number) => {
      camada.style.clipPath = `circle(96px at ${px}% ${py}%)`;
    };
    posiciona(50, 38);

    const noMover = (e: PointerEvent) => {
      const r = caixa.getBoundingClientRect();
      posiciona(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    };
    caixa.addEventListener("pointermove", noMover);

    // Sem mouse (celular): o círculo passeia sozinho pela foto
    if (window.matchMedia("(pointer: coarse)").matches && !reduz) {
      const inicio = performance.now();
      const passeio = (t: number) => {
        const s = (t - inicio) / 1000;
        posiciona(50 + Math.sin(s * 0.7) * 26, 42 + Math.cos(s * 0.9) * 20);
        rafId = requestAnimationFrame(passeio);
      };
      rafId = requestAnimationFrame(passeio);
    }
    return () => {
      caixa.removeEventListener("pointermove", noMover);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const irPara = (id: string) => {
    setIndiceAberto(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={raiz} className="grao relative min-h-screen overflow-x-clip">
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-60" aria-hidden />
      {/* Cursor customizado */}
      <div
        ref={cursorRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-magenta/80 shadow-[0_0_24px_rgba(217,52,247,0.45)] transition-[width,height,background-color] duration-200 data-[ativo]:h-14 data-[ativo]:w-14 data-[ativo]:bg-magenta/10 md:block"
        style={{ transform: "translate(-100px,-100px)" }}
      />
      {/* Glows de fundo */}
      <div aria-hidden className="pointer-events-none fixed -left-40 top-1/4 z-0 h-96 w-96 rounded-full bg-violeta/25 blur-[130px]" />
      <div aria-hidden className="pointer-events-none fixed -right-40 top-2/3 z-0 h-96 w-96 rounded-full bg-magenta/15 blur-[130px]" />

      {/* ---------- Header fixo ---------- */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-linha/70 bg-fundo/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="#abertura" onClick={(e) => { e.preventDefault(); irPara("abertura"); }} className="flex items-center gap-3">
            <Image src={LOGO_DS_BRANCA} alt="DSENG DESIGNER" width={64} height={37} priority />
          </a>
          <p className="hidden text-[11px] font-bold uppercase tracking-[0.25em] text-mudo sm:block">
            {String(secao + 1).padStart(2, "0")} · {SECOES[secao].rotulo}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIndiceAberto(true)}
              className="rounded-full border border-linha px-4 py-2 text-xs font-bold uppercase tracking-widest text-creme transition hover:border-magenta"
            >
              Índice
            </button>
            <a
              href={linkFalar}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gradient-to-r from-violeta to-fucsia px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-90"
            >
              Falar comigo
            </a>
          </div>
        </div>
        <div className="h-[2px] w-full bg-linha/40">
          <div className="h-full bg-gradient-to-r from-violeta to-magenta transition-[width] duration-150" style={{ width: `${progresso * 100}%` }} />
        </div>
      </header>

      {/* Gaveta do índice */}
      {indiceAberto ? (
        <div className="fixed inset-0 z-[80] flex justify-end bg-black/60" onClick={() => setIndiceAberto(false)}>
          <aside
            className="h-full w-80 max-w-[85vw] border-l border-linha bg-painel p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-mudo">Índice da proposta</p>
              <button type="button" onClick={() => setIndiceAberto(false)} className="rounded-full border border-linha px-3 py-1.5 text-xs font-bold uppercase tracking-widest hover:border-magenta">
                Fechar
              </button>
            </div>
            <p className="mt-3 text-sm text-mudo">Proposta para {d.clienteNome} · válida até {d.validadeCurta}</p>
            <nav className="mt-8 space-y-2">
              {SECOES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => irPara(s.id)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-linha px-4 py-3 text-left font-semibold transition hover:border-magenta"
                >
                  <span className="text-magenta">{String(i + 1).padStart(2, "0")}</span> {s.rotulo}
                </button>
              ))}
            </nav>
            <a href={linkAprovacao} target="_blank" rel="noreferrer" className="mt-8 block rounded-full bg-gradient-to-r from-violeta to-fucsia px-5 py-3 text-center font-bold text-white">
              Aprovar pelo WhatsApp
            </a>
          </aside>
        </div>
      ) : null}

      <main className="relative z-10">
        {/* ---------- 01 Abertura ---------- */}
        <section id="abertura" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 pt-32 md:pt-40">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p data-revela className="inline-flex items-center gap-2 rounded-full border border-linha bg-painel/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-mudo">
                <span className="h-2 w-2 rounded-full bg-magenta shadow-[0_0_12px_#D934F7]" />
                Proposta comercial · Válida até {d.validadeCurta}
              </p>
              <p data-revela className="mt-8 text-lg text-mudo">
                {d.saudacao}. Esta proposta é para
              </p>
              <h1 data-revela className="mt-2 text-5xl font-extrabold leading-[1.02] md:text-7xl">
                {d.primeiroNome}{" "}
                <span className="bg-gradient-to-r from-violeta via-fucsia to-magenta bg-clip-text font-serif italic text-transparent">
                  {d.clienteNome.slice(d.primeiroNome.length).trim()}
                </span>
              </h1>
              {d.empresa ? (
                <p data-revela className="mt-3 text-xl font-semibold text-creme/90">{d.empresa}</p>
              ) : null}
              <p data-revela className="mt-6 max-w-xl text-lg leading-relaxed text-mudo">
                Uma marca com cara de <em className="font-serif text-creme">empresa grande</em>, criada do
                zero para o seu negócio passar confiança em cada detalhe.
              </p>
              <div data-revela className="mt-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-mudo">
                <Image src={FOTO_DOUGLAS} alt="Douglas, da DSENG DESIGNER" width={38} height={38} className="h-10 w-10 rounded-full object-cover ring-2 ring-magenta/60" />
                <span>
                  Preparada por Douglas · DSENG DESIGNER
                  <span className="mt-1 block font-semibold normal-case tracking-normal text-mudo/80">
                    {d.hojeLonga} · leitura de {d.leituraMin} min
                  </span>
                </span>
              </div>
              <div data-revela className="mt-10 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-mudo">
                <span className="animate-role block h-10 w-[2px] bg-gradient-to-b from-magenta to-transparent" />
                Role para começar
              </div>
            </div>

            {/* Foto com revelação */}
            <div data-revela>
              <div
                ref={fotoRef}
                data-cursor
                className="relative mx-auto aspect-[3/4] w-full max-w-md select-none overflow-hidden rounded-[2rem] border border-linha shadow-[0_0_90px_rgba(139,43,226,0.35)]"
              >
                <Image
                  src={FOTO_DOUGLAS}
                  alt="Douglas, designer da DSENG"
                  fill
                  priority
                  className="object-cover grayscale contrast-125"
                  sizes="(max-width: 768px) 90vw, 420px"
                />
                <div aria-hidden className="absolute inset-0 bg-violeta/35 mix-blend-multiply" />
                <Image
                  data-revela-foto
                  src={FOTO_DOUGLAS}
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  style={{ clipPath: "circle(96px at 50% 38%)" }}
                  sizes="(max-width: 768px) 90vw, 420px"
                />
                <div className="absolute bottom-4 left-1/2 w-max -translate-x-1/2 rounded-full bg-black/55 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur">
                  Passe o mouse · ou o dedo
                </div>
              </div>
              <p className="mt-4 text-center text-xs uppercase tracking-[0.25em] text-mudo">
                Douglas · designer e fundador da DSENG
              </p>
            </div>
          </div>
        </section>

        {/* ---------- 02 Trabalhos ---------- */}
        <section id="trabalhos" className="scroll-mt-24 border-t border-linha/60 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <p data-revela className="text-xs font-bold uppercase tracking-[0.3em] text-magenta">§ 02 · Trabalhos</p>
            <h2 data-revela className="mt-3 text-4xl font-extrabold md:text-5xl">
              Antes do preço, <span className="font-serif italic text-fucsia">o trabalho</span>
            </h2>
            <div data-revela className="mt-8 grid gap-6 rounded-3xl border border-linha bg-painel p-6 md:grid-cols-[auto_1fr] md:items-center">
              <Image src={FOTO_DOUGLAS} alt="Douglas" width={84} height={84} className="h-20 w-20 rounded-2xl object-cover ring-2 ring-magenta/50" />
              <div>
                <p className="font-bold">Douglas <span className="text-mudo">· DESIGNER, DSENG</span></p>
                <p className="mt-1 text-mudo">
                  Crio logotipos exclusivos, desenhados do zero para cada negócio. Sem modelo pronto,
                  sem arte de banco de imagens: a sua marca nasce só sua.
                </p>
              </div>
            </div>

            <div data-revela className="mt-10 flex items-end gap-4">
              <p className="bg-gradient-to-r from-violeta to-magenta bg-clip-text text-6xl font-extrabold text-transparent md:text-7xl">+150</p>
              <p className="pb-2 text-sm font-semibold uppercase tracking-widest text-mudo">marcas criadas<br />para negócios de todos os nichos</p>
            </div>
          </div>

          {/* Marquee de nichos */}
          <div className="relative mt-12 overflow-hidden border-y border-linha/60 py-4" aria-hidden>
            <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
              {[...NICHOS, ...NICHOS].map((n, i) => (
                <span key={i} className="flex items-center gap-8 text-sm font-bold uppercase tracking-[0.3em] text-mudo">
                  {n} <span className="text-magenta">✦</span>
                </span>
              ))}
            </div>
          </div>

          {/* Coverflow */}
          <div className="mx-auto max-w-6xl px-4">
            <div
              data-revela
              className="relative mx-auto mt-12 h-[380px] max-w-4xl touch-pan-y select-none md:h-[440px]"
              style={{ perspective: "1200px" }}
              onPointerDown={(e) => { arrasto.current = { x: e.clientX }; }}
              onPointerUp={(e) => {
                if (!arrasto.current) return;
                const dx = e.clientX - arrasto.current.x;
                if (dx < -42) setAtivo((a) => Math.min(totalTrabalhos - 1, a + 1));
                if (dx > 42) setAtivo((a) => Math.max(0, a - 1));
                arrasto.current = null;
              }}
            >
              {d.trabalhos.map((src, i) => {
                const off = i - ativo;
                if (Math.abs(off) > 3) return null;
                return (
                  <button
                    key={src}
                    type="button"
                    aria-label={`Trabalho ${i + 1}`}
                    onClick={() => setAtivo(i)}
                    className="absolute left-1/2 top-1/2 h-[320px] w-[240px] overflow-hidden rounded-3xl border border-linha shadow-[0_30px_60px_rgba(0,0,0,0.55)] transition-all duration-500 md:h-[380px] md:w-[285px]"
                    style={{
                      transform: `translate(-50%,-50%) translateX(${off * 58}%) rotateY(${off * -32}deg) scale(${1 - Math.abs(off) * 0.13})`,
                      zIndex: 20 - Math.abs(off),
                      opacity: 1 - Math.abs(off) * 0.22,
                    }}
                  >
                    <Image src={src} alt={`Trabalho da DSENG ${i + 1}`} fill className="object-cover" sizes="285px" draggable={false} />
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              <button type="button" onClick={() => setAtivo((a) => Math.max(0, a - 1))} className="rounded-full border border-linha px-4 py-2 text-sm font-bold hover:border-magenta" aria-label="Anterior">←</button>
              <p className="text-sm font-bold tracking-widest text-mudo">
                {String(ativo + 1).padStart(2, "0")} / {String(totalTrabalhos).padStart(2, "0")}
              </p>
              <button type="button" onClick={() => setAtivo((a) => Math.min(totalTrabalhos - 1, a + 1))} className="rounded-full border border-linha px-4 py-2 text-sm font-bold hover:border-magenta" aria-label="Próximo">→</button>
            </div>
            <p className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-mudo">Arraste ou use as setas</p>
            <div className="mx-auto mt-4 h-1 w-56 overflow-hidden rounded-full bg-linha/50">
              <div className="h-full bg-gradient-to-r from-violeta to-magenta transition-all duration-500" style={{ width: `${((ativo + 1) / totalTrabalhos) * 100}%` }} />
            </div>
          </div>
        </section>

        {/* ---------- 03 Jornada ---------- */}
        <section id="jornada" className="scroll-mt-24 border-t border-linha/60 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <p data-revela className="text-xs font-bold uppercase tracking-[0.3em] text-magenta">§ 03 · A jornada</p>
            <h2 data-revela className="mt-3 text-4xl font-extrabold md:text-5xl">
              Da aprovação <span className="font-serif italic text-fucsia">à entrega</span>
            </h2>
            <div data-revela className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-linha bg-painel px-5 py-2.5 text-sm font-bold">
                Prazo total · {d.totalDiasUteis} dias úteis
              </span>
              <span className="rounded-full border border-linha bg-painel px-5 py-2.5 text-sm font-bold">
                {d.etapas.length} etapas
              </span>
            </div>
            <p data-revela className="mt-4 max-w-2xl text-mudo">
              O prazo começa a contar quando você aprova a proposta. Fins de semana não contam,
              e cada data abaixo já está calculada a partir de hoje.
            </p>

            <div className="relative mt-12">
              <div aria-hidden className="absolute left-[19px] top-0 h-full w-[2px] bg-gradient-to-b from-magenta via-violeta to-transparent md:left-1/2" />
              <div className="space-y-8">
                {d.etapas.map((e, i) => (
                  <article
                    key={e.numero}
                    data-revela
                    className={`relative pl-14 md:w-1/2 md:pl-0 ${i % 2 === 0 ? "md:pr-14" : "md:ml-auto md:pl-14"}`}
                  >
                    <span
                      aria-hidden
                      className="absolute left-[9px] top-6 h-[22px] w-[22px] rounded-full border-2 border-magenta bg-fundo shadow-[0_0_18px_rgba(217,52,247,0.7)] md:left-auto md:top-6"
                      style={i % 2 === 0 ? { right: "-11px" } : { left: "-11px" }}
                    />
                    <div className="rounded-3xl border border-linha bg-painel p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-magenta">
                          {String(e.numero).padStart(2, "0")} · {e.titulo}
                        </p>
                        <p className="rounded-full bg-magenta/10 px-3 py-1 text-xs font-bold text-fucsia">{e.duracaoTexto}</p>
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-mudo">
                        {e.inicioCurta === e.fimCurta ? e.inicioCurta : `${e.inicioCurta} a ${e.fimCurta}`}
                      </p>
                      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-mudo">Você recebe</p>
                      <p className="mt-1 leading-relaxed">{e.voceRecebe}</p>
                      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-mudo">Preciso de você</p>
                      <p className="mt-1 leading-relaxed text-creme/85">{e.precisoDeVoce}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 04 Investimento ---------- */}
        <section id="investimento" className="scroll-mt-24 border-t border-linha/60 py-20">
          <div className="mx-auto max-w-6xl px-4">
            <p data-revela className="text-xs font-bold uppercase tracking-[0.3em] text-magenta">§ 04 · Investimento</p>
            <p data-revela className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-mudo">O seu projeto</p>
            <h2 data-revela className="mt-2 text-4xl font-extrabold md:text-5xl">{d.projetoNome}</h2>
            <p data-revela className="mt-4 max-w-2xl text-lg leading-relaxed text-mudo">{d.projetoResumo}</p>
            <div data-revela className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-linha bg-painel px-4 py-2 text-sm font-bold">{d.etapas.length} etapas</span>
              <span className="rounded-full border border-linha bg-painel px-4 py-2 text-sm font-bold">{d.totalDiasUteis} dias úteis</span>
              <span className="rounded-full border border-magenta/50 bg-magenta/10 px-4 py-2 text-sm font-bold text-fucsia">
                Condição válida até {d.validadeLonga}
              </span>
            </div>

            <div data-revela className="relative mt-12 overflow-hidden rounded-[2rem] border border-linha bg-painel p-8 md:p-12">
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-magenta/20 blur-[100px]" />
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-mudo">Investimento</p>
              <p className="mt-3 text-6xl font-extrabold md:text-8xl">
                <span ref={precoRef}>{fmt(d.valorVistaCentavos)}</span>
              </p>
              <p className="mt-3 text-mudo">
                à vista no Pix, ou {d.parcelasCartao}x de {fmt(parcela)} no cartão
              </p>

              {/* Abas de pagamento */}
              <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Forma de pagamento">
                {(
                  [
                    { id: "pix", rotulo: "Pix à vista" },
                    { id: "entrada", rotulo: "Entrada + entrega" },
                    { id: "cartao", rotulo: "Cartão" },
                  ] as { id: Forma; rotulo: string }[]
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={forma === t.id}
                    onClick={() => setForma(t.id)}
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                      forma === t.id
                        ? "bg-gradient-to-r from-violeta to-fucsia text-white"
                        : "border border-linha text-creme hover:border-magenta"
                    }`}
                  >
                    {t.rotulo}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-linha bg-fundo/60 p-5">
                {forma === "pix" ? (
                  <p className="text-lg">
                    <strong>{fmt(d.valorVistaCentavos)}</strong> no Pix, à vista.
                    {d.valorParceladoCentavos > d.valorVistaCentavos
                      ? ` São ${fmt(d.valorParceladoCentavos - d.valorVistaCentavos)} a menos que no parcelado.`
                      : " Pagamento único e a gente já começa."}
                  </p>
                ) : forma === "entrada" ? (
                  <p className="text-lg">
                    <strong>{fmt(metade)}</strong> para começar e{" "}
                    <strong>{fmt(outraMetade)}</strong> somente na entrega dos arquivos finais.
                  </p>
                ) : (
                  <p className="text-lg">
                    <strong>{d.parcelasCartao}x de {fmt(parcela)}</strong> no cartão de crédito,
                    total de {fmt(d.valorParceladoCentavos)}.
                  </p>
                )}
              </div>

              <a
                href={linkAprovacao}
                target="_blank"
                rel="noreferrer"
                className="mt-8 block rounded-full bg-gradient-to-r from-violeta to-fucsia px-8 py-4 text-center text-lg font-extrabold text-white shadow-[0_0_40px_rgba(217,52,247,0.35)] transition hover:opacity-90"
              >
                Aprovar pelo WhatsApp
              </a>
              <p className="mt-3 text-center text-sm text-mudo">
                No WhatsApp a gente confirma a forma de pagamento escolhida: {resumoForma}.
              </p>
            </div>

            {/* Incluso + garantias */}
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div data-revela className="rounded-3xl border border-linha bg-painel p-7">
                <h3 className="text-xl font-extrabold">O que está incluso</h3>
                <ul className="mt-5 space-y-3">
                  {INCLUSO.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <span className="mt-0.5 text-emerald-400">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                {GARANTIAS.map((g) => (
                  <div key={g.titulo} data-revela className="rounded-3xl border border-linha bg-painel p-7">
                    <h3 className="text-lg font-extrabold text-fucsia">{g.titulo}</h3>
                    <p className="mt-2 leading-relaxed text-creme/85">{g.texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 05 FAQ ---------- */}
        <section id="faq" className="scroll-mt-24 border-t border-linha/60 py-20">
          <div className="mx-auto max-w-4xl px-4">
            <p data-revela className="text-xs font-bold uppercase tracking-[0.3em] text-magenta">§ 05 · Dúvidas</p>
            <h2 data-revela className="mt-3 text-4xl font-extrabold md:text-5xl">
              Perguntas <span className="font-serif italic text-fucsia">frequentes</span>
            </h2>
            <div className="mt-10 space-y-3">
              {FAQ.map((item, i) => {
                const aberto = faqAberto === i;
                return (
                  <div key={item.p} data-revela className="overflow-hidden rounded-3xl border border-linha bg-painel">
                    <button
                      type="button"
                      onClick={() => setFaqAberto(aberto ? null : i)}
                      aria-expanded={aberto}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold"
                    >
                      {item.p}
                      <span className={`text-2xl text-magenta transition-transform duration-300 ${aberto ? "rotate-45" : ""}`}>+</span>
                    </button>
                    <div className={`grid transition-all duration-300 ${aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 leading-relaxed text-mudo">{item.r}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div data-revela className="mt-12 rounded-[2rem] border border-magenta/40 bg-gradient-to-br from-violeta/25 to-magenta/10 p-8 text-center">
              <p className="text-2xl font-extrabold">Bora tirar a sua marca do papel?</p>
              <p className="mx-auto mt-2 max-w-md text-mudo">
                A proposta vale até {d.validadeLonga}. Aprovando, a gente já marca a conversa de início.
              </p>
              <a href={linkAprovacao} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-gradient-to-r from-violeta to-fucsia px-8 py-3.5 font-extrabold text-white transition hover:opacity-90">
                Aprovar pelo WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ---------- Rodapé ---------- */}
        <footer className="border-t border-linha/60 py-14">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <p className="bg-gradient-to-r from-violeta via-fucsia to-magenta bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
              DSENG DESIGNER
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href={linkFalar} target="_blank" rel="noreferrer" className="rounded-full border border-linha px-5 py-2.5 text-sm font-bold hover:border-magenta">
                WhatsApp
              </a>
              <a href="https://www.instagram.com/dseng.designer" target="_blank" rel="noreferrer" className="rounded-full border border-linha px-5 py-2.5 text-sm font-bold hover:border-magenta">
                @dseng.designer
              </a>
            </div>
            <p className="mt-8 text-sm text-mudo">
              Proposta para {d.clienteNome}
              {d.empresa ? ` · ${d.empresa}` : ""} · válida até {d.validadeCurta} · © DSENG DESIGNER
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
