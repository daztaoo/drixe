import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || "drixe_admin_secret_token_2025";

export async function POST(req: NextRequest) {
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  const { password } = await req.json();
  if (password !== ADMIN_PASSWORD) {
    // Log the failed attempt
    console.warn(`[ADMIN] Failed login attempt from IP: ${req.headers.get("x-forwarded-for") || "unknown"} at ${new Date().toISOString()}`);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("drixe_admin_session", SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/", // Must be "/" — /api/admin/verify won't receive cookie if path="/admin"
  });
  return response;
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("drixe_admin_session");
  return response;
}
