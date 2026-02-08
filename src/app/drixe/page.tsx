"use client";

import { useEffect, useState } from "react";
import Presence from "@/components/Presence";
import { useSpotify } from "@/app/hooks/useSpotify";
import WhoAmI from "@/components/WhoAmI";
import { cn } from "@/lib/utils";
import { 
  Grenze_Gotisch, 
  UnifrakturMaguntia, 
  Cinzel_Decorative, 
  Inter_Tight, 
  JetBrains_Mono 
} from "next/font/google";

const goth = Grenze_Gotisch({ weight: ["400", "700", "900"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

const statusLines = [
  "the shadow grows.",
  "silent observation.",
  "the void beckons.",
  "sanctum active.",
];

export default function Home() {
  const { now, recent, top } = useSpotify();
  const [musicOn, setMusicOn] = useState(false);
  const [status, setStatus] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
const [spotifyEmbed, setSpotifyEmbed] = useState<string | null>(null);


  useEffect(() => {
    const i = setInterval(() => {
      setStatus((prev) => (prev + 1) % statusLines.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 6 ? "the moon is high." : hour < 12 ? "daylight breaks." : hour < 18 ? "the sun fades." : "the ritual begins.";

useEffect(() => {
  let trackUrl: string | undefined;

  // 1️⃣ Currently playing
  if (now?.isPlaying && now.song?.url) {
    trackUrl = now.song.url;
  }

  // 2️⃣ Fallback to most recent
  else if (recent?.length > 0 && recent[0]?.url) {
    trackUrl = recent[0].url;
  }

  // 3️⃣ Fallback to top track
  else if (top?.length > 0 && top[0]?.url) {
    trackUrl = top[0].url;
  }

  if (trackUrl) {
    const trackId = trackUrl.split("/track/")[1]?.split("?")[0];
    if (trackId) {
      setSpotifyEmbed(`https://open.spotify.com/embed/track/${trackId}`);
      return;
    }
  }

  setSpotifyEmbed(null);
  setShowPlayer(false);
}, [now, recent, top]);




  return (
    <main className="min-h-screen bg-white text-black relative overflow-hidden selection:bg-black selection:text-white">
      
      {/* --- ARCHITECTURAL FRAMEWORK (BLACK RULES) --- */}
      <div className="fixed inset-0 pointer-events-none z-50 flex justify-between px-6 md:px-12 opacity-5">
        <div className="w-px h-full bg-black" />
        <div className="w-px h-full bg-black" />
      </div>



      {/* --- AUDIO TOGGLE --- */}
     <button
  onClick={() => {
    if (spotifyEmbed) {
      setShowPlayer(!showPlayer);
    }
  }}
  className={cn(
    "fixed top-6 right-6 z-[100] px-6 py-2 border border-black bg-white text-[10px] font-black tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all",
    mono.className
  )}
>
  {spotifyEmbed ? (showPlayer ? "HIDE_PLAYER" : "UNVEIL_AUDIO") : "NO_SIGNAL"}
</button>
{showPlayer && spotifyEmbed && (
  <div className="fixed top-20 right-6 z-[99] w-[300px] border border-black bg-white shadow-xl">
    <iframe
      src={spotifyEmbed}
      width="100%"
      height="80"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  </div>
)}


      {/* --- DASHBOARD GRID --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

        {/* --- LEFT SIDE: IDENTITY --- */}
        <div className="space-y-12">
          <div className="relative border border-black/10 p-8 pt-12 bg-white">
            {/* Structural Bracket */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-black" />

            <p className={cn("text-[10px] uppercase tracking-[0.5em] text-zinc-300 mb-8", cinzel.className)}>
              {greeting}
            </p>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative group">
                <img
                  src="/images/pfp.gif"
                  className="w-32 h-32 object-cover border border-black p-1 grayscale group-hover:grayscale-0 transition-all duration-700 shadow-xl"
                  alt="pfp"
                />
                <span className="absolute -bottom-2 -right-2 text-2xl">†</span>
              </div>

              <div className="space-y-2">
                <h1 className={cn("text-6xl text-black", blackletter.className)}>Drixe</h1>
                <p className={cn("text-[10px] tracking-[0.4em] uppercase text-zinc-400", mono.className)}>
                  Level 19 // Jan 14
                </p>
                <div className="py-6 flex justify-center">
                   <div className="w-12 h-px bg-black/10" />
                </div>
                <p className={cn("text-xl italic text-black/50", goth.className)}>
                  {statusLines[status]}
                </p>
              </div>
            </div>
          </div>
          <Presence />
        </div>

        {/* --- RIGHT SIDE: CONTENT --- */}
        <div className="lg:col-span-2 space-y-16">
          <WhoAmI />

          {/* --- ARCHIVE SECTION (FAVORITES) --- */}
          <div className="relative border border-black/10 p-10 space-y-24 bg-white">
            <div className="flex items-center gap-6">
               <h2 className={cn("text-5xl text-black", blackletter.className)}>Archives</h2>
               <div className="h-px flex-1 bg-black/5" />
            </div>

            {/* ARTISTS */}
            <div className="space-y-8">
              <p className={cn("text-[10px] uppercase tracking-[0.6em] text-black", cinzel.className)}>
                Auditory Repeat
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                {[
                  { name: "Central Cee", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB-EhUZKotDowANFQDnjhxt6NFh5pi7fd7TIcWCpusIeGmCJO9CKLMnIG15baioUroUIuSNGU2JAy10qYjic_lK3Eyd4Lb703h4u_ZqIdkMg&s=10" },
                  { name: "Juice WRLD", img: "https://i.guim.co.uk/img/media/cd59a408307ade77175cbef95d736687c971baf6/0_1869_5792_3473/master/5792.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=1ccd7a4b4f2daa05ff26a5393439025c" },
                  { name: "Daniel Di Angelo", img: "https://i.scdn.co/image/ab6761610000e5eb7e2cf7db02a2a2ea1baffd64" },
                ].map((artist) => (
                  <div key={artist.name} className="group cursor-crosshair">
                    <div className="overflow-hidden border border-black/[0.03] aspect-square bg-black">
                      <img
                        src={artist.img}
                        className="w-full h-full object-cover grayscale opacity-30100 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                        alt={artist.name}
                      />
                    </div>
                    <p className={cn("mt-4 text-[10px] tracking-[0.3em] text-black group-hover:text-black transition-colors uppercase font-bold", mono.className)}>
                      {artist.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ANIME */}
            <div className="space-y-8">
              <p className={cn("text-[10px] uppercase tracking-[0.6em] text-black", cinzel.className)}>
                Visual Chronicles
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                {[
                  { name: "One Piece", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOeEk4HzTXFamq8ezW2WhkKCHIx0t2dT78EQ&s" },
                  { name: "Demon Slayer", img: "https://media.tenor.com/_UjzdE-oNusAAAAM/nezuko-demon-slayer.gif" },
                  { name: "Horimiya", img: "https://i.pinimg.com/736x/7a/d5/01/7ad5010b4a7a3dba8617dc11b327f01f.jpg" },
                ].map((anime) => (
                  <div key={anime.name} className="group text-left">
                    <div className="overflow-hidden border border-black/[0.03] aspect-square bg-zinc-50">
                      <img
                        src={anime.img}
                        className="w-full h-full object-cover grayscale opacity-30100 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                        alt={anime.name}
                      />
                    </div>
                    <p className={cn("mt-4 text-[10px] tracking-[0.3em] text-black group-hover:text-black transition-colors uppercase font-bold", mono.className)}>
                      {anime.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* GAMES */}
            <div className="space-y-8">
              <p className={cn("text-[10px] uppercase tracking-[0.6em] text-black", cinzel.className)}>
                Virtual Escapism
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
                {[
                  { name: "Dead by Daylight", img: "https://upload.wikimedia.org/wikipedia/en/b/b7/Dead_by_Daylight_Steam_header.jpg" },
                  { name: "Roblox", img: "https://upload.wikimedia.org/wikipedia/commons/4/48/Roblox_Logo_2021.png" },
                  { name: "Genshin Impact", img: "https://i.ytimg.com/vi/spMAhbmBJrk/maxresdefault.jpg" },
                ].map((game) => (
                  <div key={game.name} className="group text-left">
                    <div className="overflow-hidden border border-black/[0.03] aspect-square bg-zinc-50">
                      <img
                        src={game.img}
                        className="w-full h-full object-cover grayscale opacity-30100 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                        alt={game.name}
                      />
                    </div>
                    <p className={cn("mt-4 text-[10px] tracking-[0.3em] text-black group-hover:text-black transition-colors uppercase font-bold", mono.className)}>
                      {game.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION CLOSER */}
            <div className="pt-10 flex justify-center text-black/5 select-none">
               <span className="text-4xl">†</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}