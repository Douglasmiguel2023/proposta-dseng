import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  // Validade da demonstracao: 7 dias a partir do seed, ao meio-dia UTC
  // para nao virar o dia na conversao de fuso.
  const validade = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  validade.setUTCHours(12, 0, 0, 0);

  const exemplo = await db.proposal.upsert({
    where: { slug: "exemplo" },
    update: {},
    create: {
      slug: "exemplo",
      clienteNome: "Cliente Exemplo",
      empresa: "Loja Exemplo",
      clienteWhatsapp: null,
      projetoNome: "Logotipo exclusivo + marca d'água",
      projetoResumo:
        "Identidade criada do zero para a sua loja: logo principal, variação, marca d'água, paleta de cores e tipografia, com arquivos finais em alta para impressão e para as redes sociais.",
      valorVistaCentavos: 23000,
      valorParceladoCentavos: 23000,
      parcelasCartao: 3,
      validade,
      status: "publicada",
    },
  });
  console.log(`Seed ok: proposta de demonstracao /p/${exemplo.slug} (id ${exemplo.id})`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
