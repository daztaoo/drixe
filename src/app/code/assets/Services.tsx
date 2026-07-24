"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import {
  TrendingUp,
  Bot,
  Code2,
  GitMerge,
  Layers,
  Server,
  CheckCircle2,
  ArrowRight,
  Activity,
  Zap,
  Headphones,
  Database,
  ChevronRight,
} from "lucide-react";

/* ─── Panel data ──────────────────────────────────────── */
const PANELS = [
  {
    word: "CRM",
    eyebrow: "Salesforce CRM",
    title: "Your sales pipeline,\nfully automated.",
    desc: "Centralize customer data, automate workflows, and track every lead from first touch to closed deal — all inside a single cloud platform.",
    bg: "#f7f8ff",
    textColor: "#0a0a14",
    accent: "#7c5cfc",
    type: "salesforce",
  },
  {
    word: "AGENTS",
    eyebrow: "LLM Development",
    title: "AI agents that\nthink and act.",
    desc: "We train and deploy large language models tailored to your business — from intelligent Q&A to autonomous multi-step agents that get things done.",
    bg: "#f8f7ff",
    textColor: "#0a0a14",
    accent: "#6d28d9",
    type: "llm",
  },
  {
    word: ".NET",
    eyebrow: ".NET Web Applications",
    title: "Enterprise software,\nbuilt to last.",
    desc: "Scalable, secure .NET applications — from cloud-native APIs to complex enterprise platforms with high-performance runtimes and C# precision.",
    bg: "#f7f9ff",
    textColor: "#0a0a14",
    accent: "#4f46e5",
    type: "dotnet",
  },
  {
    word: "DATA",
    eyebrow: "Integration & Migration",
    title: "Your data,\nunified.",
    desc: "Connect disparate systems, migrate to the cloud, and build a single source of truth — with zero data loss and minimal downtime.",
    bg: "#f7f8ff",
    textColor: "#0a0a14",
    accent: "#7c5cfc",
    type: "data",
  },
  {
    word: "REACT",
    eyebrow: "React Web Applications",
    title: "Interfaces that\nmove fast.",
    desc: "Component-driven React apps with real-time data, seamless API integration, and UI that your users actually enjoy using every day.",
    bg: "#f8f7ff",
    textColor: "#0a0a14",
    accent: "#8b5cf6",
    type: "react",
  },
  {
    word: "DEPLOY",
    eyebrow: "Deployment & Support",
    title: "Ship fast.\nStay running.",
    desc: "CI/CD pipelines, cloud infrastructure, monitoring, and 24/7 expert technical support so your systems stay online and your team stays unblocked.",
    bg: "#f7f8ff",
    textColor: "#0a0a14",
    accent: "#7c5cfc",
    type: "support",
  },
];

type PanelData = (typeof PANELS)[number];

