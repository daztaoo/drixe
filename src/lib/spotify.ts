import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

/**
 * Load env variables
 */
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN,
} = process.env;

/**
 * Hard fail if envs are missing (runtime + TS safety)
 */
if (
  !SPOTIFY_CLIENT_ID ||
  !SPOTIFY_CLIENT_SECRET ||
  !SPOTIFY_REFRESH_TOKEN
) {
  throw new Error("Missing Spotify environment variables");
}

/**
 * Tell TypeScript these are DEFINITELY strings
 */
const CLIENT_ID: string = SPOTIFY_CLIENT_ID;
const CLIENT_SECRET: string = SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN: string = SPOTIFY_REFRESH_TOKEN;

/**
 * Get a fresh Spotify access token using refresh token
 */
export async function getAccessToken(): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const basicAuth = Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Failed to refresh Spotify token: " + err);
  }

  return res.json();
}

/**
 * Helper to call Spotify Web API
 */
export async function spotifyFetch<T>(
  endpoint: string
): Promise<T | null> {
  const { access_token } = await getAccessToken();

 const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 8000);

let res;
try {
  res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    signal: controller.signal,
    cache: "no-store",
  });
} catch (err) {
  console.error("Spotify fetch failed:", err);
  throw new Error("SPOTIFY_FETCH_FAILED");
} finally {
  clearTimeout(timeout);
}


  if (res.status === 204 || res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Spotify API error: " + err);
  }

  return res.json() as Promise<T>;
}
