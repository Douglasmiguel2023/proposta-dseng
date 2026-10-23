"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { customAlphabet } from "nanoid";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { parseReais } from "@/lib/format";

// Slug publico nao adivinhavel: 14 caracteres URL-safe sem simbolos ambiguos.
const novoSlug = customAlphabet("23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ", 14);

function leProposta(form: FormData) {
  const valorVista = parseReais(String(form.get("valorVista") ?? ""));
  // Pagamento somente via Pix (50% entrada + 50% entrega): os campos antigos
  // de parcelado/cartão são derivados do valor Pix e não aparecem mais no formulário.
  const valorParcelado = valorVista;
  const validadeTexto = String(form.get("validade") ?? "");
  const parcelas = 1;
  if (valorVista === null || valorParcelado === null) throw new Error("Valor invalido");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(validadeTexto)) throw new Error("Validade invalida");
  return {
    clienteNome: String(form.get("clienteNome") ?? "").trim(),
    empresa: String(form.get("empresa") ?? "").trim(),
    clienteWhatsapp: String(form.get("clienteWhatsapp") ?? "").trim() || null,
    projetoNome: String(form.get("projetoNome") ?? "").trim(),
    projetoResumo: String(form.get("projetoResumo") ?? "").trim(),
    valorVistaCentavos: valorVista,
    valorParceladoCentavos: valorParcelado,
    parcelasCartao: Number.isFinite(parcelas) ? Math.min(21, Math.max(1, Math.trunc(parcelas))) : 3,
    // Meio-dia UTC: a data nao vira na conversao para America/Sao_Paulo.
    validade: new Date(`${validadeTexto}T12:00:00.000Z`),
    status: String(form.get("status") ?? "rascunho") === "publicada" ? "publicada" : "rascunho",
  };
}

export async function criarProposta(form: FormData) {
  await requireAdmin();
  const dados = leProposta(form);
  if (!dados.clienteNome || !dados.projetoNome) throw new Error("Preencha cliente e projeto");
  const criada = await db.proposal.create({ data: { ...dados, slug: novoSlug() } });
  revalidatePath("/admin");
  redirect(`/admin/${criada.id}?criada=1`);
}

export async function atualizarProposta(id: string, form: FormData) {
  await requireAdmin();
  const dados = leProposta(form);
  if (!dados.clienteNome || !dados.projetoNome) throw new Error("Preencha cliente e projeto");
  await db.proposal.update({ where: { id }, data: dados });
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
  redirect(`/admin/${id}?salva=1`);
}

export async function excluirProposta(id: string, form: FormData) {
  await requireAdmin();
  // Confirmacao digitada no formulario do painel (campo "confirmar" = EXCLUIR)
  if (String(form.get("confirmar") ?? "") !== "EXCLUIR") redirect(`/admin/${id}?erro=exclusao`);
  await db.proposal.delete({ where: { id } });
  revalidatePath("/admin");
  redirect("/admin");
}

/** Exclusão a partir da lista: a confirmação é o diálogo do navegador
 *  (componente ExcluirButton); aqui só conferimos a sessão e apagamos. */
export async function excluirPropostaDireto(id: string) {
  await requireAdmin();
  await db.proposal.delete({ where: { id } });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function alternarStatus(id: string) {
  await requireAdmin();
  const atual = await db.proposal.findUnique({ where: { id }, select: { status: true } });
  if (!atual) redirect("/admin");
  await db.proposal.update({
    where: { id },
    data: { status: atual!.status === "publicada" ? "rascunho" : "publicada" },
  });
  revalidatePath("/admin");
  redirect("/admin");
}
