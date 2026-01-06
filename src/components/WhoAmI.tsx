"use client";
import { useEffect, useRef, useState } from "react";
import { FaDiscord, FaInstagram } from "react-icons/fa";
import { SiRoblox } from "react-icons/si";

const GLITCH_CHARS = "$%#@^&!*+=<>";

function glitchify(text: string) {
  return text
    .split("")
    .map(() =>
      GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
    )
    .join("");
}

const GIFS = [
  {
    src: "https://i.pinimg.com/originals/67/0d/c9/670dc94d4384ff6b3383f27c61c5491a.gif",
    link: "https://pin.it/xxxxx1",
  },
  {
    src: "https://media.tenor.com/CrKHRmQeygwAAAAM/deep-web-dark-web.gif",
    link: "https://pin.it/xxxxx2",
  },
  {
    src: "https://media.tenor.com/Ckl89CUvjt4AAAAM/creepy-red.gif",
    link: "https://pin.it/xxxxx3",
  },
  {
    src: "https://media.tenor.com/QdgJcu3eA8AAAAAM/nope-cute-anime.gif",
    link: "https://pin.it/xxxxx4",
  },
  {
    src: "https://media.tenor.com/GKaRHApfkhwAAAAM/slap-handa-seishuu.gif",
    link: "https://pin.it/xxxxx5",
  },
  {
    src: "https://i.pinimg.com/originals/b9/1f/82/b91f82160034017f21ac3574705e1ed6.gif",
    link: "https://pin.it/xxxxx6",
  },

  {
    src: "https://64.media.tumblr.com/f1d5597e3e4abbdd93f82a6c97aa81b9/8c90388bfcea8ead-33/s400x600/8efe1967ecfdda45e6cd4a237482eb6d703890f3.gif",
    link: "https://pin.it/xxxxx7",
  },
  {
    src: "https://giffiles.alphacoders.com/111/111263.gif",
    link: "https://pin.it/xxxxx8",
  },
  {
    src: "https://gifdb.com/images/high/psycho-pass-aesthetic-idleglance-9hsaut9uppmips1k.gif",
    link: "https://pin.it/xxxxx9",
  },
  {
    src: "https://giffiles.alphacoders.com/111/111161.gif",
    link: "https://pin.it/xxxxx10",
  },
  {
    src: "https://img.wattpad.com/dc446c43e39427e05fde0172de49052c3960b3b3/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f6f6e674b42636346574357506f413d3d2d3933352e313639356138363331346637383066623836393535303132393930392e676966",
    link: "https://pin.it/xxxxx11",
  },
  {
    src: "https://64.media.tumblr.com/fa45de38599ace4fafa3c3f758598a94/5aa656d274461df0-71/s540x810/7d5001be57957b1884fb891e0135958ca37344d0.gif",
    link: "https://pin.it/xxxxx12",
  },
];



export default function WhoAmI() {
  const baseLocation = `"&**&^*"`;
  const [glitchText, setGlitchText] = useState(baseLocation);
  const [hearts, setHearts] = useState<number[]>([]);
  const loveRef = useRef<HTMLSpanElement>(null);

  /* -------- CONSTANT GLITCH -------- */
  useEffect(() => {
    const i = setInterval(() => {
      setGlitchText(glitchify(baseLocation));
    }, 100); // nonstop fast glitch
    return () => clearInterval(i);
  }, []);

  /* -------- HEARTS FROM LOVE -------- */
  useEffect(() => {
    const i = setInterval(() => {
      setHearts((h) => [...h, Date.now()]);
      setTimeout(() => setHearts((h) => h.slice(1)), 1400);
    }, 900);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 overflow-hidden">

      {/* BACKGROUND PNG */}
      <img
        src="/images/about-bg.png"
        className="absolute right-0 top-0 h-full opacity-10 pointer-events-none"
        alt=""
      />

      {/* SOCIAL LINKS */}
<div className="absolute top-4 right-4 flex gap-3">
  <a
    href="https://discord.com/users/928934131893686292"
    target="_blank"
    className="opacity-70 hover:opacity-100 transition"
  >
    <FaDiscord className="w-5 h-5" />
  </a>

  <a
    href="https://instagram.com/arihanntt"
    target="_blank"
    className="opacity-70 hover:opacity-100 transition"
  >
    <FaInstagram className="w-5 h-5" />
  </a>

  <a
    href="https://www.roblox.com/users/3621433441/profile"
    target="_blank"
    className="opacity-70 hover:opacity-100 transition"
  >
    <SiRoblox className="w-5 h-5" />
  </a>
</div>


      {/* ---------------- ABOUT ME ---------------- */}
      <p className="text-[11px] uppercase tracking-widest text-white/40 mb-3">
        about me
      </p>

      <p className="text-sm text-white/70 leading-relaxed">
        I&apos;m <span className="text-white font-medium">Drixe (Arihant)</span> —
        an 18 year old hobby developer and music enjoyer from{" "}
        <span className="inline-block font-mono text-white/80 blur-[0.6px]">
          {glitchText}
        </span>
      </p>

      {/* LIGHT DIVIDER */}
      <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* ---------------- INTERESTS ---------------- */}
      <p className="text-[11px] uppercase tracking-widest text-white/40 mb-3">
        interests
      </p>

      <p className="text-sm text-white/70 leading-relaxed relative">
        i love music, no like, i{" "}
        <span
          ref={loveRef}
          className="relative text-red-500 font-semibold inline-block"
        >
          LOVE
          {hearts.map((id) => (
            <span
              key={id}
              className="absolute left-1/2 -translate-x-1/2 text-red-500 text-xs animate-float"
              style={{ bottom: "-6px" }}
            >
              &lt;3
            </span>
          ))}
        </span>{" "}
        music. i also enjoy gaming, coding, watching anime and wasting{" "}
        <span className="text-white/40">(all my)</span> time on the internet.
      </p>

      {/* LIGHT DIVIDER */}
      <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* ---------------- GIFS ---------------- */}
      <div className="flex gap-4 items-end">
        <div className="grid grid-cols-6 gap-1">
          {GIFS.map((gif, i) => (
            <a
              key={i}
              href={gif.link}
              target="_blank"
              className="block"
            >
              <img
                src={gif.src}
                className="h-12 w-20 rounded-md object-cover opacity-80 hover:opacity-100 transition"
              />
            </a>
          ))}
        </div>

        <div className="text-xs text-white/40">
          69 views
        </div>
      </div>
    </div>
  );
}
