"use client";

import { useEffect, useState } from "react";
import Presence from "@/components/Presence";

const statusLines = [
  "mentally present. spiritually somewhere else.",
  "thinking in lowercase.",
  "nothing urgent. everything intentional.",
  "existing between playlists.",
];
export default function Home() {
  const [musicOn, setMusicOn] = useState(false);
  const [status, setStatus] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);

  // rotate status line
  useEffect(() => {
    const i = setInterval(() => {
      setStatus((prev) => (prev + 1) % statusLines.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  // time greeting (NOT cringe)
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


  // unlock audio on first interaction
 useEffect(() => {
  const unlockAudio = () => {
    const audio = document.getElementById("bg-music") as HTMLAudioElement;
    if (!audio) return;

    if (audio.muted) {
      audio.muted = false;
      audio.play();
      setMusicOn(true);
    }
  };

  window.addEventListener("click", unlockAudio, { once: true });
  window.addEventListener("touchstart", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });

  return () => {
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };
}, []);


  return (
    <main className="min-h-screen bg-black text-white px-4 py-14 relative overflow-hidden">

      {/* Background */}
      <img
  src="/images/bg.gif"
  className="absolute inset-0 w-full h-full object-cover opacity-40 blur-0"
  alt="background"
/>


      {/* Music */}
      <audio id="bg-music" src="/music.mp3" loop autoPlay muted />

     {/* Music Toggle */}
<button
  onClick={() => {
    const audio = document.getElementById("bg-music") as HTMLAudioElement;
    if (!audio) return;

    if (audio.paused) {
      audio.muted = false;
      audio.play();
      setMusicOn(true);
    } else {
      audio.pause();
      setMusicOn(false);
    }
  }}
  className="
    fixed top-4 right-4 z-30
    flex items-center gap-2
    px-4 py-2
    rounded-full
    bg-white/10 backdrop-blur
    border border-white/20
    text-xs
    text-white/80
    hover:bg-white/20
    hover:scale-105
    transition
    animate-pulse
  "
>
  <span className="text-sm">
    {musicOn ? "too late now" : "tap to unlock lore"}
  </span>

  <span
    className={`w-2 h-2 rounded-full ${
      musicOn ? "bg-green-400" : "bg-orange-400"
    }`}
  />
</button>


      {/* Container */}
      <div className="relative z-10 max-w-lg mx-auto">

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-7 sm:p-9 border border-white/10 shadow-2xl">

          {/* Greeting */}
         <div className="mb-6 text-center">
  <p className="text-[11px] uppercase text-white/40 tracking-widest">
  {greeting}
</p>

</div>


          {/* Profile */}
          <div className="flex flex-col items-center text-center mt-2">

            <img
              src="/images/pfp.gif"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/20 object-cover"
              alt="profile"
            />

            <h1 className="mt-5 text-2xl sm:text-3xl font-bold">
              Hi, i’m <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
  Drixe
</span>
<p className="text-[11px] uppercase tracking-widest text-white/40 mt-1">
  level 18 · jan 14
</p>


            </h1>

            <p className="mt-2 text-sm text-white/70">
              {statusLines[status]}
            </p>
          </div>

          <div className="my-6 h-px bg-white/15" />

          {/* About (FIXED, HUMAN) */}
          <p className="text-center text-sm text-white/80 leading-relaxed">
            Time bends before perfect intent.
          </p>

          {/* Presence */}
          <Presence />
<div className="mt-4 text-center">
  <p className="text-xs text-white/50 tracking-wide">
    viewed by <span className="text-white/80 font-medium">69</span> souls
  </p>
</div>

          {/* Tags (NERD HUMOR, NOT CRINGE) */}
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {[
              "makes questionable choices",
              "overthinks professionally",
              "acts calm, isn’t",
              "runs on instincts",
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/15"
              >
                {tag}
              </span>
            ))}
          </div>

{/* Favorites */}
<div className="mt-12 space-y-10">

  {/* Section title */}
  <p className="text-center text-xs uppercase tracking-[0.3em] text-white/30">
    personal favorites
  </p>

  {/* Games */}
  <div className="text-center">
    <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
      games
    </p>

    <div className="flex justify-center gap-6">
      {[
        {
          name: "Dead by Daylight",
          img: "https://upload.wikimedia.org/wikipedia/en/b/b7/Dead_by_Daylight_Steam_header.jpg",
        },
        {
          name: "Roblox",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU3PVRE_vleIyipQnw-7O8KiVVHHFbNTdCQA&s",
        },
        {
          name: "Genshin Impact",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO9K8jTewegEUTXNfgGeYWx8hztA2Ed4frkA&s",
        },
      ].map((game) => (
        <div key={game.name} className="flex flex-col items-center gap-2">
          <img
            src={game.img}
            className="w-16 h-16 rounded-xl object-cover opacity-80 hover:opacity-100 transition"
            alt={game.name}
          />
          <p className="text-[11px] text-white/60">
            {game.name}
          </p>
        </div>
      ))}
    </div>
  </div>

  {/* Singers */}
  <div className="text-center">
    <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
      singers
    </p>

    <div className="flex justify-center gap-6">
      {[
        {
          name: "Central Cee",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC0MWyV2GLAXfvS-cYL97zTdBhTJVjL6TdblQu24nsrY2yzZFV5viqE73hC_6icEOG5lGN6joyxt1kQCuYTn_vzIHYgiH834wf9yA_cnc&s=10",
        },
        {
          name: "Daniel Di Angelo",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzo2wR9-aL-U7u7AmSfG7WL_9BDhgcDLETV7kItqek9_7F7aio-7zf1gdsOuDFA939N-sbUA&s",
        },
        {
          name: "Juice WRLD",
          img: "https://i.guim.co.uk/img/media/cd59a408307ade77175cbef95d736687c971baf6/0_1869_5792_3473/master/5792.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=1ccd7a4b4f2daa05ff26a5393439025c",
        },
      ].map((artist) => (
        <div key={artist.name} className="flex flex-col items-center gap-2">
          <img
            src={artist.img}
            className="w-16 h-16 rounded-full object-cover opacity-80 hover:opacity-100 transition"
            alt={artist.name}
          />
          <p className="text-[11px] text-white/60">
            {artist.name}
          </p>
        </div>
      ))}
    </div>
  </div>

  {/* Anime */}
  <div className="text-center">
    <p className="text-xs uppercase tracking-widest text-white/40 mb-4">
      anime
    </p>

    <div className="flex justify-center gap-6">
      {[
        {
          name: "One Piece",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQq5ghQ04JPWOtq052rmDR0KoFINzAnK4CUqw&s",
        },
        {
          name: "Demon Slayer",
          img: "https://static01.nyt.com/images/2025/09/20/multimedia/19cul-demonslayer-review2-qglj/19cul-demonslayer-review2-qglj-mediumSquareAt3X.jpg",
        },
        {
          name: "Horimiya",
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT2TV-eDsLXDFg6yXjXRheZ2_moUtVono-wt-cZKZJ61PO-ohFiCkpEg5-sKLf2btNQGtnU4H0iclfy9OxjCEwXnRLLYXRAf3w1aGY3_w&s=10",
        },
      ].map((anime) => (
        <div key={anime.name} className="flex flex-col items-center gap-2">
          <img
            src={anime.img}
            className="w-16 h-16 rounded-xl object-cover opacity-80 hover:opacity-100 transition"
            alt={anime.name}
          />
          <p className="text-[11px] text-white/60">
            {anime.name}
          </p>
        </div>
      ))}
    </div>
  </div>

</div>


          {/* Socials */}
          <div className="mt-9 flex justify-center gap-7">
            <a href="https://instagram.com/arihanntt" target="_blank">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                className="w-6 opacity-70 hover:opacity-100 transition"
              />
            </a>
            <a
              href="https://open.spotify.com/user/31r3l3stkdiod6iz3vnurdmiltai"
              target="_blank"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/2111/2111624.png"
                className="w-6 opacity-70 hover:opacity-100 transition"
              />
            </a>
            <a
              href="https://www.roblox.com/users/3621433441/profile"
              target="_blank"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/48/Roblox_Logo_2021.png"
                className="w-6 opacity-70 hover:opacity-100 transition"
              />
            </a>
          </div>

          {/* CTA (REBRANDED, CLEAN) */}
          <div className="mt-12 text-center">
            <p className="text-sm text-white/70 mb-4">
              if you know, you know.  
if you don’t — you will.

            </p>
            <a
              href="https://drixestudio.services"
              className="inline-block px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition"
            >
              reach out

            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-10 text-xs text-white/40 text-center">
          built late. deployed later.
        </p>
      </div>
    </main>
  );
}
