import { NextResponse, type NextRequest } from "next/server";
import { verifyAdminCredentials, startAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "");
  const senha = String(form.get("senha") ?? "");
  const ok = await verifyAdminCredentials(email, senha);
  const base = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  if (!ok) {
    return NextResponse.redirect(new URL("/admin/login?erro=1", base), 303);
  }
  await startAdminSession();
  return NextResponse.redirect(new URL("/admin", base), 303);
}
