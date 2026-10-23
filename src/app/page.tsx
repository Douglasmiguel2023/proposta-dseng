import Link from "next/link";
import Image from "next/image";
import { LOGO_DS_BRANCA } from "@/assets/logo";
import FundoParticulas from "@/components/FundoParticulas";

export default function Home() {
  return (
    <main className="grao relative flex min-h-screen items-center justify-center overflow-x-clip px-6 py-16">
      {/* Mesmo fundo do site DS: partículas da marca + glows */}
      <FundoParticulas />
      <div aria-hidden className="pointer-events-none fixed -left-40 top-1/4 z-0 h-96 w-96 rounded-full bg-violeta/25 blur-[130px]" />
      <div aria-hidden className="pointer-events-none fixed -right-40 top-2/3 z-0 h-96 w-96 rounded-full bg-magenta/15 blur-[130px]" />

      <div className="group/card relative z-10 w-full max-w-xl rounded-[2rem] border border-linha/70 bg-painel/60 px-8 py-12 text-center shadow-[0_0_60px_rgba(139,43,226,0.15)] backdrop-blur-md transition duration-500 hover:-translate-y-1 hover:border-magenta/60 hover:shadow-[0_0_90px_rgba(217,52,247,0.30)] md:px-12">
        <div className="animate-flutua inline-block">
          <Image
            src={LOGO_DS_BRANCA}
            alt="DSENG DESIGNER"
            width={150}
            height={87}
            priority
            className="transition duration-500 hover:scale-110 hover:drop-shadow-[0_0_25px_rgba(217,52,247,0.65)]"
          />
        </div>
        <h1 className="mt-8 text-3xl font-extrabold md:text-5xl">
          Propostas{" "}
          <span className="bg-gradient-to-r from-violeta to-fucsia bg-clip-text text-transparent">
            DSENG
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-mudo">
          Cada cliente recebe um link próprio com a proposta dele. Se você recebeu um link, abra ele direto.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/p/exemplo"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violeta to-fucsia px-6 py-3 font-semibold text-white shadow-[0_0_25px_rgba(217,52,247,0.35)] transition duration-300 hover:scale-105 hover:shadow-[0_0_45px_rgba(217,52,247,0.55)] active:scale-95"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            Ver proposta de exemplo
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-linha px-6 py-3 font-semibold text-creme transition duration-300 hover:-translate-y-0.5 hover:border-magenta hover:bg-magenta/10 hover:shadow-[0_0_30px_rgba(217,52,247,0.25)] active:scale-95"
          >
            Área do Douglas
          </Link>
        </div>
      </div>
    </main>
  );
}
