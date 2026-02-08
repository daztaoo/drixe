"use client";

import { useEffect, useRef, useState } from "react";
import { FaDiscord, FaInstagram } from "react-icons/fa";
import { SiRoblox } from "react-icons/si";
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

// Gothic-themed glitch characters
const GLITCH_CHARS = "†‡LXVMMXXVI";

function glitchify(text: string) {
  const chars = text.split("");
  const maxChanges = Math.min(chars.length, 3);
  const numChanges = Math.floor(Math.random() * maxChanges) + 1;
  const indices = new Set<number>();
  while (indices.size < numChanges) {
    indices.add(Math.floor(Math.random() * chars.length));
  }
  indices.forEach((index) => {
    chars[index] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
  });
  return chars.join("");
}

const GIFS = [
  { src: "https://i.pinimg.com/originals/67/0d/c9/670dc94d4384ff6b3383f27c61c5491a.gif", link: "#" },
  { src: "https://media.tenor.com/CrKHRmQeygwAAAAM/deep-web-dark-web.gif", link: "#" },
  { src: "https://media.tenor.com/Ckl89CUvjt4AAAAM/creepy-red.gif", link: "#" },
  { src: "https://media.tenor.com/QdgJcu3eA8AAAAAM/nope-cute-anime.gif", link: "#" },
  { src: "https://media.tenor.com/GKaRHApfkhwAAAAM/slap-handa-seishuu.gif", link: "#" },
  { src: "https://i.pinimg.com/originals/b9/1f/82/b91f82160034017f21ac3574705e1ed6.gif", link: "#" },
  { src: "https://64.media.tumblr.com/f1d5597e3e4abbdd93f82a6c97aa81b9/8c90388bfcea8ead-33/s400x600/8efe1967ecfdda45e6cd4a237482eb6d703890f3.gif", link: "#" },
  { src: "https://giffiles.alphacoders.com/111/111263.gif", link: "#" },
  { src: "https://gifdb.com/images/high/psycho-pass-aesthetic-idleglance-9hsaut9uppmips1k.gif", link: "#" },
  { src: "https://giffiles.alphacoders.com/111/111161.gif", link: "#" },
  { src: "https://img.wattpad.com/dc446c43e39427e05fde0172de49052c3960b3b3/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f6f6e674b42636346574357506f413d3d2d3933352e313639356138363331346637383066623836393535303132393930392e676966", link: "#" },
  { src: "https://64.media.tumblr.com/fa45de38599ace4fafa3c3f758598a94/5aa656d274461df0-71/s540x810/7d5001be57957b1884fb891e0135958ca37344d0.gif", link: "#" },
];

export default function WhoAmI() {
  const baseLocation = "VOID"; 
  const [glitchText, setGlitchText] = useState(baseLocation);
  const [hearts, setHearts] = useState<number[]>([]);
  const loveRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const i = setInterval(() => setGlitchText(glitchify(baseLocation)), 120); 
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setHearts((h) => [...h, Date.now()]);
      setTimeout(() => setHearts((h) => h.slice(1)), 1400);
    }, 900);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative bg-white border border-black/10 p-10 overflow-hidden">
      
      {/* CORNER DECOR */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-black" />

      {/* SOCIAL LINKS (REDESIGNED) */}
      <div className="absolute top-10 right-10 flex flex-col gap-6 items-center">
        <a href="https://discord.com/users/928934131893686292" target="_blank" className="text-zinc-300 hover:text-black transition-colors">
          <FaDiscord size={18} />
        </a>
        <a href="https://instagram.com/arihanntt" target="_blank" className="text-zinc-300 hover:text-black transition-colors">
          <FaInstagram size={18} />
        </a>
        <a href="https://www.roblox.com/users/3621433441/profile" target="_blank" className="text-zinc-300 hover:text-black transition-colors">
          <SiRoblox size={18} />
        </a>
      </div>

      {/* --- SECTION: ABOUT --- */}
      <div className="mb-12">
        <p className={cn("text-[10px] uppercase tracking-[0.6em] text-zinc-300 mb-6", cinzel.className)}>
          ABOUT ME
        </p>

        <p className={cn("text-xl md:text-2xl text-zinc-500 leading-tight", inter.className)}>
          I am <span className={cn("text-black text-4xl md:text-5xl block my-2", blackletter.className)}>Drixe (arihant)</span>
          An 19 year old developer and music enthusiast from{" "}
          <span className={cn("inline-block w-[60px] text-black font-black text-center border-b border-black", goth.className)}>
            {glitchText}
          </span>
        </p>
      </div>

      <div className="my-10 h-px bg-black/5" />

      {/* --- SECTION: INTERESTS --- */}
      <div className="mb-12">
        <p className={cn("text-[10px] uppercase tracking-[0.6em] text-zinc-300 mb-6", cinzel.className)}>
          INTERESTS
        </p>

        <p className={cn("text-lg text-zinc-500 leading-relaxed max-w-xl", inter.className)}>
          i love music, no like, i {" "}
          <span ref={loveRef} className="relative text-black font-black italic inline-block mx-1">
            LOVE
            {hearts.map((id) => (
              <span key={id} className="absolute left-1/2 -translate-x-1/2 text-red-600 text-xs animate-float" style={{ bottom: "-8px" }}>
                †
              </span>
            ))}
          </span>{" "}
         music. i also enjoy gaming, coding, watching anime and wasting (all my) time on the internet.
        </p>
      </div>

      <div className="my-10 h-px bg-black/5" />

      {/* --- SECTION: ARCHIVE (GIFS) --- */}
      <div className="space-y-6">
        <p className={cn("text-[10px] uppercase tracking-[0.6em] text-zinc-300", cinzel.className)}>
          Visual_Artifacts
        </p>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {GIFS.map((gif, i) => (
              <a key={i} href={gif.link} target="_blank" className="block border border-black/5 overflow-hidden group">
                <img
                  src={gif.src}
                  className="h-16 w-24 object-cover grayscale brightness-110 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
              </a>
            ))}
          </div>

          <div className={cn("text-[10px] text-zinc-300 font-bold ml-auto", mono.className)}>
            69_VIEWS
          </div>
        </div>
      </div>

      {/* CHISELED MARKER */}
      <div className="mt-12 flex justify-center text-black/5 select-none">
         <span className="text-4xl">†</span>
      </div>
    </div>
  );
}