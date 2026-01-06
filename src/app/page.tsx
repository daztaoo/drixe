"use client";

import { useEffect, useState } from "react";
import Presence from "@/components/Presence";
import { FaSpotify } from "react-icons/fa";
import { useSpotify } from "@/app/hooks/useSpotify";
import WhoAmI from "@/components/WhoAmI";
const statusLines = [
  "mentally present. spiritually somewhere else.",
  "thinking in lowercase.",
  "nothing urgent. everything intentional.",
  "existing between playlists.",
];

export default function Home() {
  const { now, recent, top } = useSpotify();

  const [musicOn, setMusicOn] = useState(false);
  const [status, setStatus] = useState(0);

  /* ---------------- STATUS ROTATION ---------------- */
  useEffect(() => {
    const i = setInterval(() => {
      setStatus((prev) => (prev + 1) % statusLines.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  /* ---------------- GREETING ---------------- */
  const hour = new Date().getHours();
  const greeting =
    hour < 6
      ? "this hour knows secrets."
      : hour < 12
      ? "morning. let’s pretend."
      : hour < 18
      ? "another day, apparently."
      : hour < 23
      ? "night mode: enabled."
      : "you weren’t supposed to be here.";

  /* ---------------- AUDIO UNLOCK ---------------- */
  useEffect(() => {
    const unlockAudio = () => {
      const audio = document.getElementById("bg-music") as HTMLAudioElement;
      if (!audio || !audio.muted) return;
      audio.muted = false;
      audio.play();
      setMusicOn(true);
    };

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });
    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* ---------------- BACKGROUND ---------------- */}
      <img
        src="/images/bg.gif"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        alt="background"
      />

      <audio id="bg-music" src="/music.mp3" loop autoPlay muted />

      {/* ---------------- MUSIC TOGGLE ---------------- */}
      <button
        onClick={() => {
          const audio = document.getElementById("bg-music") as HTMLAudioElement;
          if (!audio) return;
          audio.paused ? audio.play() : audio.pause();
          setMusicOn(!audio.paused);
        }}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs hover:bg-white/20"
      >
        {musicOn ? "too late now" : "tap to unlock lore"}
      </button>

      {/* ================== DASHBOARD ================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================================================= */}
        {/* ================= LEFT SIDE ==================== */}
        {/* ================================================= */}
        <div className="space-y-6">

         {/* -------- PROFILE CARD -------- */}
<div className="relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">

  {/* subtle accent glow */}
  <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-30 pointer-events-none" />

  {/* greeting */}
  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-5">
    {greeting}
  </p>

  <div className="flex items-center gap-5">

    {/* avatar */}
    <div className="relative">
      <img
        src="/images/pfp.gif"
        className="
          w-20 h-20 rounded-full object-cover
          border border-white/20
          shadow-lg
        "
        alt="pfp"
      />

      {/* online dot (aesthetic, not literal) */}
      <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-black" />
    </div>

    {/* identity */}
    <div className="flex-1">
      <h1 className="text-2xl font-semibold leading-tight">
        Drixe
      </h1>

      <p className="text-xs text-white/50 tracking-wide">
        Level 18 · Jan 14
      </p>

      {/* divider */}
      <div className="mt-2 h-px w-10 bg-white/20" />

      {/* rotating status */}
      <p className="mt-2 text-sm text-white/70 leading-snug">
        {statusLines[status]}
      </p>
    </div>
  </div>

  {/* bottom accent */}
  <div className="mt-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            
          </div>

          {/* -------- DISCORD + SPOTIFY PRESENCE (UNCHANGED) -------- */}
          
            <Presence />

        </div>

        {/* ================================================= */}
        {/* ================= RIGHT SIDE =================== */}
        {/* ================================================= */}
        <div className="lg:col-span-2 space-y-6">

         <WhoAmI />
          {/* ---------------- FAVORITES ---------------- */}
          {/* ================= FAVORITES ================= */}
<div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 overflow-hidden space-y-10">

  {/* BACKGROUND DECOR */}
  <img
    src="/images/favs-bg.png"
    className="absolute right-0 bottom-0 w-72 opacity-10 pointer-events-none"
    alt=""
  />

  {/* TITLE */}
  <p className="text-[11px] uppercase tracking-widest text-white/40">
    favorites
  </p>

  {/* ---------- ARTISTS ---------- */}
  <div>
    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">
      artists on repeat
    </p>

    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
      {[
        {
          name: "Central Cee",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB-EhUZKotDowANFQDnjhxt6NFh5pi7fd7TIcWCpusIeGmCJO9CKLMnIG15baioUroUIuSNGU2JAy10qYjic_lK3Eyd4Lb703h4u_ZqIdkMg&s=10",
          link: "https://open.spotify.com/artist/5HqSLMA0bxFjWl2iVxg4u5",
        },
        {
          name: "Juice WRLD",
          img: "https://i.guim.co.uk/img/media/cd59a408307ade77175cbef95d736687c971baf6/0_1869_5792_3473/master/5792.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=1ccd7a4b4f2daa05ff26a5393439025c",
          link: "https://open.spotify.com/artist/4MCBfE4596Uoi2O4DtmEMz",
        },
        {
          name: "Daniel Di Angelo",
          img: "https://i.scdn.co/image/ab6761610000e5eb7e2cf7db02a2a2ea1baffd64",
          link: "https://open.spotify.com/artist/6I7Cz7n0qv6mF0b4P0UQkZ",
        },
      ].map((artist) => (
        <a
          key={artist.name}
          href={artist.link}
          target="_blank"
          className="group text-center"
        >
          <img
            src={artist.img}
            className="
              aspect-square rounded-xl object-cover
              opacity-80 group-hover:opacity-100
              group-hover:scale-[1.03]
              transition
            "
          />
          <p className="mt-2 text-[11px] text-white/60 group-hover:text-white transition">
            {artist.name}
          </p>
        </a>
      ))}
    </div>
  </div>

  {/* SOFT DIVIDER */}
  <div className="h-px bg-white/10" />

  {/* ---------- ANIME ---------- */}
  <div>
    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">
      anime i live in
    </p>

    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
      {[
        {
          name: "One Piece",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOeEk4HzTXFamq8ezW2WhkKCHIx0t2dT78EQ&s",
        },
        {
          name: "Demon Slayer",
          img: "https://media.tenor.com/_UjzdE-oNusAAAAM/nezuko-demon-slayer.gif",
        },
        {
          name: "Horimiya",
          img: "https://i.pinimg.com/736x/7a/d5/01/7ad5010b4a7a3dba8617dc11b327f01f.jpg",
        },
      ].map((anime) => (
        <div key={anime.name} className="text-center group">
          <img
            src={anime.img}
            className="
              aspect-square rounded-xl object-cover
              opacity-80 group-hover:opacity-100
              transition
            "
          />
          <p className="mt-2 text-[11px] text-white/60">
            {anime.name}
          </p>
        </div>
      ))}
    </div>
  </div>

  {/* SOFT DIVIDER */}
  <div className="h-px bg-white/10" />

  {/* ---------- GAMES ---------- */}
  <div>
    <p className="text-[10px] uppercase tracking-widest text-white/30 mb-4">
      games i escape into
    </p>

    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
      {[
        {
          name: "Dead by Daylight",
          img: "https://upload.wikimedia.org/wikipedia/en/b/b7/Dead_by_Daylight_Steam_header.jpg",
        },
        {
          name: "Roblox",
          img: "https://upload.wikimedia.org/wikipedia/commons/4/48/Roblox_Logo_2021.png",
        },
        {
          name: "Genshin Impact",
          img: "https://i.ytimg.com/vi/spMAhbmBJrk/maxresdefault.jpg",
        },
      ].map((game) => (
        <div key={game.name} className="text-center group">
          <img
            src={game.img}
            className="
              aspect-square rounded-xl object-cover
              opacity-80 group-hover:opacity-100
              transition
            "
          />
          <p className="mt-2 text-[11px] text-white/60">
            {game.name}
          </p>
        </div>
      ))}
    </div>
  </div>



          </div>
        </div>
      </div>
    </main>
  );
}
