import Image from "next/image";
import { LOGO_DS_BRANCA } from "@/assets/logo";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-linha bg-fundo/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src={LOGO_DS_BRANCA} alt="DSENG DESIGNER" width={74} height={43} />
            <span className="hidden text-sm font-bold uppercase tracking-widest text-mudo sm:block">Propostas</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/admin/nova" className="rounded-full bg-gradient-to-r from-violeta to-fucsia px-4 py-2 text-sm font-bold text-white hover:opacity-90">
              + Nova proposta
            </Link>
            <form method="post" action="/api/admin/logout">
              <button type="submit" className="rounded-full border border-linha px-4 py-2 text-sm font-semibold text-mudo hover:border-magenta hover:text-creme">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
