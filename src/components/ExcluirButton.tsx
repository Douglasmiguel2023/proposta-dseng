"use client";

export default function ExcluirButton({
  nome,
  action,
}: {
  nome: string;
  action: () => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(`Excluir a proposta de ${nome}? Essa ação não tem volta.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
      >
        Excluir
      </button>
    </form>
  );
}
