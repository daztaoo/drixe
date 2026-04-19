// Twitch live status route — checks if a given Twitch channel is live
// GET /api/integrations/twitch/status?channel=username
// Results are cached 60s by Next.js to avoid rate limiting

import { NextRequest, NextResponse } from "next/server";
import { checkTwitchLive } from "@/lib/twitch";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");

  if (!channel) {
    return NextResponse.json({ error: "Missing channel param" }, { status: 400 });
  }

  // Skip if Twitch credentials aren't configured
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    return NextResponse.json({ isLive: false, reason: "Twitch not configured" });
  }

  const result = await checkTwitchLive(channel);
  return NextResponse.json(result);
}
