import Image from "next/image";
import { LOGO_DS_BRANCA } from "@/assets/logo";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-linha bg-painel p-8 shadow-[0_0_80px_rgba(217,52,247,0.12)]">
        <div className="mb-6 flex justify-center">
          <Image src={LOGO_DS_BRANCA} alt="DSENG DESIGNER" width={120} height={70} priority />
        </div>
        <h1 className="text-center text-xl font-bold">Área do Douglas</h1>
        <p className="mt-1 text-center text-sm text-mudo">Entre para criar e editar propostas.</p>
        {erro ? (
          <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-center text-sm text-red-300">
            E-mail ou senha não conferem. Tenta de novo.
          </p>
        ) : null}
        <form method="post" action="/api/admin/login" className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-mudo">E-mail</span>
            <input name="email" type="email" required autoComplete="username"
              className="w-full rounded-xl border border-linha bg-fundo px-4 py-3 text-creme outline-none focus:border-magenta" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-mudo">Senha</span>
            <input name="senha" type="password" required autoComplete="current-password"
              className="w-full rounded-xl border border-linha bg-fundo px-4 py-3 text-creme outline-none focus:border-magenta" />
          </label>
          <button type="submit" className="w-full rounded-full bg-gradient-to-r from-violeta to-fucsia py-3 font-bold text-white transition hover:opacity-90">
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
