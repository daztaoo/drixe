import { NextRequest, NextResponse } from "next/server";

const SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN || "drixe_admin_secret_token_2025";

export async function GET(req: NextRequest) {
  const session = req.cookies.get("drixe_admin_session")?.value;
  if (!session || session !== SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
