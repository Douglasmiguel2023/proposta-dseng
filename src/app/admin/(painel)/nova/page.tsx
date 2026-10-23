import ProposalForm, { VALORES_PADRAO } from "@/components/ProposalForm";
import { criarProposta } from "../actions";

export default function NovaProposta() {
  // Validade padrão: 7 dias a partir de hoje.
  const validade = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold">Nova proposta</h1>
      <p className="mb-6 mt-1 text-sm text-mudo">
        Preencha os dados do cliente. Ao salvar como publicada, o link dela aparece
        na lista de propostas, pronto para copiar ou enviar no WhatsApp.
      </p>
      <ProposalForm
        valores={{ ...VALORES_PADRAO, validadeISO: validade, status: "publicada" }}
        action={criarProposta}
        textoBotao="Criar proposta"
      />
    </div>
  );
}
