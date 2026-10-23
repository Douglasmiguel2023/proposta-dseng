import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { brl } from "@/lib/format";
import { formataData } from "@/lib/dates";
import ProposalForm from "@/components/ProposalForm";
import CopyLinkButton from "@/components/CopyLinkButton";
import { atualizarProposta, excluirProposta, alternarStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditarProposta({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ salva?: string; criada?: string; erro?: string }>;
}) {
  const { id } = await params;
  const avisos = await searchParams;
  const p = await db.proposal.findUnique({ where: { id } });
  if (!p) notFound();

  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  const urlPublica = `${base}/p/${p.slug}`;
  const atualizar = atualizarProposta.bind(null, p.id);
  const excluir = excluirProposta.bind(null, p.id);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin" className="text-sm font-semibold text-mudo hover:text-creme">
        ← Voltar para a lista
      </Link>
      <h1 className="mt-3 text-2xl font-extrabold">Editar proposta</h1>
      <p className="mt-1 text-sm text-mudo">
        {p.clienteNome}
        {p.empresa ? ` · ${p.empresa}` : ""} · {brl(p.valorVistaCentavos)} à vista · válida até{" "}
        {formataData(p.validade)} · {p.views} visualização(ões)
      </p>

      {avisos.salva ? (
        <p className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          Salvo! O link do cliente já mostra a versão nova.
        </p>
      ) : null}
      {avisos.criada ? (
        <p className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
          Proposta criada! Copie o link abaixo e envie para o cliente.
        </p>
      ) : null}
      {avisos.erro === "exclusao" ? (
        <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          Para excluir, digite EXCLUIR no campo da zona de perigo e confirme.
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-3xl border border-linha bg-painel p-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-mudo">Link do cliente</p>
          <p className="mt-1 break-all font-semibold">{urlPublica}</p>
          <p className="mt-1 text-xs text-mudo">
            Status: {p.status === "publicada" ? "publicada (o link abre)" : "rascunho (o link não abre)"}
          </p>
        </div>
        <CopyLinkButton url={urlPublica} />
        <form action={alternarStatus.bind(null, p.id)}>
          <button
            type="submit"
            className="rounded-full border border-linha px-4 py-2 text-sm font-semibold text-creme transition hover:border-magenta"
          >
            {p.status === "publicada" ? "Voltar para rascunho" : "Publicar"}
          </button>
        </form>
        <a
          href={urlPublica}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-linha px-4 py-2 text-sm font-semibold text-creme transition hover:border-magenta"
        >
          Abrir proposta ↗
        </a>
      </div>

      <div className="mt-8">
        <ProposalForm
          valores={{
            clienteNome: p.clienteNome,
            empresa: p.empresa,
            clienteWhatsapp: p.clienteWhatsapp ?? "",
            projetoNome: p.projetoNome,
            projetoResumo: p.projetoResumo,
            valorVistaCentavos: p.valorVistaCentavos,
            valorParceladoCentavos: p.valorParceladoCentavos,
            parcelasCartao: p.parcelasCartao,
            validadeISO: p.validade.toISOString().slice(0, 10),
            status: p.status,
          }}
          action={atualizar}
          textoBotao="Salvar alterações"
        />
      </div>

      <div className="mt-12 rounded-3xl border border-red-500/30 bg-red-500/5 p-5">
        <h2 className="font-bold text-red-300">Zona de perigo</h2>
        <p className="mt-1 text-sm text-mudo">
          Excluir apaga a proposta e o link do cliente para de abrir. Para confirmar,
          digite <strong className="text-creme">EXCLUIR</strong>:
        </p>
        <form action={excluir} className="mt-3 flex flex-wrap items-center gap-2">
          <input
            name="confirmar"
            placeholder="EXCLUIR"
            className="rounded-xl border border-linha bg-fundo px-4 py-2.5 text-creme outline-none focus:border-red-400"
          />
          <button
            type="submit"
            className="rounded-full border border-red-500/50 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/10"
          >
            Excluir proposta
          </button>
        </form>
      </div>
    </div>
  );
}
