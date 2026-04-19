// ─── Twitch App Token Manager ──────────────────────────────────────────────────
// Uses Client Credentials flow — no user login needed for basic live detection.
// Token is cached in memory for the duration of the deployment.

let cachedTwitchToken: { token: string; expiresAt: number } | null = null;

export async function getTwitchAppToken(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedTwitchToken && cachedTwitchToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedTwitchToken.token;
  }

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to get Twitch app token: " + await res.text());
  }

  const { access_token, expires_in } = await res.json();
  cachedTwitchToken = {
    token: access_token,
    expiresAt: Date.now() + expires_in * 1000,
  };

  return access_token;
}

// ─── Check if a Twitch channel is currently live ──────────────────────────────
export async function checkTwitchLive(channelLogin: string): Promise<{
  isLive: boolean;
  title: string | null;
  viewerCount: number | null;
}> {
  try {
    const token = await getTwitchAppToken();

    const res = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${channelLogin}`,
      {
        headers: {
          "Client-Id": process.env.TWITCH_CLIENT_ID!,
          "Authorization": `Bearer ${token}`,
        },
        next: { revalidate: 60 }, // Next.js: cache this response for 60s
      }
    );

    if (!res.ok) {
      console.error("Twitch API error:", res.status);
      return { isLive: false, title: null, viewerCount: null };
    }

    const { data } = await res.json();
    const stream = data?.[0];

    return {
      isLive: !!stream,
      title: stream?.title ?? null,
      viewerCount: stream?.viewer_count ?? null,
    };
  } catch (err) {
    console.error("Twitch check failed:", err);
    return { isLive: false, title: null, viewerCount: null };
  }
}
