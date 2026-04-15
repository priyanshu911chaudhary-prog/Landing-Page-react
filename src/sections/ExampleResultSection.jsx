import React from 'react';
import Section from '@/ui/Section';
import { EVIDENCE_SOURCES } from '@/constants/evidence';

function ExampleResultSection() {
  return (
    <Section id="example" className="bg-transparent py-24 sm:py-32 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.05] rounded-full"
        style={{ background: "radial-gradient(ellipse at center, #22d3ee 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/3 w-[420px] h-[420px] opacity-[0.03] rounded-full"
        style={{ background: "radial-gradient(ellipse at center, #818cf8 0%, transparent 72%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 1px, transparent 1px, transparent 18px)",
        }}
      />

      <div data-section-panel className="mx-auto w-full max-w-[1400px] px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 items-start">
          <div className="flex flex-col">
            <div data-reveal className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-4 bg-cyan-500/50" />
                <p className="text-xs font-bold tracking-[0.3em] text-cyan-400/80 uppercase">Intercept Log</p>
                <span className="text-[10px] font-mono text-slate-500 tracking-[0.12em]">· DEMO</span>
                <span className="inline-block w-1.5 h-3.5 bg-cyan-400/70 animate-pulse" aria-hidden="true" />
              </div>
              <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-6">
                See It In<br />
                <span className="section-title-accent">Action.</span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
                A sample claim and sample output showing how verdict, confidence, and evidence are presented.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-cyan-300/90">
                  Signal Capture
                </span>
                <span className="rounded-full border border-indigo-500/25 bg-indigo-500/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-indigo-300/90">
                  Evidence Correlation
                </span>
              </div>
            </div>

            <div data-reveal className="relative rounded-2xl border border-slate-700/50 bg-slate-950/50 backdrop-blur-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{ background: "radial-gradient(1200px 300px at 50% -15%, rgba(34,211,238,0.25), transparent 55%)" }}
              />
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50 bg-slate-900/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 tracking-[0.16em] uppercase">verify-x v1</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 tracking-[0.12em]">PROCESSING</span>
                </div>
              </div>

              <div className="relative p-5 space-y-4">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.015]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 4px)",
                  }}
                />

                <div className="relative rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 overflow-hidden">
                  <div aria-hidden="true" className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-500/40" />
                  <div aria-hidden="true" className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-500/20" />
                  <div aria-hidden="true" className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-500/20" />
                  <div aria-hidden="true" className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-500/40" />
                  <div aria-hidden="true" className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-cyan-500/5 to-transparent" />
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-mono text-slate-400 tracking-[0.16em] uppercase">INTERCEPTED_CLAIM</span>
                    <div className="h-px flex-1 bg-slate-700/50" />
                    <span className="text-[10px] font-mono text-slate-500">UTC 14:32:07</span>
                  </div>
                  <p className="text-white font-semibold text-base sm:text-lg leading-snug">
                    The moon is a hollow titanium structure built by an ancient civilization.
                  </p>
                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[9px] font-mono text-slate-500 tracking-[0.12em] uppercase">SCAN PROGRESS</span>
                      <span className="text-[9px] font-mono text-cyan-300">100%</span>
                    </div>
                    <div className="h-0.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-cyan-500/60 via-indigo-500/50 to-cyan-400/40 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative rounded-xl border border-red-500/25 bg-red-950/20 p-4 overflow-hidden">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 opacity-[0.07]"
                      style={{ background: "radial-gradient(ellipse at 50% 0%, #ef4444 0%, transparent 70%)" }}
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute -bottom-2 -right-1 text-[4.5rem] font-black text-red-500/5 leading-none select-none tracking-tighter">✕</span>
                    <span className="text-[10px] font-mono text-slate-400 tracking-[0.16em] uppercase">VERDICT</span>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400 shadow-[0_0_6px_rgba(248,113,113,1)]" />
                      </span>
                      <span className="text-2xl font-black text-red-400 tracking-tight">FALSE</span>
                    </div>
                    <div className="mt-2 h-px bg-red-500/15" />
                    <p className="mt-2 text-[10px] font-mono text-red-300/70 tracking-[0.12em] uppercase">Debunked · No basis</p>
                  </div>

                  <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
                    <span className="text-[10px] font-mono text-slate-400 tracking-[0.16em] uppercase">CONFIDENCE</span>
                    <div className="mt-2 flex items-end gap-1">
                      <span className="text-3xl font-black text-white tracking-tighter leading-none">92</span>
                      <span className="text-base font-bold text-slate-400 mb-0.5">%</span>
                    </div>
                    <div className="mt-3 grid grid-cols-10 gap-0.5">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1.5 rounded-sm ${idx < 9 ? (idx < 3 ? "bg-emerald-400/40" : (idx < 6 ? "bg-emerald-400/60" : "bg-emerald-400/80")) : "bg-slate-700/50"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 text-[9px] font-mono text-slate-500 tracking-[0.12em]">HIGH CERTAINTY</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-emerald-400/70" />
                      <span className="text-[9px] font-mono text-emerald-300/80 tracking-[0.12em] uppercase">calibrated</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-mono text-slate-400 tracking-[0.16em] uppercase">REASONING_SNAPSHOT</span>
                    <div className="h-px flex-1 bg-slate-700/40" />
                  </div>
                  <div className="border-l-2 border-cyan-500/30 pl-3">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Apollo seismic data and modern density mapping confirm a layered rocky body.
                      The "hollow titanium moon" theory has zero support from NASA, ESA, or peer-reviewed planetary science.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 tracking-[0.16em] uppercase">SOURCE_NODES</span>
                    <div className="h-px flex-1 bg-slate-700/40" />
                    <span className="text-[10px] font-mono text-slate-500">2 verified</span>
                  </div>
                  <div className="space-y-2">
                    {EVIDENCE_SOURCES.map((src) => (
                      <div key={src.domain} data-cursor="inspect" data-cursor-label="SOURCE" className="group relative flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-900/30 px-4 py-3 hover:border-slate-600/60 hover:bg-slate-900/50 transition-all duration-200 cursor-default">
                        <span aria-hidden="true" className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-[2px] rounded-r bg-cyan-400/70 group-hover:h-6 transition-all duration-200" />
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded border ${src.typeBorder} bg-slate-900/60 ${src.typeColor}`}>
                            {src.type}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[11px] font-mono text-slate-400 tracking-[0.1em] truncate">{src.domain}</p>
                            <p className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors duration-200 leading-tight truncate">{src.title}</p>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-0.5 ml-3">
                          <span className={`text-sm font-black ${src.typeColor}`}>{src.match}</span>
                          <span className="text-[9px] font-mono text-slate-500 tracking-[0.1em]">match</span>
                          <div className="mt-0.5 h-0.5 w-10 rounded-full bg-slate-800 overflow-hidden">
                            <div className={`h-full ${src.barColor} opacity-60`} style={{ width: src.match }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-slate-500 tracking-[0.1em] uppercase">model: verify-x v1</span>
                    <span className="text-slate-700/50">·</span>
                    <span className="text-[9px] font-mono text-slate-500 tracking-[0.1em] uppercase">latency: 48ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block min-h-[620px]" aria-hidden="true" />
        </div>
      </div>
    </Section>
  );
}

export default React.memo(ExampleResultSection);
