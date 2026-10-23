// Datas da proposta: tudo em America/Sao_Paulo, prazos em dias uteis.

export const TZ = "America/Sao_Paulo";

/** Saudacao pelo horario de Brasilia. */
export function saudacao(date = new Date()): string {
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hourCycle: "h23", timeZone: TZ }).format(date)
  );
  if (hora < 6) return "Boa noite";
  if (hora < 12) return "Bom dia";
  if (hora < 18) return "Boa tarde";
  return "Boa noite";
}

export function formataData(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ }).format(date);
}

export function formataDataLonga(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(date);
}

export function formataDataCurta(date: Date): string {
  // "30/10" - usado nos selos de validade.
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: TZ }).format(date);
}

function ehDiaUtil(date: Date): boolean {
  const dia = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: TZ }).format(date);
  return dia !== "Sat" && dia !== "Sun";
}

/** Soma N dias uteis a partir de uma data (o dia inicial nao conta). */
export function somaDiasUteis(inicio: Date, dias: number): Date {
  const d = new Date(inicio);
  let restam = dias;
  while (restam > 0) {
    d.setDate(d.getDate() + 1);
    if (ehDiaUtil(d)) restam--;
  }
  return d;
}

export interface EtapaJornada {
  numero: number;
  titulo: string;
  duracaoTexto: string;
  diasUteis: number; // 0 = acontece no dia da aprovacao (a conversa)
  voceRecebe: string;
  precisoDeVoce: string;
}

// Jornada padrao de um projeto de logotipo na DSENG (textos proprios).
export const JORNADA: EtapaJornada[] = [
  {
    numero: 1, titulo: "Conversa de início", duracaoTexto: "30 minutos", diasUteis: 0,
    voceRecebe: "Uma conversa rápida para eu entender a sua loja, o estilo que você gosta e o que a marca precisa transmitir.",
    precisoDeVoce: "30 minutos para a gente conversar e as referências que você já tiver.",
  },
  {
    numero: 2, titulo: "Direção e referências", duracaoTexto: "1 dia útil", diasUteis: 1,
    voceRecebe: "A direção criativa do projeto: o caminho de estilo, cores e tipografia que a sua marca vai seguir.",
    precisoDeVoce: "Confirmar a direção para eu começar a criar.",
  },
  {
    numero: 3, titulo: "Criação dos conceitos", duracaoTexto: "2 dias úteis", diasUteis: 2,
    voceRecebe: "Os conceitos da sua logo, criados do zero para o seu negócio, prontos para você ver e comparar.",
    precisoDeVoce: "Nada, essa parte é comigo.",
  },
  {
    numero: 4, titulo: "Apresentação e ajustes", duracaoTexto: "1 dia útil", diasUteis: 1,
    voceRecebe: "A apresentação da logo escolhida com os ajustes que você pedir, até ficar do seu jeito.",
    precisoDeVoce: "Escolher o conceito e me dizer os ajustes.",
  },
  {
    numero: 5, titulo: "Entrega final", duracaoTexto: "1 dia útil", diasUteis: 1,
    voceRecebe: "Todos os arquivos finais em alta: logo principal, variação, marca d'água, paleta e tipografia, para impressão e redes sociais.",
    precisoDeVoce: "Nada, é só começar a usar.",
  },
];

export const TOTAL_DIAS_UTEIS = JORNADA.reduce((s, e) => s + e.diasUteis, 0);

/** Etapas com as datas calculadas a partir da aprovacao (padrao: hoje). */
export function jornadaComDatas(inicio = new Date()) {
  let cursor = new Date(inicio);
  return JORNADA.map((etapa) => {
    const fim = etapa.diasUteis === 0 ? new Date(cursor) : somaDiasUteis(cursor, etapa.diasUteis);
    const trecho = { ...etapa, inicio: new Date(cursor), fim };
    cursor = fim;
    return trecho;
  });
}
