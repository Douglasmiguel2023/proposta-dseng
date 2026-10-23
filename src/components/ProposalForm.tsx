import { reaisTexto } from "@/lib/format";

export interface ProposalFormValues {
  clienteNome: string;
  empresa: string;
  clienteWhatsapp: string;
  projetoNome: string;
  projetoResumo: string;
  valorVistaCentavos: number;
  valorParceladoCentavos: number;
  parcelasCartao: number;
  validadeISO: string; // AAAA-MM-DD
  status: string;
}

export const VALORES_PADRAO: ProposalFormValues = {
  clienteNome: "",
  empresa: "",
  clienteWhatsapp: "",
  projetoNome: "Logotipo exclusivo + marca d'água",
  projetoResumo:
    "Identidade criada do zero para o seu negócio: logo principal, variação, marca d'água, paleta de cores e tipografia, com arquivos finais em alta para impressão e para as redes sociais.",
  valorVistaCentavos: 23000,
  valorParceladoCentavos: 23000,
  parcelasCartao: 3,
  validadeISO: "",
  status: "rascunho",
};

const campo = "w-full rounded-xl border border-linha bg-fundo px-4 py-3 text-creme outline-none focus:border-magenta";
const rotulo = "mb-1 block text-xs font-semibold uppercase tracking-widest text-mudo";

export default function ProposalForm({
  valores, action, textoBotao,
}: {
  valores: ProposalFormValues;
  action: (form: FormData) => Promise<void>;
  textoBotao: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={rotulo}>Nome do cliente *</span>
          <input name="clienteNome" required defaultValue={valores.clienteNome} placeholder="Maria Silva" className={campo} />
        </label>
        <label className="block">
          <span className={rotulo}>Empresa / loja</span>
          <input name="empresa" defaultValue={valores.empresa} placeholder="Maria Modas" className={campo} />
        </label>
      </div>
      <label className="block">
        <span className={rotulo}>WhatsApp do cliente (opcional, com DDD)</span>
        <input name="clienteWhatsapp" defaultValue={valores.clienteWhatsapp} placeholder="5511999999999" inputMode="tel" className={campo} />
        <span className="mt-1 block text-xs text-mudo">Serve para o botão “enviar no WhatsApp” do painel. Pode deixar vazio.</span>
      </label>
      <label className="block">
        <span className={rotulo}>Projeto *</span>
        <input name="projetoNome" required defaultValue={valores.projetoNome} className={campo} />
      </label>
      <label className="block">
        <span className={rotulo}>Resumo do projeto</span>
        <textarea name="projetoResumo" rows={3} defaultValue={valores.projetoResumo} className={campo} />
      </label>
      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block">
          <span className={rotulo}>Valor à vista (Pix) R$</span>
          <input name="valorVista" required defaultValue={reaisTexto(valores.valorVistaCentavos)} inputMode="decimal" className={campo} />
        </label>
        <label className="block">
          <span className={rotulo}>Valor parcelado R$</span>
          <input name="valorParcelado" required defaultValue={reaisTexto(valores.valorParceladoCentavos)} inputMode="decimal" className={campo} />
        </label>
        <label className="block">
          <span className={rotulo}>Parcelas no cartão</span>
          <input name="parcelasCartao" type="number" min={1} max={21} defaultValue={valores.parcelasCartao} className={campo} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={rotulo}>Validade da proposta</span>
          <input name="validade" type="date" required defaultValue={valores.validadeISO} className={campo} />
        </label>
        <label className="block">
          <span className={rotulo}>Status</span>
          <select name="status" defaultValue={valores.status} className={campo}>
            <option value="rascunho">Rascunho (link não abre)</option>
            <option value="publicada">Publicada (link abre)</option>
          </select>
        </label>
      </div>
      <button type="submit" className="rounded-full bg-gradient-to-r from-violeta to-fucsia px-8 py-3 font-bold text-white transition hover:opacity-90">
        {textoBotao}
      </button>
    </form>
  );
}
