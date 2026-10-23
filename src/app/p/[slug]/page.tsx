import type { Metadata } from "next";
import Image from "next/image";
import { db } from "@/lib/db";
import {
  saudacao,
  formataDataCurta,
  formataDataLonga,
  jornadaComDatas,
  TOTAL_DIAS_UTEIS,
} from "@/lib/dates";
import PublicExperience, { type PropostaPublica } from "@/components/proposta/PublicExperience";
import { LOGO_DS_BRANCA } from "@/assets/logo";
import { TRABALHOS } from "@/assets/trabalhos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proposta · DSENG DESIGNER",
  robots: { index: false, follow: false, nocache: true },
};


function NaoEncontrada() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Image src={LOGO_DS_BRANCA} alt="DSENG DESIGNER" width={130} height={76} priority />
      <div>
        <h1 className="text-2xl font-extrabold md:text-3xl">Proposta não encontrada</h1>
        <p className="mx-auto mt-3 max-w-md text-mudo">
          Este link não está ativo. Se você recebeu uma proposta da DSENG, confira o link
          que foi enviado ou fale com a gente no WhatsApp.
        </p>
      </div>
      <a
        href="https://wa.me/5511941199648"
        target="_blank"
        rel="noreferrer"
        className="rounded-full bg-gradient-to-r from-violeta to-fucsia px-6 py-3 font-bold text-white transition hover:opacity-90"
      >
        Falar no WhatsApp
      </a>
    </main>
  );
}

export default async function PaginaPublicaProposta({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposta = await db.proposal.findUnique({ where: { slug } });

  // Só abre proposta publicada. Rascunho e slug inexistente: página neutra.
  if (!proposta || proposta.status !== "publicada") return <NaoEncontrada />;

  // Registra a visualização sem travar a página: se o registro falhar,
  // a proposta abre do mesmo jeito.
  try {
    await db.proposal.update({
      where: { id: proposta.id },
      data: {
        views: { increment: 1 },
        lastViewAt: new Date(),
        ...(proposta.firstViewAt ? {} : { firstViewAt: new Date() }),
      },
    });
  } catch {
    /* visualização é estatística, nunca bloqueia a leitura */
  }

  const agora = new Date();
  const textoCompleto = `${proposta.projetoNome} ${proposta.projetoResumo} ${proposta.clienteNome}`;
  const leituraMin = Math.max(3, Math.min(9, Math.round(textoCompleto.split(/\s+/).length / 40) + 3));

  const dados: PropostaPublica = {
    clienteNome: proposta.clienteNome,
    primeiroNome: proposta.clienteNome.trim().split(/\s+/)[0] ?? proposta.clienteNome,
    empresa: proposta.empresa,
    projetoNome: proposta.projetoNome,
    projetoResumo: proposta.projetoResumo,
    valorVistaCentavos: proposta.valorVistaCentavos,
    valorParceladoCentavos: proposta.valorParceladoCentavos,
    parcelasCartao: proposta.parcelasCartao,
    validadeCurta: formataDataCurta(proposta.validade),
    validadeLonga: formataDataLonga(proposta.validade),
    hojeLonga: formataDataLonga(agora),
    saudacao: saudacao(agora),
    leituraMin,
    totalDiasUteis: TOTAL_DIAS_UTEIS,
    etapas: jornadaComDatas(agora).map((e) => ({
      numero: e.numero,
      titulo: e.titulo,
      duracaoTexto: e.duracaoTexto,
      voceRecebe: e.voceRecebe,
      precisoDeVoce: e.precisoDeVoce,
      inicioCurta: formataDataCurta(e.inicio),
      fimCurta: formataDataCurta(e.fim),
    })),
    trabalhos: TRABALHOS,
  };

  return <PublicExperience d={dados} />;
}
