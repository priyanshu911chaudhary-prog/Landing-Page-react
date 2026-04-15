import React from 'react';
import Section from '@/ui/Section';
import { PHASES, PHASE_PROGRESS, PHASE_TAGS } from '@/constants/phases';

function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="bg-transparent py-32 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.05] rounded-full"
        style={{ background: 'radial-gradient(ellipse at center, #6366f1 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] opacity-[0.04] rounded-full"
        style={{ background: 'radial-gradient(ellipse at center, #38bdf8 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div data-section-panel className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-start">
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div data-reveal className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-4 bg-sky-500/50" />
              <p className="text-xs font-bold tracking-[0.3em] text-sky-400/80 uppercase">Execution Protocol</p>
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-6">
              How It<br />
              <span className="section-title-accent">Works.</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
              A three-step workflow from claim input to evidence-backed output.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {PHASES.map((p, i) => (
              <div key={p.phase} data-motion="section-card" className="flex flex-col">
                <div className={`group relative overflow-hidden rounded-2xl border border-slate-700/40 border-t-2 ${p.borderAccent} bg-slate-950/40 backdrop-blur-sm transition-all duration-300 cursor-default ${p.hoverBorder} ${p.hoverGlow} hover:bg-slate-900/50`}>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                    style={{ background: `radial-gradient(ellipse at 50% 0%, ${p.innerGlow} 0%, transparent 65%)` }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-3 -right-1 text-[5.5rem] font-black text-white/[0.025] leading-none select-none tracking-tighter font-mono"
                  >
                    {p.phase.replace('PHASE_', '')}
                  </span>
                  <div className="relative z-10 p-5 flex items-start gap-5">
                    <div className="relative shrink-0 mt-0.5">
                      <div aria-hidden="true" className={`absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l ${p.statusColor} opacity-30 rounded-tl-sm`} />
                      <div aria-hidden="true" className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r ${p.statusColor} opacity-30 rounded-br-sm`} />
                      <div className={`w-9 h-9 rounded-xl border border-slate-700/60 bg-slate-900/60 flex items-center justify-center ${p.statusColor} group-hover:bg-slate-800/60 transition-colors duration-300`}>
                        {p.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-slate-500 tracking-[0.18em] uppercase">{p.phase}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${p.dotColor} opacity-60`} />
                            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${p.dotColor} ${p.dotGlow}`} />
                          </span>
                          <span className={`text-[10px] font-bold tracking-[0.18em] uppercase ${p.statusColor}`}>{p.status}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight mb-1.5 leading-tight group-hover:text-slate-100 transition-colors duration-200">{p.title}</h3>
                      <div className="relative h-px mb-3 bg-slate-700/40 overflow-hidden">
                        <div className={`absolute inset-y-0 left-0 w-5 group-hover:w-full transition-all duration-500 ease-out ${p.dotColor} opacity-25`} />
                      </div>
                      <div className="flex items-end justify-between gap-4">
                        <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-200 flex-1">{p.description}</p>
                        <div className="shrink-0 text-right">
                          <p className={`text-lg font-black tracking-tight ${p.statusColor}`}>{p.metric}</p>
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.15em]">{p.metricLabel}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1">
                          {PHASE_TAGS[i].map((tag) => (
                            <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700/60 bg-slate-900/45 text-slate-400 group-hover:text-slate-300 group-hover:border-slate-500/70 transition-colors duration-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-0.5">
                          <div className="w-16 h-0.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${p.dotColor} opacity-40 group-hover:opacity-70 transition-opacity duration-300`}
                              style={{ width: `${PHASE_PROGRESS[i]}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-mono text-slate-500">{PHASE_PROGRESS[i]}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {i < PHASES.length - 1 && (
                  <div className="flex items-center gap-2 h-4 ml-[2.75rem]" aria-hidden="true">
                    <div className="flex flex-col items-center">
                      <div className="w-px h-2 bg-gradient-to-b from-slate-600/50 to-slate-700/30" />
                      <svg className="w-2 h-2 text-slate-600/50 -mt-px" fill="currentColor" viewBox="0 0 10 10">
                        <path d="M5 10L0 0h10z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 tracking-[0.12em] uppercase font-semibold">
                      {i === 0 ? '→ pipe to analysis' : '→ pipe to output'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div data-reveal className="mt-8 rounded-xl border border-slate-700/30 bg-slate-950/30 px-4 py-3 flex items-center gap-3">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]" />
            </span>
            <span className="text-[11px] font-mono text-slate-400 tracking-[0.16em] uppercase">pipeline_status:</span>
            <span className="text-[10px] font-mono text-emerald-400 tracking-[0.18em] uppercase">ALL_PHASES_NOMINAL</span>
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-900/30 to-transparent mx-1" />
            <div className="flex items-center gap-1.5 border border-slate-700/40 rounded-md px-2 py-0.5 bg-slate-900/40">
              <div className="w-1 h-1 rounded-full bg-emerald-400/70" />
              <span className="text-[10px] font-mono text-slate-400 tracking-[0.12em]">UPTIME 99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default React.memo(HowItWorksSection);
