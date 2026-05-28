"use client";

import { useState } from "react";

const SABOTEURS = [
  {
    name: "Judge",
    tagline: "I find fault — in myself, others, everything.",
  },
  {
    name: "Controller",
    tagline: "I need things to go my way.",
  },
  {
    name: "Avoider",
    tagline: "I keep the peace by avoiding difficulty.",
  },
  {
    name: "Hyper-Achiever",
    tagline: "My worth = my results.",
  },
  {
    name: "Hyper-Rational",
    tagline: "Emotions cloud good judgment.",
  },
  {
    name: "Hyper-Vigilant",
    tagline: "Something could always go wrong.",
  },
  {
    name: "Pleaser",
    tagline: "I need to be needed.",
  },
  {
    name: "Restless",
    tagline: "I'm always chasing the next thing.",
  },
  {
    name: "Stickler",
    tagline: "It has to be perfect or it's not right.",
  },
  {
    name: "Victim",
    tagline: "Why does this keep happening to me?",
  },
];

const SECTION_KEYS = [
  { key: "**MIRROR**", label: "Mirror", color: "amber" },
  { key: "**SABOTEUR AT PLAY**", label: "Saboteur at Play", color: "red" },
  { key: "**SAGE ACTIVATION**", label: "Sage Activation", color: "emerald" },
  { key: "**YOUR SHIFT**", label: "Your Shift", color: "sky" },
];

type ParsedSection = { label: string; color: string; content: string };

function parseSections(text: string): ParsedSection[] {
  const result: ParsedSection[] = [];
  for (let i = 0; i < SECTION_KEYS.length; i++) {
    const { key, label, color } = SECTION_KEYS[i];
    const start = text.indexOf(key);
    if (start === -1) continue;
    const contentStart = start + key.length;
    const nextKey = SECTION_KEYS[i + 1]?.key;
    const end = nextKey ? text.indexOf(nextKey, contentStart) : text.length;
    const content = text.slice(contentStart, end === -1 ? undefined : end).trim();
    if (content) result.push({ label, color, content });
  }
  return result;
}

const sectionColorMap: Record<string, string> = {
  amber: "text-amber-400 border-amber-500/30 bg-amber-500/5",
  red: "text-red-400 border-red-500/30 bg-red-500/5",
  emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
  sky: "text-sky-400 border-sky-500/30 bg-sky-500/5",
};