/* ─── Widgets (light theme) ──────────────────────────── */
function Widget({ type, accent }: { type: string; accent: string }) {

  if (type === "salesforce") {
    const stages = [
      { label: "Lead", count: 24, pct: 100 },
      { label: "Qualified", count: 18, pct: 75 },
      { label: "Proposal", count: 11, pct: 46 },
      { label: "Closed Won", count: 4, pct: 17 },
    ];
    return (
      <div className="h-full w-full rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/60">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400">Sales Pipeline</p>
            <p className="mt-0.5 text-lg font-bold text-gray-900">Q3 Performance</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ backgroundColor: `${accent}15` }}>
            <TrendingUp size={18} style={{ color: accent }} />
          </div>
        </div>
        {/* Stages */}
        <div className="space-y-4">
          {stages.map((s) => (
            <div key={s.label}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium text-gray-600">{s.label}</span>
                <span className="font-bold text-gray-900">{s.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${s.pct}%`, backgroundColor: accent }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="mt-6 flex items-center gap-2.5 rounded-2xl p-4" style={{ backgroundColor: `${accent}08` }}>
          <CheckCircle2 size={15} style={{ color: accent }} />
          <p className="text-sm font-semibold text-gray-800">342% ROI delivered this quarter</p>
        </div>
      </div>
    );
  }

  if (type === "llm") {
    const msgs = [
      { role: "user", text: "Summarize our Q3 churn data" },
      { role: "ai", text: "Churn dropped 18% vs Q2. Key driver: onboarding flow improvements reduced time-to-value by 3 days." },
      { role: "user", text: "What should I prioritize next?" },
    ];
    return (
      <div className="h-full w-full rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/60">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}15` }}>
              <Bot size={16} style={{ color: accent }} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">CODM Agent</p>
              <p className="text-[11px] text-gray-400">Enterprise AI</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${accent}12`, color: accent }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: accent }} />
            Live
          </span>
        </div>
        <div className="space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-[12.5px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-gray-100 text-gray-700"
                    : "text-gray-900"
                }`}
                style={m.role === "ai" ? { backgroundColor: `${accent}10`, border: `1px solid ${accent}25` } : {}}
              >
                {m.text}
              </div>
            </div>
          ))}
          {/* Typing indicator */}
          <div className="flex items-center gap-1.5 px-1">
            {[0,1,2].map(i => (
              <div key={i} className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: accent, animationDelay: `${i*0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "dotnet") {
    return (
      <div className="h-full w-full rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/60">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}15` }}>
            <Code2 size={16} style={{ color: accent }} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Program.cs</p>
            <p className="text-[11px] text-gray-400">ASP.NET Core 8</p>
          </div>
        </div>
        {/* Code block */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 font-mono text-[12px] leading-relaxed">
          <p><span className="text-purple-600">var</span> <span className="text-gray-800">builder</span> <span className="text-gray-400">=</span></p>
          <p className="pl-4"><span className="text-gray-800">WebApplication</span><span className="text-gray-400">.</span></p>
          <p className="pl-8"><span className="text-indigo-600">CreateBuilder</span><span className="text-gray-400">(args);</span></p>
          <p className="mt-2"><span className="text-gray-800">builder.Services</span></p>
          <p className="pl-4"><span className="text-gray-400">.</span><span className="text-indigo-600">AddCODMAI</span><span className="text-gray-400">()</span></p>
          <p className="pl-4"><span className="text-gray-400">.</span><span className="text-indigo-600">AddSalesforce</span><span className="text-gray-400">();</span></p>
          <p className="mt-2"><span className="text-gray-800">app</span><span className="text-gray-400">.</span><span className="text-green-600">Run</span><span className="text-gray-400">();</span></p>
        </div>
        <div className="mt-4 flex gap-2">
          {["Secure", "Scalable", "Fast"].map(tag => (
            <span key={tag} className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ backgroundColor: `${accent}10`, color: accent }}>{tag}</span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "data") {
    const sources = ["Salesforce", "PostgreSQL", "SAP ERP", "REST APIs"];
    return (
      <div className="h-full w-full rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/60">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}15` }}>
            <GitMerge size={16} style={{ color: accent }} />
          </div>
          <p className="text-sm font-bold text-gray-900">Data Pipeline</p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {sources.map(s => (
            <div key={s} className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
              <Database size={11} className="text-gray-400 flex-shrink-0" />
              <span className="text-[11px] font-medium text-gray-600">{s}</span>
            </div>
          ))}
        </div>
        {/* Arrow */}
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-gray-200" />
            <div className="rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: accent }}>CODM Layer</div>
            <div className="h-px w-12 bg-gray-200" />
          </div>
        </div>
        {/* Output */}
        <div className="mt-3 flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: `${accent}25`, backgroundColor: `${accent}06` }}>
          <div>
            <p className="text-sm font-bold text-gray-900">Single Source of Truth</p>
            <p className="mt-0.5 text-[11px] text-gray-400">99.9% accuracy · Real-time</p>
          </div>
          <Activity size={16} style={{ color: accent }} />
        </div>
      </div>
    );
  }

  if (type === "react") {
    const components = [
      { depth: 0, name: "<App />", accent: true },
      { depth: 1, name: "<Router />" },
      { depth: 2, name: "<Dashboard />" },
      { depth: 3, name: "<Analytics />" },
      { depth: 3, name: "<AIPanel />" },
      { depth: 2, name: "<Salesforce />" },
    ];
    return (
      <div className="h-full w-full rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/60">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}15` }}>
            <Layers size={16} style={{ color: accent }} />
          </div>
          <p className="text-sm font-bold text-gray-900">Component Architecture</p>
        </div>
        <div className="space-y-1 font-mono text-[12px]">
          {components.map((c, i) => (
            <div
              key={i}
              className="flex items-center rounded-lg py-2 transition"
              style={{ paddingLeft: `${c.depth * 14 + 8}px` }}
            >
              {c.depth > 0 && <ChevronRight size={10} className="mr-1 text-gray-300 flex-shrink-0" />}
              <span style={{ color: c.accent ? accent : c.depth === 1 ? "#6366f1" : c.depth === 2 ? "#8b5cf6" : "#a78bfa" }}>
                {c.name}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <Zap size={13} style={{ color: accent }} />
          <p className="text-[11px] font-semibold text-gray-600">Renders in &lt;120ms · Zero layout shift</p>
        </div>
      </div>
    );
  }

  if (type === "support") {
    const svcs = [
      { name: "API Gateway", uptime: "99.98%" },
      { name: "AI Pipeline", uptime: "99.95%" },
      { name: "CRM Sync", uptime: "100%" },
      { name: "Data Layer", uptime: "99.99%" },
    ];
    return (
      <div className="h-full w-full rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/60">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}15` }}>
              <Server size={16} style={{ color: accent }} />
            </div>
            <p className="text-sm font-bold text-gray-900">System Status</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            All operational
          </span>
        </div>
        <div className="space-y-2.5">
          {svcs.map(svc => (
            <div key={svc.name} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <p className="text-[12px] font-semibold text-gray-700">{svc.name}</p>
              </div>
              <span className="text-[11px] font-medium text-gray-400">{svc.uptime}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <Headphones size={13} style={{ color: accent }} />
          <p className="text-[11px] font-semibold text-gray-600">24/7 support · &lt;1hr response SLA</p>
        </div>
      </div>
    );
  }

  return null;
}

/* ─── Desktop Panel ───────────────────────────────────── */
function DesktopPanel({
  panel,
  index,
  smoothProgress,
}: {
  panel: PanelData;
  index: number;
  smoothProgress: MotionValue<number>;
}) {
  const n = PANELS.length;
  const panelCenter = n === 1 ? 0 : index / (n - 1);
  const halfPanel = n === 1 ? 0.5 : 0.5 / (n - 1);

  const inputStart = Math.max(0, panelCenter - halfPanel);
  const inputEnd = Math.min(1, panelCenter + halfPanel);

  const titleInput =
    index === 0 ? [0, inputEnd]
    : index === n - 1 ? [inputStart, 1]
    : [inputStart, panelCenter, inputEnd];

  const titleOutput =
    index === 0 ? ["0vw", "80vw"]
    : index === n - 1 ? ["-80vw", "0vw"]
    : ["-80vw", "0vw", "80vw"];

  const opacityInput =
    index === 0 ? [0, inputEnd * 0.7]
    : index === n - 1 ? [inputStart + halfPanel * 0.25, 1]
    : [Math.max(0, panelCenter - halfPanel * 0.65), panelCenter, Math.min(1, panelCenter + halfPanel * 0.65)];

  const opacityOutput =
    index === 0 ? [1, 0]
    : index === n - 1 ? [0, 1]
    : [0, 1, 0];

  const yInput =
    index === 0 ? [0, inputEnd]
    : index === n - 1 ? [inputStart, 1]
    : [inputStart, panelCenter];

  const yOutput =
    index === 0 ? ["0px", "-18px"]
    : index === n - 1 ? ["24px", "0px"]
    : ["24px", "0px"];

  const titleX = useTransform(smoothProgress, titleInput, titleOutput);
  const contentOpacity = useTransform(smoothProgress, opacityInput, opacityOutput);
  const contentY = useTransform(smoothProgress, yInput, yOutput);

  return (
    <li
      className="relative flex h-screen w-screen shrink-0 overflow-hidden"
      style={{ backgroundColor: panel.bg }}
    >
      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:52px_52px] opacity-50" />

      {/* Accent radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 60% 65% at 85% 50%, ${panel.accent}12, transparent 70%)` }}
      />

      {/* Left accent rule */}
      <div className="absolute left-0 top-0 h-full w-[3px]" style={{ backgroundColor: panel.accent }} />

      {/* Giant watermark word */}
      <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
        <motion.span
          aria-hidden="true"
          style={{ x: titleX, color: panel.accent }}
          className="absolute select-none whitespace-nowrap text-[21vw] font-black uppercase leading-none tracking-[-0.06em] opacity-[0.05]"
        >
          {panel.word}
        </motion.span>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] items-center px-16 xl:px-24">
        <div className="flex w-full items-center gap-16 xl:gap-24">

          {/* Left — text */}
          <motion.div style={{ opacity: contentOpacity, y: contentY }} className="min-w-0 flex-1">
            <p
              className="mb-6 text-[10px] font-semibold uppercase tracking-[0.38em]"
              style={{ color: panel.accent }}
            >
              {panel.eyebrow}
            </p>
            <h2
              className="text-[clamp(42px,4.5vw,80px)] font-black leading-[0.92] tracking-[-0.04em]"
              style={{ color: panel.textColor }}
            >
              {panel.title.split("\n").map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
            <p className="mt-8 max-w-[38ch] text-[clamp(14px,1.15vw,16px)] leading-relaxed text-gray-500">
              {panel.desc}
            </p>
            <a
              href="#contact"
              className="mt-10 inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: panel.accent }}
            >
              Learn more
              <ArrowRight size={14} />
            </a>
          </motion.div>

          {/* Right — widget */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="h-[400px] w-[360px] shrink-0 xl:h-[440px] xl:w-[420px]"
          >
            <Widget type={panel.type} accent={panel.accent} />
          </motion.div>
        </div>
      </div>

      {/* Counter */}
      <motion.p
        style={{ opacity: contentOpacity }}
        className="absolute bottom-10 right-16 text-[11px] font-mono uppercase tracking-[0.35em]"
        style={{ color: `${panel.accent}60` } as React.CSSProperties}
      >
        {String(index + 1).padStart(2, "0")} / {String(PANELS.length).padStart(2, "0")}
      </motion.p>
    </li>
  );
}

