import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Admin protection: compare session user email against env var
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function middleware(req: NextRequest) {
  if (!ADMIN_EMAIL) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }
}
