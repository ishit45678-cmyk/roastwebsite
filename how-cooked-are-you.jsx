import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;700;800;900&display=swap');

  :root {
    --void: #050508;
    --glass: rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.08);
    --neon-cyan: #00f5ff;
    --neon-fire: #ff6a00;
    --neon-purple: #8b5cf6;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: var(--void); }

  .bg-void { background: var(--void); }

  .title-text { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; }
  
  .font-mono { font-family: 'JetBrains Mono', monospace; }

  .neon-text-cyan {
    color: var(--neon-cyan);
    text-shadow: 0 0 20px rgba(0,245,255,0.6), 0 0 60px rgba(0,245,255,0.3);
  }
  .neon-text-fire {
    color: var(--neon-fire);
    text-shadow: 0 0 20px rgba(255,106,0,0.6), 0 0 60px rgba(255,106,0,0.3);
  }
  .text-neon-cyan { color: var(--neon-cyan); }

  .glass-card {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    backdrop-filter: blur(12px);
  }

  .cta-btn {
    background: linear-gradient(135deg, #ff6a00, #ee0979, #8b5cf6);
    background-size: 200% 200%;
    animation: gradientShift 3s ease infinite;
    color: white;
    border: none;
    cursor: pointer;
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.05em;
    transition: transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 0 30px rgba(255,106,0,0.4);
  }
  .cta-btn:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 0 50px rgba(255,106,0,0.6);
  }
  .cta-btn:active { transform: scale(0.98); }

  .slider {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    background: rgba(255,255,255,0.1);
    outline: none;
    cursor: pointer;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0,245,255,0.6);
    transition: box-shadow 0.2s;
  }
  .slider::-webkit-slider-thumb:hover {
    box-shadow: 0 0 20px rgba(0,245,255,0.9);
  }

  .siren-flash {
    animation: sirenFlash 0.3s ease-in-out 10;
  }

  @keyframes sirenFlash {
    0%, 100% { background-color: var(--void); }
    50% { background-color: rgba(255,0,0,0.08); }
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes memePop {
    0% { transform: scale(0) rotate(-20deg); opacity: 0; }
    40% { transform: scale(1.3) rotate(10deg); opacity: 1; }
    70% { transform: scale(1) rotate(-5deg); opacity: 1; }
    100% { transform: scale(0.8) rotate(0); opacity: 0; }
  }
  .animate-meme-pop {
    animation: memePop 1.8s ease-in-out forwards;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .animate-bounce { animation: bounce 1s infinite; }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin { animation: spin 1.2s linear infinite; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .animate-pulse { animation: pulse 2s cubic-bezier(.4,0,.6,1) infinite; }

  /* Tailwind-like utilities used in the component */
  .fixed { position: fixed; }
  .absolute { position: absolute; }
  .relative { position: relative; }
  .inset-0 { top:0;right:0;bottom:0;left:0; }
  .inset-4 { top:1rem;right:1rem;bottom:1rem;left:1rem; }
  .z-0 { z-index:0; }
  .z-10 { z-index:10; }
  .z-50 { z-index:50; }
  .flex { display:flex; }
  .grid { display:grid; }
  .inline-block { display:inline-block; }
  .hidden { display:none; }
  .items-center { align-items:center; }
  .items-start { align-items:flex-start; }
  .justify-center { justify-content:center; }
  .justify-between { justify-content:space-between; }
  .flex-col { flex-direction:column; }
  .flex-wrap { flex-wrap:wrap; }
  .gap-2 { gap:0.5rem; }
  .gap-3 { gap:0.75rem; }
  .gap-4 { gap:1rem; }
  .gap-5 { gap:1.25rem; }
  .gap-6 { gap:1.5rem; }
  .space-y-1 > * + * { margin-top:0.25rem; }
  .space-y-2 > * + * { margin-top:0.5rem; }
  .space-y-3 > * + * { margin-top:0.75rem; }
  .space-y-4 > * + * { margin-top:1rem; }
  .space-y-8 > * + * { margin-top:2rem; }
  .min-h-screen { min-height:100vh; }
  .w-full { width:100%; }
  .w-2 { width:0.5rem; }
  .h-2 { height:0.5rem; }
  .w-32 { width:8rem; }
  .h-32 { height:8rem; }
  .h-px { height:1px; }
  .h-full { height:100%; }
  .max-w-lg { max-width:32rem; }
  .max-w-md { max-width:28rem; }
  .max-w-2xl { max-width:42rem; }
  .max-w-3xl { max-width:48rem; }
  .mx-auto { margin-left:auto; margin-right:auto; }
  .mb-1 { margin-bottom:0.25rem; }
  .mb-2 { margin-bottom:0.5rem; }
  .mb-3 { margin-bottom:0.75rem; }
  .mb-4 { margin-bottom:1rem; }
  .mb-5 { margin-bottom:1.25rem; }
  .mb-6 { margin-bottom:1.5rem; }
  .mb-8 { margin-bottom:2rem; }
  .mb-10 { margin-bottom:2.5rem; }
  .mb-12 { margin-bottom:3rem; }
  .mb-20 { margin-bottom:5rem; }
  .mt-0\.5 { margin-top:0.125rem; }
  .mt-1 { margin-top:0.25rem; }
  .mt-3 { margin-top:0.75rem; }
  .mt-4 { margin-top:1rem; }
  .mt-8 { margin-top:2rem; }
  .px-3 { padding-left:0.75rem; padding-right:0.75rem; }
  .px-4 { padding-left:1rem; padding-right:1rem; }
  .px-5 { padding-left:1.25rem; padding-right:1.25rem; }
  .px-12 { padding-left:3rem; padding-right:3rem; }
  .py-1 { padding-top:0.25rem; padding-bottom:0.25rem; }
  .py-1\.5 { padding-top:0.375rem; padding-bottom:0.375rem; }
  .py-2 { padding-top:0.5rem; padding-bottom:0.5rem; }
  .py-2\.5 { padding-top:0.625rem; padding-bottom:0.625rem; }
  .py-3 { padding-top:0.75rem; padding-bottom:0.75rem; }
  .py-5 { padding-top:1.25rem; padding-bottom:1.25rem; }
  .py-12 { padding-top:3rem; padding-bottom:3rem; }
  .py-16 { padding-top:4rem; padding-bottom:4rem; }
  .p-4 { padding:1rem; }
  .p-5 { padding:1.25rem; }
  .p-6 { padding:1.5rem; }
  .text-center { text-align:center; }
  .text-left { text-align:left; }
  .text-xs { font-size:0.75rem; }
  .text-sm { font-size:0.875rem; }
  .text-base { font-size:1rem; }
  .text-lg { font-size:1.125rem; }
  .text-xl { font-size:1.25rem; }
  .text-2xl { font-size:1.5rem; }
  .text-3xl { font-size:1.875rem; }
  .text-4xl { font-size:2.25rem; }
  .text-5xl { font-size:3rem; }
  .text-6xl { font-size:3.75rem; }
  .text-7xl { font-size:4.5rem; }
  .text-9xl { font-size:8rem; }
  .font-medium { font-weight:500; }
  .font-semibold { font-weight:600; }
  .font-bold { font-weight:700; }
  .font-black { font-weight:900; }
  .uppercase { text-transform:uppercase; }
  .italic { font-style:italic; }
  .leading-none { line-height:1; }
  .leading-snug { line-height:1.375; }
  .leading-relaxed { line-height:1.625; }
  .tracking-wider { letter-spacing:0.05em; }
  .text-white { color:white; }
  .text-gray-300 { color:#d1d5db; }
  .text-gray-400 { color:#9ca3af; }
  .text-gray-500 { color:#6b7280; }
  .text-gray-600 { color:#4b5563; }
  .text-orange-400 { color:#fb923c; }
  .text-orange-300 { color:#fdba74; }
  .text-cyan-300 { color:#67e8f9; }
  .text-purple-300 { color:#d8b4fe; }
  .text-red-400 { color:#f87171; }
  .text-green-400 { color:#4ade80; }
  .text-yellow-300 { color:#fde047; }
  .bg-white\/5 { background:rgba(255,255,255,0.05); }
  .bg-white\/10 { background:rgba(255,255,255,0.1); }
  .bg-cyan-500\/20 { background:rgba(6,182,212,0.2); }
  .bg-cyan-500\/30 { background:rgba(6,182,212,0.3); }
  .bg-orange-500\/20 { background:rgba(249,115,22,0.2); }
  .bg-orange-500\/30 { background:rgba(249,115,22,0.3); }
  .bg-purple-500\/20 { background:rgba(139,92,246,0.2); }
  .bg-purple-500\/30 { background:rgba(139,92,246,0.3); }
  .bg-red-500\/20 { background:rgba(239,68,68,0.2); }
  .bg-green-500\/20 { background:rgba(16,185,129,0.2); }  
  .border { border-width:1px; border-style:solid; }
  .border-white\/10 { border-color:rgba(255,255,255,0.1); }
  .border-white\/5 { border-color:rgba(255,255,255,0.05); }
  .border-orange-500\/20 { border-color:rgba(249,115,22,0.2); }
  .border-orange-500\/40 { border-color:rgba(249,115,22,0.4); }
  .border-cyan-500\/20 { border-color:rgba(6,182,212,0.2); }
  .border-cyan-500\/40 { border-color:rgba(6,182,212,0.4); }
  .border-cyan-500\/50 { border-color:rgba(6,182,212,0.5); }
  .border-purple-500\/20 { border-color:rgba(139,92,246,0.2); }
  .border-purple-500\/40 { border-color:rgba(139,92,246,0.4); }
  .border-red-500\/10 { border-color:rgba(239,68,68,0.1); }
  .border-red-500\/40 { border-color:rgba(239,68,68,0.4); }
  .border-green-500\/20 { border-color:rgba(16,185,129,0.2); }
  .border-yellow-500\/20 { border-color:rgba(234,179,8,0.2); }
  .border-4 { border-width:4px; border-style:solid; }
  .rounded-full { border-radius:9999px; }
  .rounded-xl { border-radius:0.75rem; }
  .rounded-2xl { border-radius:1rem; }
  .rounded-3xl { border-radius:1.5rem; }
  .overflow-hidden { overflow:hidden; }
  .overflow-x-hidden { overflow-x:hidden; }
  .overflow-auto { overflow:auto; }
  .pointer-events-none { pointer-events:none; }
  .cursor-pointer { cursor:pointer; }
  .resize-none { resize:none; }
  .outline-none { outline:none; }
  .transition-colors { transition:color 0.15s, background-color 0.15s, border-color 0.15s; }
  .blur-2xl { filter:blur(40px); }
  .backdrop-filter { backdrop-filter:blur(12px); }
  .rotate-\\[-90deg\\] { transform:rotate(-90deg); }
  .grid-cols-1 { grid-template-columns:repeat(1,minmax(0,1fr)); }
  .focus\\:outline-none:focus { outline:none; }
  .focus\\:border-cyan-500\\/50:focus { border-color:rgba(6,182,212,0.5); }
  .hover\\:text-white:hover { color:white; }
  .hover\\:bg-cyan-500\\/30:hover { background:rgba(6,182,212,0.3); }
  .hover\\:bg-orange-500\\/30:hover { background:rgba(249,115,22,0.3); }
  .hover\\:bg-purple-500\\/30:hover { background:rgba(139,92,246,0.3); }
  
  @media (min-width: 640px) {
    .sm\\:text-7xl { font-size:4.5rem; }
    .sm\\:text-6xl { font-size:3.75rem; }
    .sm\\:text-9xl { font-size:8rem; }
    .sm\\:grid-cols-2 { grid-template-columns:repeat(2,minmax(0,1fr)); }
  }
  @media (min-width: 768px) {
    .md\\:text-8xl { font-size:6rem; }
  }
`;

function StyleInjector() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
}

// ─── Utility ────────────────────────────────────────────────────────────────
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (arr) => arr[Math.floor(Math.random() * arr.length)];

const BADGES = [
  "🧟 Assignment Necromancer",
  "☕ Caffeine Bloodstream",
  "⏰ Professional Procrastinator",
  "🌙 Nocturnal Disaster",
  "📉 GPA Speedrunner",
  "🎲 Attendance Gambler",
  "🧠 Selective Amnesia Enjoyer",
  "💀 Deadline Whisperer",
  "🔮 Hopium Addict",
  "🛌 Sleep Schedule? Never Heard of Her",
];

const MEME_REACTIONS = ["💀", "😭", "🔥", "☠️", "💔", "😤", "🤡", "👀", "😰", "🫠"];

const VILLAIN_TYPES = [
  "The Ghost Student — shows up only for exams and vibes",
  "The Chaos Gremlin — somehow submits at 11:59:59 PM every time",
  "The Hopium Dealer — believes one all-nighter fixes everything",
  "The Reluctant Scholar — here by family pressure, leaving by choice",
  "The Speedrunner — attempting 100% of the semester in the last week",
  "The Phantom Attendee — exists on the register, never in the classroom",
];

// ─── Particles Background ────────────────────────────────────────────────────
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = 60;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      hue: Math.random() * 60 + 160,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,70%,0.6)`;
        ctx.fill();
      });
      // connections
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `hsla(180,100%,70%,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircleProgress({ value, label, color, size = 120, emoji }) {
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 1200, 1);
      setAnim(Math.round(value * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ - (circ * anim) / 100}
            style={{ transition: "stroke-dashoffset 0.05s linear", filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{emoji}</span>
          <span className="text-white font-bold text-lg leading-none">{anim}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 text-center font-mono uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ─── Slider Input ─────────────────────────────────────────────────────────────
function SliderInput({ label, emoji, min, max, value, onChange, markers, step = 1 }) {
  const pct = ((value - min) / (max - min)) * 100;
  const marker = markers ? markers.find((m) => value <= m.at) || markers[markers.length - 1] : null;

  return (
    <div className="glass-card p-4 rounded-2xl space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <span>{emoji}</span>{label}
        </label>
        <span className="text-neon-cyan font-mono font-bold text-sm">{value}{label.includes("%") ? "%" : label.includes("hrs") ? "h" : ""}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider w-full"
      />
      {marker && (
        <div className="text-xs px-3 py-1.5 rounded-full inline-block font-medium" style={{ background: marker.bg, color: marker.color }}>
          {marker.label}
        </div>
      )}
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2000, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{d.label}</span><span className="font-mono">{d.value}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color,
                boxShadow: `0 0 8px ${d.color}`,
                transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${i * 0.15}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing"); // landing | input | loading | results
  const [form, setForm] = useState({
    sleep: 6, attendance: 65, gpa: 6.5, assignments: 60,
    allnighters: 2, screentime: 7, mistake: "",
  });
  const [results, setResults] = useState(null);
  const [memePopup, setMemePopup] = useState(null);
  const [sirenActive, setSirenActive] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [badge] = useState(() => rnd(BADGES));
  const [villain] = useState(() => rnd(VILLAIN_TYPES));

  const loadingMessages = [
    "🔬 Scanning your academic aura...",
    "📊 Cross-referencing with 12k+ destroyed students...",
    "🧠 Consulting the AI oracle of doom...",
    "☕ Calculating caffeine dependency ratio...",
    "💀 Preparing your roast...",
    "📉 Computing survival probability...",
  ];

  useEffect(() => {
    if (page !== "loading") return;
    const iv = setInterval(() => setLoadingMsg((m) => (m + 1) % loadingMessages.length), 1000);
    return () => clearInterval(iv);
  }, [page]);

  // Pop random meme reactions
  useEffect(() => {
    if (page !== "input") return;
    const iv = setInterval(() => {
      setMemePopup({ emoji: rnd(MEME_REACTIONS), id: Date.now() });
      setTimeout(() => setMemePopup(null), 1800);
    }, 7000);
    return () => clearInterval(iv);
  }, [page]);

  const computeResults = useCallback(() => {
    const { sleep, attendance, gpa, assignments, allnighters, screentime } = form;
    const sleepScore = clamp(((sleep - 2) / 6) * 100, 0, 100);
    const attendScore = attendance;
    const gpaScore = clamp((gpa / 10) * 100, 0, 100);
    const assignScore = assignments;
    const nightScore = clamp(100 - allnighters * 25, 0, 100);
    const screenScore = clamp(100 - ((screentime - 2) / 10) * 100, 0, 100);
    const overall = (sleepScore + attendScore + gpaScore + assignScore + nightScore + screenScore) / 6;
    const cookedPct = Math.round(clamp(100 - overall, 5, 99));
    const survivalPct = Math.round(clamp(overall * 0.85 + Math.random() * 10, 5, 95));
    const stabilityPct = Math.round(clamp(sleepScore * 0.6 + nightScore * 0.4, 5, 95));
    const auraPct = Math.round(clamp((gpaScore + assignScore) / 2, 5, 95));
    return { cookedPct, survivalPct, stabilityPct, auraPct, overall: Math.round(overall) };
  }, [form]);

  const handleAnalyze = async () => {
    setPage("loading");
    const localResults = computeResults();

    try {
      // Call our secure backend API endpoint
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          localResults
        }),
      });

      const response = await res.json();
      
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      // Fallback response if API fails
      setResults({
        ...localResults,
        roast: "Your academic situation is so bad, even the AI refused to look at it. That says everything.",
        comeback: "You made it this far — which is technically an achievement nobody expected.",
        diagnosis: "Critical Academic Entropy with Hopium Overload",
        outcome: "Semester outcome: TBD, but the vibes are not immaculate.",
        recoveryPlan: ["Sleep before 2 AM at least once this week", "Open at least one assignment before the deadline", "Attend class — any class", "Hydrate. Seriously."],
      });
    }

    if (localResults.cookedPct > 70) setSirenActive(true);
    setTimeout(() => setSirenActive(false), 3000);
    setPage("results");
  };

  // ── LANDING ──────────────────────────────────────────────────────────────
  if (page === "landing") return (
    <div className="min-h-screen bg-void text-white overflow-hidden relative">
      <StyleInjector />
      <Particles />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
        {/* Badge bar */}
        <div className="mb-8 flex gap-2 flex-wrap justify-center">
          {["#CollegeLife", "#AcademicChaos", "#Cooked"].map((t) => (
            <span key={t} className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neon-cyan">{t}</span>
          ))}
        </div>

        {/* Title */}
        <div className="relative mb-4">
          <h1 className="title-text text-5xl sm:text-7xl md:text-8xl font-black uppercase leading-none">
            <span className="neon-text-fire">HOW</span>{" "}
            <span className="neon-text-cyan">COOKED</span>
          </h1>
          <h1 className="title-text text-5xl sm:text-7xl md:text-8xl font-black uppercase leading-none">
            <span className="neon-text-fire">ARE YOU?</span>
          </h1>
          <div className="absolute -inset-4 rounded-3xl bg-cyan-500/5 blur-2xl pointer-events-none" />
        </div>

        <p className="text-lg sm:text-xl text-gray-400 font-mono mb-2 max-w-lg">
          An AI-powered academic survival detector.
        </p>
        <p className="text-sm text-gray-600 font-mono mb-12 max-w-md">
          No cap. No sugarcoating. Just pure, brutal honesty from an AI that doesn't care about your feelings.
        </p>

        {/* CTA */}
        <button
          onClick={() => setPage("input")}
          className="cta-btn text-xl font-black uppercase px-12 py-5 rounded-2xl mb-6"
        >
          ⚡ Analyze Me
        </button>
        <p className="text-xs text-gray-600">Warning: Results may cause existential crisis. Proceed anyway.</p>
      </div>
    </div>
  );

  // ── INPUT ─────────────────────────────────────────────────────────────────
  if (page === "input") return (
    <div className="min-h-screen bg-void text-white relative overflow-hidden">
      <StyleInjector />
      <Particles />
      {memePopup && (
        <div key={memePopup.id} className="fixed top-20 right-8 z-50 text-6xl animate-meme-pop pointer-events-none">
          {memePopup.emoji}
        </div>
      )}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <button onClick={() => setPage("landing")} className="text-gray-500 text-sm mb-8 hover:text-white transition-colors flex items-center gap-2">
          ← Back to reality (briefly)
        </button>

        <h2 className="title-text text-4xl font-black text-center mb-2">
          <span className="neon-text-cyan">ENTER</span> <span className="neon-text-fire">YOUR STATS</span>
        </h2>
        <p className="text-center text-gray-500 text-sm font-mono mb-10">Be honest. The AI knows when you're lying.</p>

        <div className="space-y-4">
          <SliderInput label="Sleep (hrs/night)" emoji="😴" min={0} max={10} value={form.sleep} onChange={(v) => setForm({ ...form, sleep: v })}
            markers={[
              { at: 3, label: "💀 Hallucination Starter Pack", bg: "#ff003320", color: "#ff6666" },
              { at: 5, label: "⚠️ Danger Zone", bg: "#ff880020", color: "#ffaa44" },
              { at: 7, label: "😐 Barely Functional", bg: "#ffff0020", color: "#ffff44" },
              { at: 10, label: "✅ Responsible Human", bg: "#00ff8820", color: "#44ffaa" },
            ]}
          />
          <SliderInput label="Attendance (%)" emoji="🏫" min={0} max={100} value={form.attendance} onChange={(v) => setForm({ ...form, attendance: v })}
            markers={[
              { at: 30, label: "👻 Ghost Mode", bg: "#ff003320", color: "#ff6666" },
              { at: 60, label: "😬 Risky Business", bg: "#ff880020", color: "#ffaa44" },
              { at: 80, label: "👍 Acceptable", bg: "#00ff8820", color: "#44ffaa" },
              { at: 100, label: "🏆 Teacher's Fave (suspicious)", bg: "#8800ff20", color: "#bb88ff" },
            ]}
          />
          <SliderInput label="GPA / CGPA (out of 10)" emoji="📚" min={0} max={10} step={0.5} value={form.gpa} onChange={(v) => setForm({ ...form, gpa: v })}
            markers={[
              { at: 3, label: "📉 Historical Lows", bg: "#ff003320", color: "#ff6666" },
              { at: 6, label: "😰 It's Giving Stress", bg: "#ff880020", color: "#ffaa44" },
              { at: 8, label: "🔥 Certified Nerd", bg: "#00ff8820", color: "#44ffaa" },
              { at: 10, label: "🤖 Are You Even Human?", bg: "#8800ff20", color: "#bb88ff" },
            ]}
          />
          <SliderInput label="Assignment Completion (%)" emoji="📝" min={0} max={100} value={form.assignments} onChange={(v) => setForm({ ...form, assignments: v })}
            markers={[
              { at: 20, label: "🗑️ What Assignments?", bg: "#ff003320", color: "#ff6666" },
              { at: 50, label: "🎲 Vibes-Based Submission", bg: "#ff880020", color: "#ffaa44" },
              { at: 80, label: "💪 Actually Trying", bg: "#00ff8820", color: "#44ffaa" },
              { at: 100, label: "📖 Legend Status", bg: "#8800ff20", color: "#bb88ff" },
            ]}
          />
          <SliderInput label="All-nighters per week" emoji="🌙" min={0} max={7} value={form.allnighters} onChange={(v) => setForm({ ...form, allnighters: v })}
            markers={[
              { at: 0, label: "😇 Normal Sleep Schedule", bg: "#00ff8820", color: "#44ffaa" },
              { at: 2, label: "☕ Caffeine Dependency", bg: "#ff880020", color: "#ffaa44" },
              { at: 5, label: "🧟 Undead Mode", bg: "#ff003320", color: "#ff6666" },
              { at: 7, label: "💀 Please Seek Help", bg: "#ff000040", color: "#ff4444" },
            ]}
          />
          <SliderInput label="Daily Screen Time (hrs)" emoji="📱" min={1} max={16} value={form.screentime} onChange={(v) => setForm({ ...form, screentime: v })}
            markers={[
              { at: 4, label: "📵 Touch Grass Enjoyer", bg: "#00ff8820", color: "#44ffaa" },
              { at: 8, label: "📱 Moderately Cooked", bg: "#ff880020", color: "#ffaa44" },
              { at: 12, label: "🤳 Device Symbiote", bg: "#ff003320", color: "#ff6666" },
              { at: 16, label: "👁️ You ARE the Algorithm", bg: "#ff000040", color: "#ff4444" },
            ]}
          />

          {/* Text area */}
          <div className="glass-card p-4 rounded-2xl space-y-2">
            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <span>🤦</span> Biggest Academic Mistake (optional, but spicy)
            </label>
            <textarea
              value={form.mistake}
              onChange={(e) => setForm({ ...form, mistake: e.target.value })}
              placeholder="e.g. 'Skipped the entire month of March thinking I'd catch up in April'"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          className="cta-btn w-full text-xl font-black uppercase py-5 rounded-2xl mt-8"
        >
          🔥 ANALYZE MY ACADEMIC FATE
        </button>
        <p className="text-center text-xs text-gray-600 mt-3">No personal data stored. Your shame is between you and the AI.</p>
      </div>
    </div>
  );

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (page === "loading") return (
    <div className="min-h-screen bg-void text-white flex items-center justify-center relative overflow-hidden">
      <StyleInjector />
      <Particles />
      <div className="relative z-10 text-center space-y-8 px-4">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-spin" style={{ borderTopColor: "#00ffff" }} />
          <div className="absolute inset-4 rounded-full border-4 border-orange-500/30 animate-spin" style={{ borderBottomColor: "#ff6600", animationDirection: "reverse", animationDuration: "0.8s" }} />
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🧠</div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-white mb-3 font-mono">{loadingMessages[loadingMsg]}</h2>
          <p className="text-gray-500 text-sm">This might take a moment. Or the AI is crying. Hard to tell.</p>
        </div>
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (page === "results" && results) {
    const isCooked = results.cookedPct > 60;
    const chartData = [
      { label: "Sleep Quality", value: clamp(form.sleep * 12.5, 0, 100), color: "#00ffff" },
      { label: "Attendance", value: form.attendance, color: "#8b5cf6" },
      { label: "Assignment Rate", value: form.assignments, color: "#f59e0b" },
      { label: "Mental Stability", value: results.stabilityPct, color: "#ec4899" },
      { label: "Academic Aura", value: results.auraPct, color: "#10b981" },
      { label: "Survival Chance", value: results.survivalPct, color: "#3b82f6" },
    ];

    return (
      <div className={`min-h-screen bg-void text-white relative overflow-hidden ${sirenActive ? "siren-flash" : ""}`}>
        <StyleInjector />
        <Particles />
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">{results.cookedPct > 80 ? "💀" : results.cookedPct > 60 ? "🔥" : results.cookedPct > 40 ? "😬" : "😌"}</div>
            <h2 className="title-text text-5xl sm:text-6xl font-black mb-2">
              <span className="neon-text-fire">YOU ARE</span>
            </h2>
            <div className="text-7xl sm:text-9xl font-black font-mono neon-text-fire">{results.cookedPct}%</div>
            <div className="text-2xl font-bold text-gray-300 font-mono mt-1">COOKED</div>
            {isCooked && (
              <div className="mt-4 inline-block px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-mono animate-pulse">
                🚨 CRITICAL ACADEMIC EMERGENCY DETECTED
              </div>
            )}
          </div>

          {/* Circle metrics */}
          <div className="glass-card p-6 rounded-3xl mb-6">
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-6 text-center">Academic Vital Signs</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <CircleProgress value={results.cookedPct} label="Cooked %" color="#ff6600" emoji="🔥" />
              <CircleProgress value={results.survivalPct} label="Survival" color="#00ffff" emoji="🛡️" />
              <CircleProgress value={results.stabilityPct} label="Mental Stability" color="#8b5cf6" emoji="🧠" />
              <CircleProgress value={results.auraPct} label="Academic Aura" color="#10b981" emoji="✨" />
            </div>
          </div>

          {/* AI Roast */}
          <div className="glass-card p-6 rounded-3xl mb-6 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="font-bold text-orange-400 font-mono text-sm uppercase tracking-wider">AI Roast (Served Medium-Rare)</h3>
            </div>
            <p className="text-white text-base leading-relaxed italic mb-4">"{results.roast}"</p>
            <div className="h-px bg-white/10 mb-4" />
            <div className="flex items-start gap-3">
              <span className="text-xl">💪</span>
              <p className="text-cyan-300 text-sm leading-relaxed">"{results.comeback}"</p>
            </div>
          </div>

          {/* Diagnosis + Villain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-5 rounded-2xl border border-purple-500/20">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">🔬 Meme Diagnosis</div>
              <div className="text-white font-bold text-sm leading-snug">{results.diagnosis}</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-cyan-500/20">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">🎭 Academic Villain Type</div>
              <div className="text-white font-bold text-sm leading-snug">{villain}</div>
            </div>
          </div>

          {/* Badge */}
          <div className="glass-card p-5 rounded-2xl mb-6 text-center border border-yellow-500/20">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">🏅 Your Badge</div>
            <div className="text-xl font-black text-yellow-300">{badge}</div>
          </div>

          {/* Outcome */}
          <div className="glass-card p-5 rounded-2xl mb-6 border border-red-500/10">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">📅 Semester Outcome Prediction</div>
            <p className="text-white text-sm leading-relaxed">{results.outcome}</p>
          </div>

          {/* Bar chart */}
          <div className="glass-card p-6 rounded-3xl mb-6">
            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-5">Academic Performance Breakdown</h3>
            <BarChart data={chartData} />
          </div>

          {/* Recovery Plan */}
          <div className="glass-card p-6 rounded-3xl mb-6 border border-green-500/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl">🚑</span>
              <h3 className="font-bold text-green-400 font-mono text-sm uppercase tracking-wider">Emergency Recovery Plan</h3>
            </div>
            <div className="space-y-2">
              {(results.recoveryPlan || []).map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-green-400 font-mono font-bold text-xs mt-0.5">0{i + 1}</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="glass-card p-6 rounded-3xl text-center border border-white/10">
            <p className="text-gray-400 text-sm mb-4">You survived the analysis. Share your pain.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  const text = `I just found out I'm ${results.cookedPct}% cooked academically 💀 My survival probability is ${results.survivalPct}%. No cap the AI said: "${results.roast}" Check yourself at HowCookedAreYou.ai`;
                  navigator.clipboard.writeText(text).catch(() => {});
                  alert("Copied! Go embarrass yourself on the timeline 🔥");
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-bold hover:bg-cyan-500/30 transition-colors"
              >
                📋 Copy Result
              </button>
              <button
                onClick={() => setPage("input")}
                className="px-5 py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 text-sm font-bold hover:bg-orange-500/30 transition-colors"
              >
                🔄 Try Again (Maybe Lie This Time)
              </button>
              <button
                onClick={() => setPage("landing")}
                className="px-5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-sm font-bold hover:bg-purple-500/30 transition-colors"
              >
                🏠 Send to a More Cooked Friend
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