export default function Page() {
  const [selected, setSelected] = useState<string[]>([]);
  const [situation, setSituation] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = selected.length >= 1 && situation.trim().length > 20 && !loading;

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  const reset = () => {
    setResponse("");
    setDone(false);
    setError("");
  };

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setDone(false);
    setResponse("");
    setError("");

    try {
      const res = await fetch("/api/sage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saboteurs: selected, situation }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to get a response.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        const chunk = decoder.decode(value, { stream: true });
        setResponse((prev) => prev + chunk);
      }

      setDone(true);
    } catch {
      setError("Something went wrong. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const sections = done ? parseSections(response) : [];
  const showRaw = loading && response;

  return (
    <main className="min-h-screen bg-[#080C14] text-slate-100">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4 max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-semibold tracking-wide text-sm">
            Radiant Liberty
          </span>
          <span className="text-slate-700 text-xs">·</span>
          <span className="text-slate-500 text-sm">Sage Mode</span>
        </div>
        <a
          href="mailto:hello@radiantliberty.com"
          className="text-xs text-slate-600 hover:text-amber-400 transition-colors"
        >
          Work with me →
        </a>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <p className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase mb-4">
            AI-powered self-awareness
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-50 leading-tight mb-5">
            What if the pattern{" "}
            <span className="text-amber-400">holding you back</span>
            <br />
            had a name?
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            In two steps, identify the exact mental pattern running the show —
            and unlock the Sage shift that moves you forward.
          </p>
        </div>

        {!done ? (
          <>
            {/* Step 1 — Saboteur selector */}
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="text-base font-semibold text-slate-200">
                  Which of these patterns resonate with you right now?
                </h2>
              </div>
              <p className="text-slate-500 text-sm mb-5 ml-10">
                Select 1–3 that feel most alive today. Trust your gut.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SABOTEURS.map((s) => {
                  const isSelected = selected.includes(s.name);
                  return (
                    <button
                      key={s.name}
                      onClick={() => toggle(s.name)}
                      className={`text-left px-4 py-3 rounded-xl border transition-all duration-150 ${
                        isSelected
                          ? "border-amber-500/50 bg-amber-500/10 text-slate-100"
                          : "border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-300"
                      }`}
                    >
                      <div className="text-sm font-medium flex items-center gap-2">
                        {isSelected && (
                          <span className="text-amber-400 text-xs">✓</span>
                        )}
                        {s.name}
                      </div>
                      <div className="text-xs mt-0.5 opacity-60">
                        {s.tagline}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2 — Situation */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="text-base font-semibold text-slate-200">
                  What&apos;s going on for you right now?
                </h2>
              </div>
              <p className="text-slate-500 text-sm mb-4 ml-10">
                One real situation. Be specific — 2–3 sentences is enough.
              </p>
              <textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                onFocus={reset}
                placeholder="e.g. I've been avoiding a difficult conversation with my manager for three weeks. I know exactly what I need to say but I keep finding reasons to put it off…"
                rows={4}
                className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 text-sm leading-relaxed resize-none focus:outline-none focus:border-amber-500/30 focus:bg-white/[0.04] transition-colors"
              />
            </section>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={!canSubmit}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                canSubmit
                  ? "bg-amber-500 hover:bg-amber-400 text-stone-900 cursor-pointer shadow-lg shadow-amber-500/20"
                  : "bg-white/5 text-slate-600 cursor-not-allowed"
              }`}
            >
              {loading ? "Seeing the pattern…" : "Reveal My Pattern →"}
            </button>

            {error && (
              <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
            )}

            {/* Streaming preview */}
            {showRaw && (
              <div className="mt-8 border border-white/5 rounded-2xl p-6 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-150" />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-300" />
                  <span className="text-slate-500 text-xs ml-1">
                    Seeing the pattern…
                  </span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {response}
                  <span className="animate-pulse">▋</span>
                </p>
              </div>
            )}
          </>
        ) : (
          /* Response — parsed sections */
          <div>
            <div className="mb-8 text-center">
              <p className="text-emerald-400 text-xs font-semibold tracking-widest uppercase mb-2">
                Your pattern revealed
              </p>
              <h2 className="text-xl font-semibold text-slate-100">
                Here&apos;s what&apos;s actually happening.
              </h2>
            </div>

            <div className="space-y-4 mb-12">
              {sections.length > 0
                ? sections.map((section) => (
                    <div
                      key={section.label}
                      className={`rounded-2xl border px-6 py-5 ${sectionColorMap[section.color]}`}
                    >
                      <p
                        className={`text-xs font-bold uppercase tracking-widest mb-3 ${section.color === "amber" ? "text-amber-400" : section.color === "red" ? "text-red-400" : section.color === "emerald" ? "text-emerald-400" : "text-sky-400"}`}
                      >
                        {section.label}
                      </p>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  ))
                : /* Fallback: render raw text if sections couldn't be parsed */
                  response && (
                    <div className="border border-white/10 rounded-2xl px-6 py-5 bg-white/[0.02]">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {response}
                      </p>
                    </div>
                  )}
            </div>

            {/* CTA */}
            <div className="text-center border-t border-white/5 pt-10">
              <p className="text-slate-500 text-sm mb-1">
                Ready to go deeper?
              </p>
              <h3 className="text-xl font-semibold text-slate-100 mb-5">
                Work 1:1 with a PQ + AI coach.
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="mailto:hello@radiantliberty.com"
                  className="inline-block border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Book a discovery call →
                </a>
                <button
                  onClick={() => {
                    setDone(false);
                    setResponse("");
                    setSelected([]);
                    setSituation("");
                  }}
                  className="inline-block border border-white/10 text-slate-400 hover:bg-white/5 px-6 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Try another situation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-slate-700 text-xs mt-8">
        © {new Date().getFullYear()} Radiant Liberty · Sage Mode powered by AI
      </footer>
    </main>
  );
}
