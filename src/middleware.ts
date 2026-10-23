import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/token";
import { SESSION_COOKIE } from "@/lib/auth-constants";

// Protege todo o /admin (menos a tela de login): sem sessao valida,
// redireciona para /admin/login. A verificacao da assinatura acontece
// aqui e de novo no layout do painel (defesa em profundidade).
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const secret = process.env.AUTH_SECRET ?? "";
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = secret ? await verifySessionToken(token, secret) : false;
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