/* ─── Mobile Panel ────────────────────────────────────── */
function MobilePanel({ panel, index }: { panel: PanelData; index: number }) {
  return (
    <article
      className="relative min-h-[100svh] overflow-hidden px-5 py-20 sm:px-8"
      style={{ backgroundColor: panel.bg }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
      <div className="absolute left-0 top-0 h-full w-[3px]" style={{ backgroundColor: panel.accent }} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-[600px] flex-col justify-center">
        <div className="mb-7 flex items-center justify-between">
          <p className="text-[9px] font-semibold uppercase tracking-[0.32em]" style={{ color: panel.accent }}>
            {panel.eyebrow}
          </p>
          <p className="rounded-full border border-gray-200 bg-white px-3 py-1 text-[9px] font-mono uppercase tracking-[0.24em] text-gray-400">
            {String(index + 1).padStart(2, "0")} / {String(PANELS.length).padStart(2, "0")}
          </p>
        </div>
        <h2
          className="max-w-[11ch] text-[clamp(40px,12vw,72px)] font-black leading-[0.88] tracking-[-0.05em]"
          style={{ color: panel.textColor }}
        >
          {panel.title.split("\n").map((line, i) => (
            <span key={i} className="block">{line}</span>
          ))}
        </h2>
        <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-gray-500">{panel.desc}</p>
        <div className="mt-10 h-[320px] w-full sm:h-[360px]">
          <Widget type={panel.type} accent={panel.accent} />
        </div>
      </div>
    </article>
  );
}

/* ─── Section ─────────────────────────────────────────── */
export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 380,
    damping: 48,
    restDelta: 0.0005,
  });

  const x = useTransform(
    smoothProgress,
    [0, 1],
    ["0vw", `-${(PANELS.length - 1) * 100}vw`]
  );

  return (
    <section id="services" className="relative">
      {/* Desktop */}
      <div
        ref={sectionRef}
        className="relative hidden lg:block"
        style={{ height: `${PANELS.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.ul style={{ x }} className="flex h-full will-change-transform">
            {PANELS.map((panel, i) => (
              <DesktopPanel key={panel.word} panel={panel} index={i} smoothProgress={smoothProgress} />
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        {PANELS.map((panel, i) => (
          <MobilePanel key={panel.word} panel={panel} index={i} />
        ))}
      </div>
    </section>
  );
}
