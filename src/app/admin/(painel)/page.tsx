import Link from "next/link";
import { db } from "@/lib/db";
import { brl, soDigitos } from "@/lib/format";
import { formataData, TZ } from "@/lib/dates";
import CopyLinkButton from "@/components/CopyLinkButton";
import ExcluirButton from "@/components/ExcluirButton";
import { alternarStatus, excluirPropostaDireto } from "./actions";

export const dynamic = "force-dynamic";

function formataMomento(date: Date | null): string {
  if (!date) return "—";
  return `${formataData(date)} às ${new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(date)}`;
}

export default async function ListaPropostas() {
  const propostas = await db.proposal.findMany({ orderBy: { createdAt: "desc" } });
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">Suas propostas</h1>
          <p className="mt-1 text-sm text-mudo">
            {propostas.length === 0
              ? "Nenhuma proposta ainda. Crie a primeira com o botão + Nova proposta."
              : `${propostas.length} proposta(s). Editar e salvar atualiza o mesmo link do cliente.`}
          </p>
        </div>
        <Link
          href="/admin/nova"
          className="rounded-full bg-gradient-to-r from-violeta to-fucsia px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          + Nova proposta
        </Link>
      </div>

      <div className="space-y-4">
        {propostas.map((p) => {
          const urlPublica = `${base}/p/${p.slug}`;
          const whatsCliente = soDigitos(p.clienteWhatsapp);
          const textoWhats = encodeURIComponent(
            `Olá, ${p.clienteNome}! Preparei a sua proposta da DSENG DESIGNER: ${urlPublica}`
          );
          return (
            <article key={p.id} className="rounded-3xl border border-linha bg-painel p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold">
                    {p.clienteNome}
                    {p.empresa ? <span className="text-mudo"> · {p.empresa}</span> : null}
                  </h2>
                  <p className="mt-0.5 text-sm text-mudo">{p.projetoNome}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
                    p.status === "publicada"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-amber-500/15 text-amber-300"
                  }`}
                >
                  {p.status === "publicada" ? "Publicada" : "Rascunho"}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mudo">Valor à vista</dt>
                  <dd className="mt-0.5 font-bold">{brl(p.valorVistaCentavos)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mudo">Parcelado</dt>
                  <dd className="mt-0.5 font-bold">
                    {brl(p.valorParceladoCentavos)} em {p.parcelasCartao}x
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mudo">Válida até</dt>
                  <dd className="mt-0.5 font-bold">{formataData(p.validade)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mudo">Visualizações</dt>
                  <dd className="mt-0.5 font-bold">{p.views}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mudo">Primeira abertura</dt>
                  <dd className="mt-0.5">{formataMomento(p.firstViewAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-mudo">Última abertura</dt>
                  <dd className="mt-0.5">{formataMomento(p.lastViewAt)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs uppercase tracking-widest text-mudo">Link do cliente</dt>
                  <dd className="mt-0.5 break-all text-mudo">{urlPublica}</dd>
                </div>
              </dl>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/${p.id}`}
                  className="rounded-full bg-gradient-to-r from-violeta to-fucsia px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  Editar
                </Link>
                <CopyLinkButton url={urlPublica} />
                {whatsCliente ? (
                  <a
                    href={`https://wa.me/${whatsCliente}?text=${textoWhats}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-linha px-4 py-2 text-sm font-semibold text-creme transition hover:border-emerald-400"
                  >
                    Enviar no WhatsApp
                  </a>
                ) : null}
                <form action={alternarStatus.bind(null, p.id)}>
                  <button
                    type="submit"
                    className="rounded-full border border-linha px-4 py-2 text-sm font-semibold text-creme transition hover:border-magenta"
                  >
                    {p.status === "publicada" ? "Voltar para rascunho" : "Publicar"}
                  </button>
                </form>
                <ExcluirButton nome={p.clienteNome} action={excluirPropostaDireto.bind(null, p.id)} />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
