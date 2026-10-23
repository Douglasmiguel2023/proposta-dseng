import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "DSENG DESIGNER · Propostas",
  description: "Propostas comerciais da DSENG DESIGNER: logotipos exclusivos, criados do zero.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={sora.variable}>
      <body className="bg-fundo font-sora text-creme antialiased">{children}</body>
    </html>
  );
}
