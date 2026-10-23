import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { createSessionToken, verifySessionToken } from "./token";

import { SESSION_COOKIE } from "./auth-constants";
export { SESSION_COOKIE };

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET nao definido (veja o .env.example)");
  return s;
}

/**
 * Comparacao timing-safe entre dois textos: compara os resumos SHA-256
 * (sempre do mesmo tamanho), entao nao vaza nem o tamanho da senha.
 */
function comparaTimingSafe(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a, "utf8").digest();
  const hb = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

/**
 * Confere e-mail + senha do admin. Duas formas de definir a senha
 * (variaveis SOMENTE do servidor, nunca expostas ao navegador):
 * 1. ADMIN_PASSWORD_HASH (recomendado): hash bcrypt; tem prioridade.
 * 2. ADMIN_PASSWORD: a senha em texto puro, definida direto no painel
 *    de variaveis (ex.: Vercel) por quem nao quer gerar hash. A
 *    comparacao e timing-safe. Use uma senha longa (20+ caracteres).
 * Se o hash existir, SO ele vale: a senha em texto e ignorada.
 */
export async function verifyAdminCredentials(email: string, senha: string): Promise<boolean> {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  if (!adminEmail) return false;
  if (!comparaTimingSafe(email.trim().toLowerCase(), adminEmail)) return false;

  const hash = (process.env.ADMIN_PASSWORD_HASH ?? "").trim();
  if (hash) {
    try {
      return await bcrypt.compare(senha, hash);
    } catch {
      return false;
    }
  }

  const senhaPura = process.env.ADMIN_PASSWORD ?? "";
  if (!senhaPura) return false;
  return comparaTimingSafe(senha, senhaPura);
}

export async function startAdminSession() {
  const token = await createSessionToken(secret());
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function endAdminSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, secret());
}

/** Para layouts/paginas do painel: sem sessao valida, vai para o login. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
