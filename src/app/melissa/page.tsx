"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:ital,wght@0,400;0,700;0,800;0,900;1,400&family=Great+Vibes&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { overflow: hidden; height: 100%; }
  body {
    font-family: 'Nunito', sans-serif;
    -webkit-font-smoothing: antialiased;
    background: #000;
    overflow: hidden; height: 100%;
    cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><text y='26' font-size='26'>🫏</text></svg>") 8 8, auto;
  }

  .scroll-container {
    height: 100svh; overflow-y: scroll;
    scroll-snap-type: y mandatory; scroll-behavior: smooth;
  }
  .scroll-container::-webkit-scrollbar { display: none; }

  .scene {
    height: 100svh; width: 100%;
    scroll-snap-align: start;
    position: relative; overflow: hidden; flex-shrink: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }

  /* ── Curtain ── */
  .curtain-l, .curtain-r {
    position: absolute; top: 0; bottom: 0; width: 52%;
    z-index: 100; transition: transform 1.5s cubic-bezier(0.77,0,0.18,1);
  }
  .curtain-l { left:0;  background: linear-gradient(90deg,  #7A0000 0%, #B00010 40%, #8B0000 100%); }
  .curtain-r { right:0; background: linear-gradient(270deg, #7A0000 0%, #B00010 40%, #8B0000 100%); }
  .curtain-l::before,.curtain-r::before {
    content:''; position:absolute; inset:0;
    background: repeating-linear-gradient(90deg, rgba(0,0,0,0.2) 0px,transparent 20px,transparent 20px,rgba(255,255,255,0.04) 40px);
  }
  .curtain-l.open  { transform: translateX(-103%); }
  .curtain-r.open  { transform: translateX(103%); }
  .curtain-rod {
    position:absolute; top:0; left:0; right:0; height:20px; z-index:101;
    background: linear-gradient(180deg, #A07820, #E8C840, #A07820);
    box-shadow: 0 4px 20px rgba(0,0,0,0.7);
  }

  /* ── Keyframes ── */
  @keyframes bounce    { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-20px)} }
  @keyframes float     { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-16px) rotate(2deg)} }
  @keyframes wiggle    { 0%,100%{transform:rotate(-5deg)}   50%{transform:rotate(5deg)} }
  @keyframes pop       { 0%{transform:scale(0) rotate(-12deg);opacity:0} 70%{transform:scale(1.1) rotate(2deg)} 100%{transform:scale(1);opacity:1} }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(44px)} to{opacity:1;transform:none} }
  @keyframes fadeIn    { from{opacity:0} to{opacity:1} }
  @keyframes confFall  { 0%{transform:translateY(-60px) rotate(0);opacity:1} 100%{transform:translateY(110vh) rotate(600deg);opacity:0} }
  @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.22)} 28%{transform:scale(1)} 42%{transform:scale(1.14)} }
  @keyframes stampIn   { 0%{transform:translate(-50%,-50%) scale(4) rotate(-10deg);opacity:0;filter:blur(12px)} 65%{transform:translate(-50%,-50%) scale(0.95) rotate(2deg)} 100%{transform:translate(-50%,-50%) scale(1) rotate(-15deg);opacity:1;filter:none} }
  @keyframes shake     { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-4deg) translateX(-4px)} 40%{transform:rotate(4deg) translateX(4px)} 60%{transform:rotate(-3deg)} 80%{transform:rotate(3deg)} }
  @keyframes mouthAnim { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.25)} }
  @keyframes glow      { 0%,100%{box-shadow:0 0 20px rgba(255,215,0,0.4),0 8px 30px rgba(255,100,0,0.3)} 50%{box-shadow:0 0 60px rgba(255,215,0,0.9),0 0 100px rgba(255,100,0,0.4)} }
  @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0.15} }
  @keyframes scrollBob { 0%,100%{transform:translateY(0) rotate(45deg)} 50%{transform:translateY(8px) rotate(45deg)} }
  @keyframes ribbonWave{ 0%,100%{transform:skewX(-2deg)} 50%{transform:skewX(2deg)} }
  @keyframes starBurst { 0%{transform:translate(-50%,-50%) scale(0) rotate(0);opacity:0} 50%{transform:translate(-50%,-50%) scale(1.4) rotate(180deg);opacity:1} 100%{transform:translate(-50%,-50%) scale(1) rotate(360deg);opacity:1} }

  .conf-piece { position:fixed; animation:confFall linear forwards; pointer-events:none; z-index:9999; border-radius:2px; }

  .donkey-wrap { cursor:pointer; user-select:none; -webkit-tap-highlight-color:transparent; }
  .donkey-wrap:active { transform:scale(0.87) rotate(-7deg) !important; }

  .nav-dots { position:fixed; right:16px; top:50%; transform:translateY(-50%); display:flex; flex-direction:column; gap:10px; z-index:500; }
  .nav-dot { width:9px; height:9px; border-radius:50%; background:rgba(255,255,255,0.25); cursor:pointer; transition:transform 0.3s,background 0.3s; border:1.5px solid rgba(255,255,255,0.35); }
  .nav-dot.active { background:white; transform:scale(1.45); }

  .scroll-hint { position:absolute; bottom:clamp(20px,4vw,36px); left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:8px; font-size:10px; letter-spacing:0.35em; color:rgba(255,255,255,0.35); text-transform:uppercase; pointer-events:none; }
  .scroll-arr { width:20px; height:20px; border-right:2px solid rgba(255,255,255,0.3); border-bottom:2px solid rgba(255,255,255,0.3); transform:rotate(45deg); animation:scrollBob 1.5s ease-in-out infinite; }

  .btn { display:inline-flex; align-items:center; gap:10px; padding:15px clamp(24px,5vw,44px); border:none; border-radius:100px; font-family:'Fredoka One',cursive; font-size:clamp(15px,4vw,21px); cursor:pointer; letter-spacing:0.04em; transition:transform 0.25s cubic-bezier(0.22,1,0.36,1),box-shadow 0.25s; }
  .btn:hover  { transform:translateY(-5px) scale(1.04); }
  .btn:active { transform:scale(0.93); }

  .roast-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:clamp(18px,3vw,26px); cursor:pointer; transition:transform 0.3s,border-color 0.3s,background 0.3s; }
  .roast-card:hover { transform:translateY(-6px); }
  .roast-card.done  { background:linear-gradient(135deg,rgba(255,215,0,0.1),rgba(255,100,0,0.07)); border-color:rgba(255,215,0,0.3); }
