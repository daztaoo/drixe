"use client";

import { useEffect, useState } from "react";

const USER_ID = "928934131893686292";
const DISCORD_ICON =
  "https://cdn-icons-png.flaticon.com/512/2111/2111370.png";

  const SPOTIFY_ICON =
  "https://cdn-icons-png.flaticon.com/512/2111/2111624.png";
export default function Presence() {
  const [data, setData] = useState<any>(null);
  const [lastSpotifyTime, setLastSpotifyTime] = useState<number | null>(null);

  // FETCH PRESENCE (always runs)
  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const res = await fetch(
          `https://api.lanyard.rest/v1/users/${USER_ID}`
        );
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPresence();
    const interval = setInterval(fetchPresence, 8000);
    return () => clearInterval(interval);
  }, []);

  // TRACK SPOTIFY TIME (always runs)
  const spotify =
    data?.activities?.find((a: any) => a.name === "Spotify") ?? null;

  useEffect(() => {
    if (spotify) {
      setLastSpotifyTime(Date.now());
    }
  }, [spotify]);

  // SAFE FALLBACKS
  if (!data) {
    return (
      <div className="mt-6 bg-white/10 border border-white/10 rounded-2xl p-4 text-xs opacity-60">
        loading presence…
      </div>
    );
  }

  const status = data.discord_status;
  const avatar = `https://cdn.discordapp.com/avatars/${USER_ID}/${data.discord_user.avatar}.png`;

  const statusColor =
    status === "online"
      ? "bg-green-400"
      : status === "idle"
      ? "bg-yellow-400"
      : status === "dnd"
      ? "bg-red-500"
      : "bg-gray-500";

  const minutesAgo =
    lastSpotifyTime &&
    Math.floor((Date.now() - lastSpotifyTime) / 60000);

  return (
    <div className="mt-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4">

      {/* Discord */}
      <div className="flex items-center gap-3 mb-4">
        <img src={DISCORD_ICON} className="w-4 opacity-70" alt="discord" />

        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={avatar}
              className="w-11 h-11 rounded-full"
              alt="discord avatar"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${statusColor}`}
            />
          </div>

          <div>
            <p className="font-semibold text-sm">
              {data.discord_user.username}
            </p>
            <p className="text-xs opacity-60 capitalize">
              {status}
            </p>
          </div>
        </div>
      </div>

      {/* Spotify */}
      {spotify ? (
        <div className="flex items-center gap-3">
          <img
            src={spotify.assets.large_image.replace(
              "spotify:",
              "https://i.scdn.co/image/"
            )}
            className="w-11 h-11 rounded-lg"
            alt="album"
          />
          <div>
            <p className="text-green-400 text-xs">listening now</p>
            <p className="text-sm font-semibold">{spotify.details}</p>
            <p className="text-xs opacity-60">{spotify.state}</p>
          </div>
        </div>
      ) : (
        <p className="text-xs opacity-60">
          {minutesAgo
            ? `last listened ${minutesAgo} min ago`
            : "not listening rn"}
        </p>
      )}
    </div>
  );
}
