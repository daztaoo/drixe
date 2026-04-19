import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

// ─── For the founder's personal page (single-user mode) ───────────────────────
const FOUNDER_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// ─── Shared helper: build Basic auth header ────────────────────────────────────
export function getBasicAuthHeader() {
  return `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`;
}

// ─── FOUNDER-MODE: Get access token from hardcoded refresh token ───────────────
// Used by the personal /drixe page API routes only.
export async function getFounderAccessToken(): Promise<string | null> {
  if (!FOUNDER_REFRESH_TOKEN) return null;

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: FOUNDER_REFRESH_TOKEN,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Founder Spotify token refresh failed:", await res.text());
    return null;
  }

  const { access_token } = await res.json();
  return access_token;
}

// ─── MULTI-USER: Refresh a user's stored token, save updated token to Supabase ─
// Used by the per-user integrations system.
export async function refreshUserSpotifyToken(integration: {
  id: string;
  refresh_token: string;
}): Promise<string | null> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: integration.refresh_token,
    }),
  });

  if (!res.ok) {
    console.error("User Spotify token refresh failed:", await res.text());
    return null;
  }

  const { access_token, expires_in } = await res.json();

  // Update the DB — import supabase server client lazily to avoid circular deps
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // needs service role to bypass RLS
  );

  await supabase.from("integrations").update({
    access_token,
    token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
  }).eq("id", integration.id);

  return access_token;
}

// ─── MULTI-USER: Get valid access token (refresh if expired) ──────────────────
export async function getValidUserSpotifyToken(integration: {
  id: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
}): Promise<string | null> {
  const expiresAt = new Date(integration.token_expires_at).getTime();
  const fiveMinsMilli = 5 * 60 * 1000;

  // If token is still valid for > 5 minutes, use as-is
  if (Date.now() + fiveMinsMilli < expiresAt) {
    return integration.access_token;
  }

  // Otherwise refresh
  return refreshUserSpotifyToken({
    id: integration.id,
    refresh_token: integration.refresh_token,
  });
}

// ─── Generic Spotify fetch (for founder's personal page) ──────────────────────
export async function spotifyFetch<T>(endpoint: string): Promise<T | null> {
  const access_token = await getFounderAccessToken();
  if (!access_token) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${access_token}` },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeout);

    if (res.status === 204 || res.status === 404) return null;
    if (!res.ok) {
      console.error("Spotify API error:", await res.text());
      return null;
    }

    return res.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timeout);
    console.error("Spotify fetch failed:", err);
    return null;
  }
}