`;

/* ── Confetti ── */
const CC = ["#FF6B9D","#FFD93D","#6BCB77","#4D96FF","#FF6B6B","#C77DFF","#FF9F1C","#00D4FF"];
function boom(n=80) {
  const root = document.getElementById("cr");
  if (!root) return;
  for (let i=0;i<n;i++) {
    const el = document.createElement("div");
    el.className = "conf-piece";
    const size = 6+Math.random()*10;
    el.style.cssText = `left:${Math.random()*100}vw;top:-30px;width:${size}px;height:${size}px;background:${CC[~~(Math.random()*CC.length)]};border-radius:${Math.random()>.5?"50%":"3px"};animation-duration:${2+Math.random()*2.5}s;animation-delay:${Math.random()*1.3}s;transform:rotate(${Math.random()*360}deg)`;
    root.appendChild(el);
    setTimeout(()=>el.remove(),5500);
  }
}

/* ══════════════════════════════════════════
   SHREK DONKEY SVG
══════════════════════════════════════════ */
function ShrekDonkey({ px=260, talking=false, party=false, style={} }: { px?: number, talking?: boolean, party?: boolean, style?: React.CSSProperties }) {
  return (
    <svg width={px} height={px*1.1} viewBox="0 0 220 242" style={style}>
      <defs>
        <radialGradient id="bG" cx="50%" cy="55%" r="52%">
          <stop offset="0%"   stopColor="#C8B890"/>
          <stop offset="100%" stopColor="#8C7C5C"/>
        </radialGradient>
        <radialGradient id="sG" cx="42%" cy="38%" r="58%">
          <stop offset="0%"   stopColor="#EDD4A0"/>
          <stop offset="100%" stopColor="#C8A070"/>
        </radialGradient>
        <filter id="ds"><feDropShadow dx="0" dy="6" stdDeviation="9" floodOpacity="0.28"/></filter>
      </defs>

      {/* Neck */}
      <ellipse cx="110" cy="205" rx="34" ry="46" fill="url(#bG)"/>

      {/* Ears */}
      <ellipse cx="70"  cy="62" rx="13" ry="44" fill="#9A8C6C" transform="rotate(-16 70 62)"/>
      <ellipse cx="70"  cy="62" rx="8"  ry="36" fill="#DDB8B8" transform="rotate(-16 70 62)"/>
      <ellipse cx="150" cy="58" rx="13" ry="44" fill="#9A8C6C" transform="rotate(16 150 58)"/>
      <ellipse cx="150" cy="58" rx="8"  ry="36" fill="#DDB8B8" transform="rotate(16 150 58)"/>

      {/* Head */}
      <ellipse cx="110" cy="128" rx="62" ry="66" fill="url(#bG)" filter="url(#ds)"/>
      <ellipse cx="110" cy="145" rx="46" ry="52" fill="#C4B080" opacity="0.45"/>

      {/* Snout */}
      <ellipse cx="110" cy="170" rx="36" ry="27" fill="url(#sG)"/>
      <ellipse cx="99"  cy="175" rx="7.5" ry="5.5" fill="#7A5030" opacity="0.75"/>
      <ellipse cx="121" cy="175" rx="7.5" ry="5.5" fill="#7A5030" opacity="0.75"/>

      {/* Eyes */}
      <ellipse cx="82"  cy="118" rx="15" ry="13" fill="white"/>
      <ellipse cx="138" cy="118" rx="15" ry="13" fill="white"/>
      <circle  cx="85"  cy="119" r="9"  fill="#2C1408"/>
      <circle  cx="141" cy="119" r="9"  fill="#2C1408"/>
      <circle  cx="88"  cy="115" r="3.5" fill="white"/>
      <circle  cx="144" cy="115" r="3.5" fill="white"/>
      {/* Eyelid sleepy */}
      <ellipse cx="82"  cy="113" rx="15" ry="7" fill="#B0A070" opacity="0.5"/>
      <ellipse cx="138" cy="113" rx="15" ry="7" fill="#B0A070" opacity="0.5"/>
      {/* Brows raised high */}
      <path d="M70 104 Q82 96 94 104"  stroke="#5A4820" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M126 104 Q138 96 150 104" stroke="#5A4820" strokeWidth="3.5" fill="none" strokeLinecap="round"/>

      {/* Big goofy mouth */}
      <path
        d={talking
          ? "M79 188 Q110 196 141 188 Q128 205 110 208 Q92 205 79 188Z"
          : "M76 186 Q110 208 144 186 Q132 214 110 218 Q88 214 76 186Z"
        }
        fill="#180800"
        style={talking?{animation:"mouthAnim 0.28s ease infinite",transformOrigin:"110px 196px"}:{}}
      />
      {/* Teeth — the iconic wide smile */}
      <rect x="89"  y="189" width="14" height="13" rx="4" fill="white"/>
      <rect x="104" y="189" width="14" height="13" rx="4" fill="white"/>
      <rect x="119" y="189" width="12" height="11" rx="3" fill="white" opacity="0.75"/>
      <rect x="78"  y="190" width="10" height="10" rx="3" fill="white" opacity="0.5"/>
      {/* Tongue */}
      <ellipse cx="110" cy="206" rx="15" ry="9" fill="#E84070" opacity={talking?1:0.85}/>

      {/* Smile creases */}
      <path d="M73 178 Q65 166 70 154" stroke="#9A8060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M147 178 Q155 166 150 154" stroke="#9A8060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Party hat */}
      {party && <>
        <polygon points="110,28 84,88 136,88" fill="#FF4757"/>
        <polygon points="110,28 84,88 136,88" fill="url(#ph)" opacity="0.8"/>
        <defs>
          <pattern id="ph" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(50)">
            <rect width="6" height="12" fill="#FFD93D"/>
          </pattern>
        </defs>
        <circle cx="110" cy="26" r="8"  fill="#FFD93D"/>
        <circle cx="110" cy="16" r="11" fill="#FF6B9D"/>
        <circle cx="84"  cy="88" r="5"  fill="#6BCB77"/>
        <circle cx="136" cy="88" r="5"  fill="#4D96FF"/>
        <circle cx="110" cy="88" r="4"  fill="#FFD93D"/>
      </>}
    </svg>
  );
}

/* ══════════════════════════════════════════
   SCENE 1 — CURTAIN
══════════════════════════════════════════ */
function S1_Curtain({ onOpen, open }: { onOpen: () => void; open: boolean }) {
  return (
    <div className="scene" style={{background:"#0A0A0A"}}>
      {/* Spotlight */}
      <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:"clamp(300px,75vw,700px)",height:"100%",background:"radial-gradient(ellipse 55% 85% at 50% 0%, rgba(255,220,80,0.14) 0%, transparent 65%)",pointerEvents:"none"}}/>

      <div className="curtain-rod"/>
      <div className={`curtain-l${open?" open":""}`}/>
      <div className={`curtain-r${open?" open":""}`}/>

      {!open && (
        <div style={{textAlign:"center",zIndex:50,padding:"0 32px"}}>
          <div style={{fontSize:"clamp(56px,16vw,110px)",marginBottom:"20px",animation:"float 2.5s ease-in-out infinite"}}>🫏</div>
          <p style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(13px,3.5vw,18px)",color:"rgba(255,215,0,0.65)",letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:"36px",animation:"fadeIn 1s ease 0.5s both",opacity:0}}>
            A special performance for…
          </p>
          <button
            className="btn"
            onClick={onOpen}
            style={{background:"linear-gradient(135deg,#FFD700,#FF8C00)",color:"#1A0800",boxShadow:"0 8px 40px rgba(255,180,0,0.5)",animation:"glow 2.2s ease-in-out infinite"}}
          >
            🎭 Open the Curtains
          </button>
        </div>
      )}

      {open && (
        <div style={{textAlign:"center",zIndex:50,padding:"0 24px",animation:"fadeIn 0.7s ease 1.3s both",opacity:0}}>
          <h1 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(40px,13vw,96px)",color:"#FFD700",textShadow:"4px 4px 0 #FF4500, 8px 8px 0 rgba(0,0,0,0.4)",lineHeight:1.05,animation:"fadeUp 1s ease 1.4s both",opacity:0}}>
            HAPPY<br/>BIRTHDAY<br/><span style={{color:"#FF6B9D",textShadow:"3px 3px 0 #900060"}}>MELISSA!!</span>
          </h1>
          <div style={{marginTop:"18px",fontSize:"clamp(30px,9vw,60px)",animation:"bounce 1.5s ease-in-out infinite"}}>
            🎂🫏🎉
          </div>
        </div>
      )}

      {open && <div className="scroll-hint"><span>scroll</span><div className="scroll-arr"/></div>}
    </div>
  );
}

/* ══════════════════════════════════════════
   SCENE 2 — INTERACTIVE DONKEY
══════════════════════════════════════════ */
const MSGS = [
  "HEE-HAW!! 🎉","HAPPY BIRTHDAY MELISSA!! 🫏",
  "You tapped me AGAIN?? I'm flattered 😍",
  "I would do ANYTHING for Melissa!! Literally anything!!",
  "HEE HAW = I love you btw 💕",
  "Shrek who?? TODAY IS ABOUT MELISSA!!",
  "I'm more than just a donkey — I'm a BIRTHDAY ICON 👑",
  "Okay you're literally my favourite person 🌟",
  "BRAY BRAY BRAY BRAY BRAY!! 🎉",
];

function S2_Donkey({ active }: { active: boolean }) {
  const [taps,   setTaps]   = useState(0);
  const [talk,   setTalk]   = useState(false);
  const [msg,    setMsg]    = useState("");
  const [sparks, setSparks] = useState([]);
  const timerRef = useRef(null);

  const tap = useCallback(() => {
    setTaps(t => t+1);
    setTalk(true);
    setMsg(MSGS[~~(Math.random()*MSGS.length)]);
    boom(22);
    const id = Date.now();
    setSparks(s=>[...s,{id,emoji:["⭐","💫","✨","🎉","💜","🫏","🔥"][~~(Math.random()*7)]}]);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(()=>{setTalk(false);setSparks([]);},2100);
  },[]);

  const tapLabel = taps===0
    ? "he's waiting for you… 👀"
    : taps<5   ? `${taps} taps — he's warming up 🫏`
    : taps<15  ? `${taps} taps — he's absolutely obsessed`
    : taps<30  ? `${taps} taps — okay you two need therapy`
    : `${taps} TAPS — this is a love story 😭`;

  return (
    <div className="scene" style={{background:"linear-gradient(160deg,#100820,#0C1830,#081408)",padding:"80px 24px 60px"}}>
      {/* Stars */}
      {Array.from({length:22}).map((_,i)=>(
        <div key={i} style={{position:"absolute",top:`${Math.random()*88}%`,left:`${Math.random()*94}%`,width:`${2+Math.random()*3}px`,height:`${2+Math.random()*3}px`,borderRadius:"50%",background:"white",opacity:0.2+Math.random()*0.5,animation:`blink ${1.5+Math.random()*3}s ease-in-out ${Math.random()*3}s infinite`,pointerEvents:"none"}}/>
      ))}

      <p style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(11px,3vw,14px)",letterSpacing:"0.4em",color:"rgba(255,215,0,0.6)",textTransform:"uppercase",marginBottom:"14px",animation:active?"fadeUp 0.8s ease 0.1s both":"none",opacity:active?undefined:0}}>
        your birthday donkey
      </p>
      <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(26px,8vw,58px)",color:"white",textAlign:"center",lineHeight:1.1,marginBottom:"28px",animation:active?"fadeUp 0.85s ease 0.25s both":"none",opacity:active?undefined:0,textShadow:"0 0 40px rgba(255,200,0,0.25)"}}>
        Tap him. He's excited. 👇
      </h2>

      {/* Speech bubble */}
      <div style={{minHeight:"56px",width:"100%",maxWidth:"420px",textAlign:"center",marginBottom:"10px",position:"relative"}}>
        {msg && talk && (
          <div style={{background:"white",color:"#180808",borderRadius:"20px",padding:"12px 22px",fontWeight:800,fontSize:"clamp(13px,3.5vw,17px)",boxShadow:"0 8px 30px rgba(0,0,0,0.35)",animation:"pop 0.3s ease both",position:"relative",display:"inline-block",maxWidth:"100%"}}>
            {msg}
            <div style={{position:"absolute",bottom:"-13px",left:"50%",transform:"translateX(-50%)",width:0,height:0,borderLeft:"12px solid transparent",borderRight:"12px solid transparent",borderTop:"14px solid white"}}/>
          </div>
        )}
      </div>

      {/* Donkey */}
      <div className="donkey-wrap" onClick={tap} style={{position:"relative",animation:talk?"shake 0.28s ease infinite":"float 3s ease-in-out infinite",filter:"drop-shadow(0 18px 40px rgba(255,200,50,0.28))",zIndex:10}}>
        {sparks.map(s=>(
          <div key={s.id} style={{position:"absolute",top:"30%",left:"50%",fontSize:"22px",pointerEvents:"none",animation:"starBurst 0.55s ease both",zIndex:20}}>{s.emoji}</div>
        ))}
        <ShrekDonkey px={Math.min(260, (typeof window!=="undefined"?window.innerWidth:360)*0.64)} talking={talk} party={true}/>
      </div>

      <p style={{color:"rgba(255,255,255,0.38)",fontSize:"clamp(12px,3vw,14px)",fontWeight:700,marginTop:"10px",letterSpacing:"0.04em",textAlign:"center"}}>
        {tapLabel}
      </p>

      <div className="scroll-hint"><span>keep going</span><div className="scroll-arr"/></div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCENE 3 — iMESSAGE THREAD
══════════════════════════════════════════ */
const THREAD = [
  { from:"donkey", text:"Melissa. MELISSA. wake up" },
  { from:"melissa", text:"it's 7am what" },
  { from:"donkey", text:"IT'S YOUR BIRTHDAY!!!!!!!! 🎂🎂🎂🎂🎂🎂🎂🎂" },
  { from:"donkey", text:"I have been awake since 4am preparing" },
  { from:"melissa", text:"preparing what" },
  { from:"donkey", text:"my speech. i wrote 14 drafts" },
  { from:"melissa", text:"donkey please" },
  { from:"donkey", text:"Draft 1: 'Melissa you are like the Fiona to my — '" },
  { from:"melissa", text:"DONKEY NO" },
  { from:"donkey", text:"okay okay ANYWAY happy birthday i love you so much" },
  { from:"donkey", text:"you are literally my favourite human" },
  { from:"donkey", text:"and i have met Shrek so that is saying A LOT" },
  { from:"melissa", text:"😭😭 okay i love you too" },
  { from:"donkey", text:"🎉🫏🎉🫏🎉🫏🎉🫏🎉🫏🎉" },
  { from:"donkey", text:"now get up we are celebrating ALL DAY" },
];

function S3_Chat({ active }: { active: boolean }) {
  const [shown, setShown]     = useState(0);
  const [typing, setTyping]   = useState(false);
  const bottomRef             = useRef(null);

  const next = useCallback(() => {
    if (shown >= THREAD.length) return;
    const msg = THREAD[shown];
    if (msg.from === "donkey") {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setShown(s => s + 1);
        boom(8);
      }, 900);
    } else {
      setShown(s => s + 1);
    }
  }, [shown]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [shown, typing]);

  const done = shown >= THREAD.length;

  return (
    <div className="scene" style={{
      background: "linear-gradient(160deg,#0A0A14,#0E0E1E,#0A1408)",
      padding: "0", flexDirection: "column", justifyContent: "flex-start",
    }}>
      {/* iMessage header bar */}
      <div style={{
        width: "100%", background: "rgba(20,20,30,0.95)",
        backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "clamp(52px,10vw,68px) 16px 12px",
        display: "flex", alignItems: "center", gap: "12px",
        flexShrink: 0, zIndex: 10,
      }}>
        <div style={{
          width: "42px", height: "42px", borderRadius: "50%",
          background: "linear-gradient(135deg,#8C7A5C,#C8A878)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "22px", flexShrink: 0,
          border: "2px solid rgba(255,255,255,0.15)",
        }}>🫏</div>
        <div>
          <div style={{ color: "white", fontWeight: 800, fontSize: "clamp(14px,3.5vw,16px)" }}>Donkey</div>
          <div style={{ color: "#6BCB77", fontSize: "11px", fontWeight: 700 }}>
            {typing ? "typing…" : "iMessage"}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "18px" }}>
          {["📞","🎥"].map(e=><span key={e} style={{fontSize:"18px",opacity:0.5}}>{e}</span>)}
        </div>
      </div>

      {/* Message list */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px 16px 8px",
        display: "flex", flexDirection: "column", gap: "6px",
        scrollBehavior: "smooth",
      }}>
        {/* Date chip */}
        <div style={{ textAlign: "center", margin: "8px 0 14px" }}>
          <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: "100px", padding: "4px 14px", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
            Today · {new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})} · Melissa's Birthday 🎂
          </span>
        </div>

        {THREAD.slice(0, shown).map((msg, i) => {
          const isDonkey = msg.from === "donkey";
          return (
            <div key={i} style={{
              display: "flex",
              justifyContent: isDonkey ? "flex-start" : "flex-end",
              animation: "fadeUp 0.35s ease both",
            }}>
              {isDonkey && (
                <div style={{ width:"28px",height:"28px",borderRadius:"50%",background:"linear-gradient(135deg,#8C7A5C,#C8A878)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",marginRight:"6px",flexShrink:0,alignSelf:"flex-end",marginBottom:"2px" }}>🫏</div>
              )}
              <div style={{
                maxWidth: "72%",
                background: isDonkey
                  ? "rgba(58,58,72,0.95)"
                  : "linear-gradient(135deg,#248AFF,#006AFF)",
                color: "white",
                borderRadius: isDonkey
                  ? "18px 18px 18px 4px"
                  : "18px 18px 4px 18px",
                padding: "10px 14px",
                fontSize: "clamp(13px,3.5vw,15px)",
                lineHeight: 1.45,
                fontWeight: 600,
                boxShadow: isDonkey
                  ? "0 2px 12px rgba(0,0,0,0.3)"
                  : "0 2px 16px rgba(0,106,255,0.4)",
                wordBreak: "break-word",
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px" }}>
            <div style={{ width:"28px",height:"28px",borderRadius:"50%",background:"linear-gradient(135deg,#8C7A5C,#C8A878)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",flexShrink:0 }}>🫏</div>
            <div style={{
              background: "rgba(58,58,72,0.95)", borderRadius: "18px 18px 18px 4px",
              padding: "12px 16px", display: "flex", gap: "5px", alignItems: "center",
              animation: "fadeUp 0.3s ease both",
            }}>
              {[0,1,2].map(d=>(
                <div key={d} style={{
                  width:"7px",height:"7px",borderRadius:"50%",
                  background:"rgba(255,255,255,0.55)",
                  animation:`blink 1.2s ease-in-out ${d*0.22}s infinite`,
                }}/>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Tap zone */}
      <div style={{ padding: "12px 16px clamp(32px,7vw,48px)", flexShrink: 0 }}>
        {!done ? (
          <button
            className="btn"
            onClick={next}
            disabled={typing}
            style={{
              width: "100%", justifyContent: "center",
              background: typing
                ? "rgba(255,255,255,0.07)"
                : "linear-gradient(135deg,#248AFF,#006AFF)",
              color: typing ? "rgba(255,255,255,0.3)" : "white",
              boxShadow: typing ? "none" : "0 6px 30px rgba(0,106,255,0.4)",
              fontSize: "clamp(14px,3.5vw,17px)",
              transition: "all 0.3s ease",
            }}
          >
            {typing ? "Donkey is typing… 🫏" : shown === 0 ? "📱 Open Message" : "Next →"}
          </button>
        ) : (
          <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease both" }}>
            <div style={{ fontSize: "clamp(22px,6vw,36px)", marginBottom: "8px", animation: "bounce 1.5s ease-in-out infinite" }}>🎉🫏🎉</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(12px,3vw,14px)", fontWeight: 700, marginBottom: "14px" }}>
              delivered · seen 💙
            </div>
          </div>
        )}
      </div>

      {done && <div className="scroll-hint" style={{bottom:"clamp(60px,12vw,80px)",color:"rgba(255,255,255,0.22)"}}><span>one last thing…</span><div className="scroll-arr" style={{borderColor:"rgba(255,255,255,0.22)"}}/></div>}
    </div>
  );
}

/* ══════════════════════════════════════════
   SCENE 4 — THE TROLL 💍
══════════════════════════════════════════ */
function S4_Troll({ active }: { active: boolean }) {
  const [open,  setOpen]  = useState(false);
  const [stamp, setStamp] = useState(false);

  useEffect(()=>{
    if(open){ boom(130); setTimeout(()=>{setStamp(true);boom(70);},1300); }
  },[open]);

  return (
    <div className="scene" style={{background:"linear-gradient(160deg,#060014,#14002A,#1A000E)",padding:"80px 20px 40px",textAlign:"center"}}>
      {/* bg orbs */}
      {[...Array(7)].map((_,i)=>(
        <div key={i} style={{position:"absolute",width:`${50+Math.random()*90}px`,height:`${50+Math.random()*90}px`,borderRadius:"50%",background:`radial-gradient(circle,${["rgba(255,80,180,0.14)","rgba(160,80,255,0.13)","rgba(80,180,255,0.09)"][i%3]},transparent)`,top:`${Math.random()*88}%`,left:`${Math.random()*88}%`,filter:"blur(12px)",animation:`float ${4+Math.random()*4}s ease-in-out ${Math.random()*3}s infinite`,pointerEvents:"none"}}/>
      ))}

      {!open ? (
        <div style={{animation:active?"fadeUp 0.9s ease 0.3s both":"none",opacity:active?undefined:0}}>
          <div style={{fontSize:"clamp(52px,15vw,96px)",marginBottom:"18px",animation:"heartbeat 2s ease-in-out infinite"}}>💌</div>
          <h2 style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(24px,7vw,54px)",color:"white",marginBottom:"12px"}}>
            One last surprise…
          </h2>
          <p style={{color:"rgba(255,180,255,0.55)",fontSize:"clamp(14px,3.5vw,19px)",fontWeight:700,marginBottom:"40px"}}>
            A very special announcement for Melissa 🫣
          </p>
          <button className="btn" onClick={()=>setOpen(true)}
            style={{background:"linear-gradient(135deg,#FF6B9D,#C77DFF)",color:"white",boxShadow:"0 8px 40px rgba(200,80,255,0.45)"}}>
            💌 Open Announcement
          </button>
        </div>
      ) : (
        <div style={{maxWidth:"600px",width:"100%",padding:"0 8px"}}>

          {/* WEDDING CARD */}
          <div style={{background:"linear-gradient(155deg,#FFFAF0,#FFF0F8)",borderRadius:"22px",padding:"clamp(24px,5vw,44px) clamp(18px,4vw,38px)",border:"1px solid rgba(255,215,0,0.35)",boxShadow:"0 30px 80px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.9)",position:"relative",overflow:"hidden",animation:"fadeUp 0.7s ease both"}}>

            {/* Corner ornaments */}
            {[[0,0,"0,0"],[0,1,"0,auto"],[1,0,"auto,0"],[1,1,"auto,auto"]].map(([ti,li,pos],i)=>{
              const [tv,lv]=pos.split(",");
              return <div key={i} style={{position:"absolute",top:tv==="0"?"0":"auto",bottom:tv==="auto"?"0":"auto",left:lv==="0"?"0":"auto",right:lv==="auto"?"0":"auto",width:"clamp(36px,9vw,60px)",height:"clamp(36px,9vw,60px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(14px,3.5vw,20px)",color:"rgba(184,154,94,0.4)",transform:i===1?"rotate(90deg)":i===2?"rotate(-90deg)":i===3?"rotate(180deg)":""}}>❋</div>;
            })}

            <p style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(9px,2.5vw,12px)",letterSpacing:"0.5em",color:"#B89A5E",textTransform:"uppercase",marginBottom:"14px",animation:"ribbonWave 3s ease-in-out infinite"}}>
              ✦ OFFICIAL ANNOUNCEMENT ✦
            </p>

            <p style={{fontFamily:"'Great Vibes',cursive",fontSize:"clamp(13px,3.5vw,17px)",color:"#7A5A3A",marginBottom:"10px"}}>
              With great joy, we announce the union of
            </p>

            <div style={{fontFamily:"'Great Vibes',cursive",fontSize:"clamp(34px,10vw,70px)",color:"#C0007A",lineHeight:1.15,margin:"10px 0",textShadow:"2px 2px 0 rgba(192,0,122,0.18)"}}>
              Emma
            </div>
            <div style={{fontFamily:"'Fredoka One',cursive",fontSize:"clamp(18px,5vw,30px)",color:"#B89A5E",margin:"4px 0"}}>
              &amp;
            </div>
            <div style={{fontFamily:"'Great Vibes',cursive",fontSize:"clamp(34px,10vw,70px)",color:"#6600CC",lineHeight:1.15,margin:"4px 0 14px",textShadow:"2px 2px 0 rgba(102,0,204,0.18)"}}>
              Melissa
            </div>

            <div style={{height:"1px",background:"linear-gradient(90deg,transparent,rgba(184,154,94,0.5),transparent)",margin:"14px 0"}}/>

            <p style={{fontFamily:"'Great Vibes',cursive",fontSize:"clamp(14px,3.5vw,21px)",color:"#5A4A3A",lineHeight:1.8}}>
              Two souls united by friendship,<br/>
              chaos, and an unreasonable love<br/>
              for a cartoon donkey 🫏
            </p>

            <div style={{height:"1px",background:"linear-gradient(90deg,transparent,rgba(184,154,94,0.5),transparent)",margin:"18px 0"}}/>

            <p style={{fontSize:"clamp(10px,2.5vw,13px)",color:"#8A7A5A",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>
              ♦ Best Friends Forever ♦
            </p>

            {/* STAMP */}
            {stamp && (
              <div style={{position:"absolute",top:"50%",left:"50%",border:"5px solid #FF4757",borderRadius:"10px",padding:"10px 18px",fontFamily:"'Fredoka One',cursive",fontSize:"clamp(22px,7vw,46px)",color:"#FF4757",whiteSpace:"nowrap",opacity:0.88,animation:"stampIn 0.5s cubic-bezier(0.22,1,0.36,1) both",pointerEvents:"none",letterSpacing:"0.1em",textShadow:"2px 2px 0 rgba(255,71,87,0.2)"}}>
                GOT YOU!! 😂
              </div>
            )}
          </div>

          {stamp && (
            <div style={{marginTop:"24px",animation:"fadeUp 0.8s ease 0.4s both"}}>
              <p style={{color:"rgba(255,190,255,0.85)",fontWeight:800,fontSize:"clamp(14px,4vw,19px)",marginBottom:"18px"}}>
                jk jk 😭💕 you two are literally the best friends ever fr 🫏✨
              </p>
              <button className="btn" onClick={()=>boom(220)} style={{background:"linear-gradient(135deg,#FF6B9D,#FFD93D)",color:"white",boxShadow:"0 8px 40px rgba(255,107,157,0.5)"}}>
                🎉 CELEBRATE MELISSA!! 🎉
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   ROOT
══════════════════════════════════════════ */
export default function MelissaBirthday() {
  const [open,    setOpen]    = useState(false);
  const [scene,   setScene]   = useState(0);
  const scrollRef = useRef(null);

  useEffect(()=>{
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return ()=>{ try{document.head.removeChild(s);}catch{} };
  },[]);

  useEffect(()=>{
    const c = scrollRef.current;
    if (!c) return;
    const h = ()=>setScene(Math.round(c.scrollTop/window.innerHeight));
    c.addEventListener("scroll",h,{passive:true});
    return ()=>c.removeEventListener("scroll",h);
  },[]);

  const goTo = i => scrollRef.current?.scrollTo({top:i*window.innerHeight,behavior:"smooth"});

  const handleOpen = () => {
    setOpen(true);
    boom(90);
    setTimeout(()=>goTo(1),2400);
  };

  return (
    <div style={{height:"100svh",overflow:"hidden"}}>
      <div id="cr" style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999}}/>

      {/* Nav dots */}
      <div className="nav-dots">
        {["🎭","🫏","🔥","💌"].map((e,i)=>(
          <div key={i} className={`nav-dot${scene===i?" active":""}`} onClick={()=>goTo(i)} title={e}/>
        ))}
      </div>

      <div ref={scrollRef} className="scroll-container">
        <S1_Curtain onOpen={handleOpen} open={open}/>
        <S2_Donkey  active={scene===1}/>
        <S3_Chat    active={scene===2}/>
        <S4_Troll   active={scene===3}/>
      </div>
    </div>
  );
}