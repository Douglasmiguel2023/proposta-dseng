"use client";

import { useState } from "react";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        } catch { /* clipboard indisponivel: o link esta visivel na tela */ }
      }}
      className="rounded-full border border-linha px-4 py-2 text-sm font-semibold text-creme transition hover:border-magenta"
    >
      {copiado ? "Link copiado!" : "Copiar link"}
    </button>
  );
}
