import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username")?.trim().toLowerCase();

  if (!username || username.length < 2) {
    return NextResponse.json({ available: false, reason: "too_short" });
  }

  if (!/^[a-z0-9_]{2,24}$/.test(username)) {
    return NextResponse.json({ available: false, reason: "invalid_chars" });
  }

  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  return NextResponse.json({ available: !data });
}
