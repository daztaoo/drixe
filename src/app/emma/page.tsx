"use client";

import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   GLOBAL STYLES + KEYFRAMES
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:opsz,wght@9..40,200;9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #F7F4EF;
    --bg-dark:     #0C0C0A;
    --ink:         #0C0C0A;
    --ink-soft:    #3A3530;
    --ink-muted:   #8C8278;
    --gold:        #B89A5E;
    --gold-pale:   rgba(184,154,94,0.14);
    --gold-glow:   rgba(184,154,94,0.08);
    --glass:       rgba(255,255,255,0.52);
    --glass-bd:    rgba(255,255,255,0.38);
    --serif:       'Cormorant Garamond', Georgia, serif;
    --sans:        'DM Sans', system-ui, sans-serif;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); font-family: var(--sans); color: var(--ink); overflow-x: hidden; -webkit-font-smoothing: antialiased; }

  ::selection { background: rgba(184,154,94,0.2); }

  /* ── Scroll reveals ── */
  .reveal {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 1s cubic-bezier(0.22,1,0.36,1),
                transform 1s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal.in { opacity: 1; transform: none; }
  .reveal-d1 { transition-delay: 0.12s; }
  .reveal-d2 { transition-delay: 0.24s; }
  .reveal-d3 { transition-delay: 0.36s; }
  .reveal-d4 { transition-delay: 0.48s; }

  /* ── Keyframes ── */
  @keyframes drift {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(14px,-18px) scale(1.04); }
    66%      { transform: translate(-10px,12px) scale(0.97); }
  }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-22px); }
  }
  @keyframes breathe {
    0%,100% { opacity: 0.28; }
    50%      { opacity: 0.55; }
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(44px); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scrollPulse {
    0%,100% { opacity: 0.4; transform: scaleY(1); }
    50%      { opacity: 0.8; transform: scaleY(0.6); }
  }

  /* ── Cards ── */
  .e-card {
    background: var(--glass);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--glass-bd);
    border-radius: 20px;
    padding: clamp(28px,4vw,44px) clamp(24px,3vw,36px);
    transition: transform 0.5s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.5s ease;
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .e-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .e-card:hover { transform: translateY(-10px) scale(1.015); box-shadow: 0 32px 80px rgba(12,12,10,0.12); }
  .e-card:hover::before { opacity: 1; }

  /* ── Nav links ── */
  .nav-link {
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--ink-muted);
    text-decoration: none;
    position: relative;
    transition: color 0.3s;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -3px; left: 0;
    width: 0; height: 1px;
    background: var(--ink);
    transition: width 0.3s ease;
  }
  .nav-link:hover { color: var(--ink); }
  .nav-link:hover::after { width: 100%; }

  /* ── Buttons ── */
  .btn-dark, .btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 15px clamp(28px,4vw,40px);
    border-radius: 100px; font-size: 13px;
    letter-spacing: 0.09em; font-family: var(--sans);
    text-decoration: none; cursor: pointer; border: none;
    transition: transform 0.35s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.35s ease,
                background 0.3s ease, color 0.3s ease;
  }
  .btn-dark  { background: var(--ink); color: #F7F4EF; }
  .btn-dark:hover  { transform: translateY(-3px); box-shadow: 0 18px 50px rgba(12,12,10,0.3); }
  .btn-ghost { background: rgba(255,255,255,0.7); color: var(--ink); border: 1px solid rgba(12,12,10,0.14); backdrop-filter: blur(10px); }
  .btn-ghost:hover { border-color: var(--ink); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(12,12,10,0.1); }

  /* ── Ghost watermark text ── */
  .watermark {
    position: absolute; pointer-events: none; user-select: none;
    font-family: var(--serif); font-weight: 300; letter-spacing: 0.1em;
    color: rgba(12,12,10,0.04); line-height: 1;
    white-space: nowrap;
  }

  /* ── Timeline ── */
  .tl-line {
    width: 1px;
    background: linear-gradient(to bottom, rgba(184,154,94,0.5), transparent);
    flex: 1;
    min-height: 56px;
    margin-top: 8px;
  }

  /* ── Inputs ── */
  .email-input {
    width: 100%; background: transparent;
    border: none; border-bottom: 1px solid rgba(247,244,239,0.2);
    color: #F7F4EF; padding: 14px 0;
    font-size: 16px; font-weight: 300;
    font-family: var(--sans); text-align: center;
    letter-spacing: 0.04em; outline: none;
    transition: border-color 0.3s;
  }
  .email-input:focus { border-bottom-color: var(--gold); }
  .email-input::placeholder { color: rgba(247,244,239,0.35); }

  .submit-btn {
    width: 100%; background: #F7F4EF; color: var(--bg-dark);
    border: none; padding: 16px; border-radius: 100px;
    font-size: 13px; letter-spacing: 0.1em; font-weight: 500;
    cursor: pointer; font-family: var(--sans);
    transition: background 0.3s ease, color 0.3s ease, transform 0.35s ease;
  }
  .submit-btn:hover { background: var(--gold); color: #fff; transform: translateY(-2px); }

  @media (max-width: 640px) {
    .desktop-only { display: none !important; }
  }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CARDS = [
  {
    n: "01",
    title: "Neuropsychological Assessment",
    body: "Comprehensive, evidence-based evaluations that map your cognitive landscape with precision and deep human care.",
  },
  {
    n: "02",
    title: "Cognitive Rehabilitation",
    body: "Tailored therapeutic programs that rebuild function and resilience following neurological injury or illness.",
  },
  {
    n: "03",
    title: "Diagnostic Consultation",
    body: "Expert clarity for complex neurological cases — for patients, families, and clinical teams navigating the unknown.",
  },
  {
    n: "04",
    title: "Advocacy & Education",
    body: "Empowering Canadians through research-backed cognitive wellness education and transformative community outreach.",
  },
];

const TIMELINE = [
  {
    marker: "Now",
    label: "The Vision",
    body: "The seed is planted. The vision is clear. Every patient Emma will ever help is already waiting — they just don't know her name yet.",
  },
  {
    marker: "Soon",
    label: "The Foundation",
    body: "Certifications. Research. Clinical training that others will one day cite. The quiet, disciplined work that precedes every great practice.",
  },
  {
    marker: "Near",
    label: "The Opening",
    body: "A space unlike any clinic in Canada — where walking in feels like exhaling, and the first appointment changes everything.",
  },
  {
    marker: "Then",
    label: "The Legacy",
    body: "Patients become advocates. Research becomes cited. Emma Baroud becomes a name synonymous with clarity, precision, and profound human care.",
  },
];

/* ─────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function EmmaBaroud() {
  const [scrollY, setScrollY] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    // Inject fonts + styles
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);

    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setNavScrolled(y > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useScrollReveal();

  const heroParallax = scrollY * 0.28;
  const heroOpacity  = Math.max(0, 1 - scrollY / 700);

  /* ── inline style helpers ── */


  return (
    <div style={{ fontFamily: "var(--sans)", background: "var(--bg)", color: "var(--ink)", overflowX: "hidden" }}>

      {/* ════════════════════════════════
          NAV
      ════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: "68px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,56px)",
        background: navScrolled ? "rgba(247,244,239,0.94)" : "transparent",
        backdropFilter: navScrolled ? "blur(16px)" : "none",
        borderBottom: navScrolled ? "1px solid rgba(12,12,10,0.06)" : "none",
        transition: "background 0.5s ease, backdrop-filter 0.5s ease, border-bottom 0.5s ease",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: "22px", fontWeight: 400, letterSpacing: "0.04em" }}>
            Emma Baroud
          </span>
          <span className="desktop-only" style={{ fontSize: "11px", letterSpacing: "0.3em", color: "var(--ink-muted)", textTransform: "uppercase" }}>
            Neuropsychology
          </span>
        </div>

        {/* Links */}
        <div className="desktop-only" style={{ display: "flex", gap: "40px" }}>
          {["Philosophy", "Expertise", "Vision", "Connect"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link" style={{ textTransform: "uppercase" }}>{l}</a>
          ))}
        </div>

        {/* CTA */}
        <button
          style={{
            background: "transparent", border: "1px solid rgba(12,12,10,0.22)",
            borderRadius: "100px", padding: "9px 22px",
            fontSize: "11px", letterSpacing: "0.1em", cursor: "pointer",
            fontFamily: "var(--sans)", textTransform: "uppercase",
            transition: "background 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ink)"; e.currentTarget.style.color = "#F7F4EF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "inherit"; }}
        >
          Join Waitlist
        </button>
      </nav>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <header style={{
        position: "relative", height: "100svh", minHeight: "700px",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(160deg, #EDE9E2 0%, #F7F4EF 45%, #EDE5D8 100%)",
      }}>

        {/* Parallax layer */}
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${heroParallax}px)` }}>
          <div style={{ position:"absolute", top:"8%", left:"6%", width:"clamp(260px,38vw,480px)", height:"clamp(260px,38vw,480px)", borderRadius:"50%", background:"radial-gradient(circle, rgba(184,154,94,0.22) 0%, transparent 68%)", filter:"blur(60px)", animation:"drift 14s ease-in-out infinite", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:"8%", right:"4%", width:"clamp(200px,30vw,380px)", height:"clamp(200px,30vw,380px)", borderRadius:"50%", background:"radial-gradient(circle, rgba(12,12,10,0.07) 0%, transparent 70%)", filter:"blur(50px)", animation:"float 18s ease-in-out infinite", animationDelay:"4s", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"45%", left:"60%", width:"180px", height:"180px", borderRadius:"50%", background:"radial-gradient(circle, rgba(184,154,94,0.15) 0%, transparent 70%)", filter:"blur(30px)", animation:"drift 20s ease-in-out infinite", animationDelay:"8s", pointerEvents:"none" }} />

          {/* Thin golden hairline */}
          <div style={{
            position: "absolute", top: "50%", left: "0", right: "0",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(184,154,94,0.35) 50%, transparent 100%)",
            transform: "translateY(-60px)",
          }} />
        </div>

        {/* Ghost watermarks */}
        <div className="watermark" style={{ top: "4%", left: "-1%", fontSize: "clamp(56px,11vw,160px)" }}>
          Dr. Emma Baroud
        </div>
        <div className="watermark" style={{ bottom: "6%", right: "-1%", fontSize: "clamp(48px,9vw,130px)", color: "rgba(12,12,10,0.03)" }}>
          2027
        </div>

        {/* Hero copy */}
        <div style={{
          position: "relative", zIndex: 10,
          textAlign: "center", padding: "0 clamp(24px,6vw,80px)",
          maxWidth: "1050px", opacity: heroOpacity,
        }}>
          {/* eyebrow */}
          <p style={{
            fontSize: "11px", letterSpacing: "0.45em", color: "var(--ink-muted)",
            textTransform: "uppercase", marginBottom: "36px",
            animation: "fadeIn 1s ease 0.2s both",
          }}>
            Neuropsychology · Canada · Est. Future
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: "var(--serif)", fontWeight: 300,
            fontSize: "clamp(46px,9.5vw,116px)",
            lineHeight: 1.03, letterSpacing: "-0.01em",
            color: "var(--ink)", marginBottom: "32px",
            animation: "fadeSlideUp 1.3s cubic-bezier(0.22,1,0.36,1) 0.3s both",
          }}>
            The mind has a future.
            <br />
            <em style={{ color: "var(--ink-muted)", fontWeight: 300 }}>
              Yours begins here.
            </em>
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: "clamp(15px,2.2vw,19px)", fontWeight: 300,
            color: "#5A5550", lineHeight: 1.8,
            maxWidth: "560px", margin: "0 auto 52px",
            animation: "fadeIn 1.4s ease 0.9s both",
          }}>
            A future neuropsychology practice built on precision, empathy, and
            evidence — designed to redefine cognitive wellness in Canada.
          </p>

          {/* CTAs */}
          <div style={{
            display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
            animation: "fadeSlideUp 1s ease 1.3s both",
          }}>
            <a href="#philosophy" className="btn-dark">Explore Vision →</a>
            <a href="#connect"    className="btn-ghost">Join Waitlist</a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
          animation: "fadeIn 1s ease 2.2s both",
        }}>
          <span style={{ fontSize: "9px", letterSpacing: "0.4em", color: "#aaa", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: "1px", height: "44px",
            background: "linear-gradient(to bottom, var(--ink-muted), transparent)",
            animation: "scrollPulse 2.4s ease-in-out infinite" }} />
        </div>
      </header>

      {/* ════════════════════════════════
          FUTURE IDENTITY — "letter from the future"
      ════════════════════════════════ */}
      <section id="philosophy" style={{
        background: "var(--bg-dark)", color: "#F7F4EF",
        padding: "clamp(90px,13vw,170px) clamp(24px,6vw,80px)",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* subtle gold glow */}
        <div style={{
          position: "absolute", top: "40%", left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          width: "clamp(300px,60vw,700px)", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,154,94,0.1) 0%, transparent 70%)",
          filter: "blur(70px)", pointerEvents: "none",
          animation: "breathe 5s ease-in-out infinite",
        }} />
        <div className="watermark" style={{ bottom: "5%", right: "-2%", color: "rgba(247,244,239,0.035)", fontSize: "clamp(50px,10vw,140px)" }}>
          Baroud
        </div>

        <div style={{ maxWidth: "840px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          {/* Section tag */}
          <p className="reveal" style={{
            fontSize: "11px", letterSpacing: "0.45em", color: "var(--gold)",
            textTransform: "uppercase", marginBottom: "44px",
          }}>
            A letter from the future
          </p>

          {/* Quote */}
          <blockquote className="reveal reveal-d1" style={{
            fontFamily: "var(--serif)", fontWeight: 300,
            fontSize: "clamp(24px,4.5vw,50px)",
            lineHeight: 1.5, letterSpacing: "0.01em",
            color: "#F7F4EF",
          }}>
            "Dr. Emma Baroud changed the way Canada understands the mind.
            Not through technology alone — but through the rare gift of truly{" "}
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>seeing</em>{" "}
            each patient."
          </blockquote>

          {/* Divider */}
          <div className="reveal reveal-d2" style={{
            marginTop: "48px", display: "flex",
            justifyContent: "center", alignItems: "center", gap: "24px",
          }}>
            <div style={{ height: "1px", width: "56px", background: "rgba(184,154,94,0.4)" }} />
            <span style={{ fontSize: "10px", letterSpacing: "0.4em", color: "var(--gold)", textTransform: "uppercase" }}>
              Written in Advance
            </span>
            <div style={{ height: "1px", width: "56px", background: "rgba(184,154,94,0.4)" }} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          ABOUT / PHILOSOPHY
      ════════════════════════════════ */}
      <section style={{
        background: "var(--bg)",
        padding: "clamp(80px,12vw,150px) clamp(24px,6vw,80px)",
      }}>
        <div style={{
          maxWidth: "1300px", margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(44px,7vw,90px)", alignItems: "start",
        }}>

          {/* Left */}
          <div className="reveal">
            <p style={{ fontSize: "11px", letterSpacing: "0.3em", color: "var(--ink-muted)", textTransform: "uppercase", marginBottom: "20px" }}>
              Founder & Lead Clinician
            </p>
            <h2 style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(36px,5vw,62px)",
              fontWeight: 400, lineHeight: 1.1, color: "var(--ink)", marginBottom: "40px",
            }}>
              A new paradigm<br />in neurological<br />
              <em style={{ fontWeight: 300, color: "var(--ink-muted)" }}>well-being.</em>
            </h2>

            {/* Identity badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "16px",
              borderTop: "1px solid rgba(12,12,10,0.1)", paddingTop: "28px",
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--gold-pale), rgba(184,154,94,0.28))",
                border: "1px solid rgba(184,154,94,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--serif)", fontSize: "20px", color: "var(--gold)",
                flexShrink: 0,
              }}>
                E
              </div>
              <div>
                <div style={{ fontFamily: "var(--serif)", fontSize: "20px", fontWeight: 400 }}>Emma Baroud</div>
                <div style={{ fontSize: "11px", color: "var(--ink-muted)", letterSpacing: "0.08em", marginTop: "2px" }}>
                  Future PhD · Neuropsychology
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="reveal reveal-d1" style={{ paddingTop: "8px" }}>
            <p style={{ fontSize: "clamp(16px,2.2vw,20px)", color: "var(--ink-soft)", lineHeight: 1.85, fontWeight: 300, marginBottom: "28px" }}>
              The brain is not just a subject of study. It is the landscape through which every human experience passes — every memory, every loss, every possibility.
            </p>
            <p style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "#6A6560", lineHeight: 1.9, fontWeight: 300, marginBottom: "28px" }}>
              Emma Baroud's approach bridges rigorous neuroscience with compassionate, tailored care. Not a clinic built on diagnoses alone — but on empowerment.
            </p>
            <p style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "#6A6560", lineHeight: 1.9, fontWeight: 300 }}>
              A sanctuary where academic mastery meets deep human understanding, and every patient walks away knowing themselves more fully than before.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          EXPERTISE CARDS
      ════════════════════════════════ */}
      <section id="expertise" style={{
        background: "#EDEAE3",
        padding: "clamp(80px,10vw,140px) clamp(24px,6vw,80px)",
        position: "relative", overflow: "hidden",
      }}>
        {/* faint orb */}
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,154,94,0.1) 0%, transparent 65%)",
          filter: "blur(80px)", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <div className="reveal" style={{ marginBottom: "clamp(48px,7vw,80px)" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.4em", color: "var(--ink-muted)", textTransform: "uppercase", marginBottom: "14px" }}>
              Services in Development
            </p>
            <h2 style={{
              fontFamily: "var(--serif)",
              fontSize: "clamp(32px,5vw,62px)",
              fontWeight: 400, color: "var(--ink)",
            }}>
              Areas of Specialized Care
            </h2>
          </div>

          {/* Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))",
            gap: "20px",
          }}>
            {CARDS.map((card, i) => (
              <div key={i} className={`reveal reveal-d${i} e-card`}>
                {/* Number */}
                <div style={{
                  fontFamily: "var(--serif)", fontSize: "clamp(38px,4.5vw,52px)",
                  fontWeight: 300, color: "rgba(184,154,94,0.45)",
                  marginBottom: "20px", lineHeight: 1,
                }}>
                  {card.n}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(17px,2vw,21px)",
                  fontWeight: 500, color: "var(--ink)",
                  lineHeight: 1.3, marginBottom: "14px",
                }}>
                  {card.title}
                </h3>

                {/* Body */}
                <p style={{ fontSize: "14px", color: "#6A6560", lineHeight: 1.8, fontWeight: 300 }}>
                  {card.body}
                </p>

                {/* CTA tag */}
                <div style={{
                  marginTop: "30px", display: "flex", alignItems: "center", gap: "10px",
                  fontSize: "10px", letterSpacing: "0.28em",
                  color: "var(--gold)", textTransform: "uppercase",
                }}>
                  <div style={{ width: "22px", height: "1px", background: "var(--gold)" }} />
                  Inquire
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          BECOMING TIMELINE — core "future identity"
      ════════════════════════════════ */}
      <section id="vision" style={{
        background: "var(--bg)",
        padding: "clamp(90px,13vw,160px) clamp(24px,6vw,80px)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Ghost name behind section */}
        <div className="watermark" style={{
          bottom: "-6%", left: "-2%",
          fontSize: "clamp(70px,18vw,240px)",
          color: "rgba(12,12,10,0.03)",
        }}>
          Emma
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Header */}
          <div className="reveal" style={{ marginBottom: "clamp(56px,9vw,100px)" }}>
            <p style={{
              fontSize: "11px", letterSpacing: "0.45em", color: "var(--ink-muted)",
              textTransform: "uppercase", marginBottom: "18px",
            }}>
              The arc of becoming
            </p>
            <h2 style={{
              fontFamily: "var(--serif)", fontWeight: 300,
              fontSize: "clamp(34px,5.5vw,68px)",
              lineHeight: 1.1, color: "var(--ink)",
            }}>
              You are not building a clinic.
              <br />
              <em style={{ color: "var(--ink-muted)" }}>You are becoming her.</em>
            </h2>
          </div>

          {/* Timeline entries */}
          {TIMELINE.map((item, i) => (
            <div
              key={i}
              className={`reveal reveal-d${i}`}
              style={{
                display: "grid",
                gridTemplateColumns: "70px 1px 1fr",
                gap: "0 clamp(20px,3vw,36px)",
                marginBottom: i < TIMELINE.length - 1 ? "clamp(36px,5vw,60px)" : 0,
                alignItems: "start",
              }}
            >
              {/* Year marker */}
              <div style={{ textAlign: "right", paddingTop: "5px" }}>
                <span style={{
                  fontFamily: "var(--serif)", fontSize: "13px",
                  color: "var(--gold)", letterSpacing: "0.18em", textTransform: "uppercase",
                }}>
                  {item.marker}
                </span>
              </div>

              {/* Dot + line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "var(--gold)", flexShrink: 0, marginTop: "5px",
                  boxShadow: "0 0 12px rgba(184,154,94,0.5)",
                }} />
                {i < TIMELINE.length - 1 && <div className="tl-line" />}
              </div>

              {/* Text */}
              <div style={{ paddingBottom: "8px" }}>
                <div style={{
                  fontFamily: "var(--serif)",
                  fontSize: "clamp(18px,2.5vw,26px)",
                  fontWeight: 500, color: "var(--ink)", marginBottom: "10px",
                }}>
                  {item.label}
                </div>
                <p style={{
                  fontSize: "clamp(13px,1.5vw,15px)", color: "#6A6560",
                  lineHeight: 1.85, fontWeight: 300, maxWidth: "560px",
                }}>
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          CTA FOOTER
      ════════════════════════════════ */}
      <footer id="connect" style={{
        background: "var(--bg-dark)", color: "#F7F4EF",
        padding: "clamp(90px,13vw,160px) clamp(24px,6vw,80px)",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* Gold center bloom */}
        <div style={{
          position: "absolute", top: "35%", left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          width: "clamp(280px,55vw,680px)", height: "380px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(184,154,94,0.13) 0%, transparent 70%)",
          filter: "blur(80px)", pointerEvents: "none",
          animation: "breathe 5s ease-in-out infinite",
        }} />
        <div className="watermark" style={{
          top: "10%", right: "-2%",
          color: "rgba(247,244,239,0.035)",
          fontSize: "clamp(48px,10vw,130px)",
        }}>
          Neuropsychology
        </div>

        <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <p className="reveal" style={{
            fontSize: "11px", letterSpacing: "0.45em", color: "var(--gold)",
            textTransform: "uppercase", marginBottom: "38px",
          }}>
            Join the journey
          </p>

          <h2 className="reveal reveal-d1" style={{
            fontFamily: "var(--serif)", fontWeight: 300,
            fontSize: "clamp(38px,7.5vw,86px)",
            lineHeight: 1.08, marginBottom: "28px",
          }}>
            Begin your journey<br />to cognitive{" "}
            <em style={{ color: "var(--gold)", fontStyle: "italic" }}>clarity.</em>
          </h2>

          <p className="reveal reveal-d2" style={{
            fontSize: "clamp(14px,1.8vw,18px)", color: "#7A7570",
            lineHeight: 1.85, fontWeight: 300, marginBottom: "56px",
          }}>
            Emma Baroud Neuropsychology is currently in development. Register your
            interest to receive priority notification when inquiries open.
          </p>

          {/* Email form */}
          <div className="reveal reveal-d3" style={{
            display: "flex", flexDirection: "column", alignItems: "stretch",
            gap: "16px", maxWidth: "460px", margin: "0 auto",
          }}>
            <input
              type="email"
              placeholder="Your email address"
              className="email-input"
            />
            <button className="submit-btn">Stay Informed</button>
          </div>
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: "100px", fontSize: "11px", color: "#2A2A28",
          letterSpacing: "0.12em", position: "relative", zIndex: 2,
        }}>
          © {new Date().getFullYear()} Emma Baroud Neuropsychology · Canada · Reserved for Excellence
        </div>
      </footer>

    </div>
  );
}