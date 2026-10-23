// Formatacao de dinheiro: o banco guarda centavos (Int).

export function brl(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** "230", "230,5", "230,50", "1.250,00" -> centavos (ou null se invalido). */
export function parseReais(texto: string): number | null {
  const limpo = texto.trim().replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  if (!limpo) return null;
  const valor = Number(limpo);
  if (!Number.isFinite(valor) || valor < 0) return null;
  return Math.round(valor * 100);
}

/** Centavos -> texto para o campo do formulario ("230,00"). */
export function reaisTexto(centavos: number): string {
  return (centavos / 100).toFixed(2).replace(".", ",");
}

/** So digitos de um telefone/WhatsApp brasileiro. */
export function soDigitos(texto: string | null | undefined): string {
  return (texto ?? "").replace(/\D/g, "");
}
