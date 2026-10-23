import { NextResponse, type NextRequest } from "next/server";
import { endAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await endAdminSession();
  const base = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
  return NextResponse.redirect(new URL("/admin/login", base), 303);
}
