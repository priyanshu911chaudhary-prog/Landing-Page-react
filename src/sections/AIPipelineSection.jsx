import React from 'react';
import { PIPELINE_STAGES } from '@/constants/pipeline';

function AIPipelineSection() {
  return (
    <section id="pipeline" className="min-h-[100vh] py-20 bg-transparent overflow-hidden relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(ellipse at center, #22d3ee 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/3 w-[420px] h-[420px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(ellipse at center, #818cf8 0%, transparent 72%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 22px)',
        }}
      />

      <div data-section-panel className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-12 scroll-build-surface">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-start">
          <div>
            <div data-reveal className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-5 bg-cyan-500/50" />
                <p className="text-xs font-bold tracking-[0.3em] text-cyan-400/80 uppercase">Mission Flowboard</p>
                <span className="text-[10px] font-mono text-slate-500 tracking-[0.12em]">DTI_PIPELINE v3</span>
              </div>
              <h2 className="text-5xl sm:text-7xl font-black tracking-tight text-left mb-5 text-white leading-[1.05]">
                Deep Learning
                <span className="block section-title-accent">Pipeline</span>
              </h2>
              <p className="text-slate-300/85 text-lg max-w-2xl text-left leading-relaxed">
                The verification flow is organized into five nodes from parsing to final output.
                Each stage exposes status, timing, and intermediate signals.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-cyan-500/25 bg-cyan-500/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-cyan-300/90">
                  Latency Tracked
                </span>
                <span className="rounded-full border border-indigo-500/25 bg-indigo-500/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em] text-indigo-300/90">
                  5 Nodes Visible
                </span>
              </div>
            </div>

            <div className="relative rounded-2xl border border-slate-700/40 bg-slate-950/40 backdrop-blur-sm p-4 sm:p-5 shadow-[0_20px_60px_rgba(2,6,23,0.45)] overflow-hidden">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.24) 0px, rgba(255,255,255,0.24) 1px, transparent 1px, transparent 5px)',
                }}
              />
              <div className="flex items-center justify-between mb-4 border-b border-slate-700/40 pb-3">
                <span className="text-[11px] font-mono text-slate-400 tracking-[0.16em] uppercase">Execution Nodes</span>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-mono text-emerald-300/90 tracking-[0.12em] uppercase">nominal</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {PIPELINE_STAGES.map((step, idx) => (
                  <div key={step.id} data-reveal>
                    <div className={`group relative rounded-xl border border-slate-700/45 ${step.borderAccent} border-l-2 bg-slate-900/35 p-4 hover:border-slate-600/70 transition-colors`}>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                        style={{ background: `radial-gradient(ellipse at 0% 50%, ${step.innerGlow} 0%, transparent 65%)` }}
                      />
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="relative shrink-0 mt-0.5 w-9 h-9 rounded-lg border border-slate-700/60 bg-slate-900/70 flex items-center justify-center text-slate-300">
                          <div aria-hidden="true" className={`absolute -top-1 -left-1 w-2 h-2 border-t border-l ${step.statusColor} opacity-30`} />
                          <div aria-hidden="true" className={`absolute -bottom-1 -right-1 w-2 h-2 border-b border-r ${step.statusColor} opacity-30`} />
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={step.icon} />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span className="text-[10px] font-mono text-slate-500 tracking-[0.16em] uppercase">{step.id}</span>
                            <div className="flex items-center gap-2.5">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${step.dotColor} opacity-60`} />
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${step.dotColor}`} />
                              </span>
                              <span className={`text-[10px] font-bold tracking-[0.14em] uppercase ${step.statusColor}`}>{step.status}</span>
                              <span className="text-[9px] font-mono text-slate-500 tracking-[0.1em]">
                                {String((idx + 1) * 20).padStart(2, '0')}%
                              </span>
                            </div>
                          </div>
                          <h4 className="text-base sm:text-lg font-black text-white tracking-tight mb-1">{step.title}</h4>
                          <p className="text-[15px] text-slate-300 leading-relaxed">{step.desc}</p>
                          <div className="mt-2.5 flex items-center justify-between">
                            <div className="h-0.5 flex-1 max-w-[180px] rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full ${step.dotColor} opacity-50`}
                                style={{ width: `${(idx + 1) * 20}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 tracking-[0.12em] uppercase">latency {step.latency}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {idx < PIPELINE_STAGES.length - 1 && (
                      <div className="h-3 flex items-center ml-4" aria-hidden="true">
                        <div className="w-px h-full bg-gradient-to-b from-slate-600/50 to-transparent" />
                        <span className="ml-2 h-1 w-1 rounded-full bg-slate-700/60" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div data-reveal className="mt-4 pt-3 border-t border-slate-700/40 flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-400 tracking-[0.16em] uppercase">PIPELINE_STATUS</span>
                <span className="text-[11px] font-mono text-cyan-300/90 tracking-[0.16em] uppercase">verification_pipeline_v1</span>
                <div className="h-px flex-1 bg-gradient-to-r from-cyan-900/30 to-transparent" />
                <span className="rounded border border-slate-700/50 bg-slate-900/40 px-2 py-0.5 text-[10px] font-mono text-slate-400 tracking-[0.1em] uppercase">
                  UPTIME 99.9%
                </span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block min-h-[640px]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default React.memo(AIPipelineSection);