import Link from "next/link";
import Image from "next/image";
import { LOGO_DS_BRANCA } from "@/assets/logo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Image src={LOGO_DS_BRANCA} alt="DSENG DESIGNER" width={150} height={87} priority />
      <div>
        <h1 className="text-3xl font-extrabold md:text-5xl">
          Propostas <span className="bg-gradient-to-r from-violeta to-fucsia bg-clip-text text-transparent">DSENG</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-mudo">
          Cada cliente recebe um link próprio com a proposta dele. Se você recebeu um link, abra ele direto.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/p/exemplo" className="rounded-full bg-gradient-to-r from-violeta to-fucsia px-6 py-3 font-semibold text-white transition hover:opacity-90">
          Ver proposta de exemplo
        </Link>
        <Link href="/admin" className="rounded-full border border-linha px-6 py-3 font-semibold text-creme transition hover:border-magenta">
          Área do Douglas
        </Link>
      </div>
    </main>
  );
}
