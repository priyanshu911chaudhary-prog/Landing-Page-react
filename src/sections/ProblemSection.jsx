import React from 'react';
import Section from '@/ui/Section';
import { THREATS } from '@/constants/threats';

function ProblemSection() {
  return (
    <Section id="problem" className="bg-transparent py-32 relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.06] rounded-full"
        style={{ background: 'radial-gradient(ellipse at center, #ef4444 0%, transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 3px)',
          backgroundSize: '100% 3px',
        }}
      />

      <div data-section-panel className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-end">
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div data-reveal className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-4 bg-red-500/50" />
              <p className="text-xs font-bold tracking-[0.3em] text-red-400/80 uppercase">
                Threat Assessment
              </p>
            </div>
            <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-6">
              The Crisis<br />
              <span className="section-title-accent">of Trust.</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
              Misinformation is no longer just a human problem — it's a computational one. The
              battlefield has moved to the algorithm layer.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {THREATS.map((t) => (
              <div
                key={t.id}
                data-reveal
                className={`group relative overflow-hidden rounded-2xl border border-slate-700/40 border-l-2 ${t.accentBorder} bg-slate-950/40 backdrop-blur-sm transition-all duration-300 ${t.hoverBorder} ${t.accentGlow} hover:bg-slate-900/50 cursor-default`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{
                    background: `radial-gradient(ellipse at 0% 50%, ${t.cardGlow} 0%, transparent 60%)`,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-4 -right-2 text-[8rem] font-black text-white/[0.03] leading-none select-none"
                >
                  {t.id}
                </span>
                <div className="relative z-10 p-6 flex items-start gap-5">
                  <div className="flex flex-col items-center gap-2.5 pt-1 shrink-0">
                    <span className="relative flex h-2.5 w-2.5">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${t.dotColor} opacity-75`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${t.dotColor} ${t.dotGlow}`}
                      />
                    </span>
                    <div className="w-px flex-1 min-h-[2.5rem] bg-slate-700/40" />
                    <p className="text-[10px] font-mono text-slate-500 tracking-[0.12em]">{t.id}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[11px] font-bold tracking-[0.16em] uppercase ${t.labelColor}`}
                      >
                        {t.label}
                      </span>
                      <span
                        className={`opacity-20 group-hover:opacity-50 transition-opacity duration-300 ${t.labelColor}`}
                      >
                        {t.icon}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight mb-2 leading-tight group-hover:text-slate-100 transition-colors duration-200">
                      {t.title}
                    </h3>
                    <div className="relative h-px mb-3 bg-slate-700/40 overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 w-6 group-hover:w-full transition-all duration-500 ease-out ${t.dotColor} opacity-30`}
                      />
                    </div>
                    <p className="text-slate-300 text-base leading-relaxed group-hover:text-slate-200 transition-colors duration-200">
                      {t.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div data-reveal className="mt-10 flex items-center gap-3">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500/70" />
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-red-900/30 to-transparent" />
            <p className="text-[11px] font-mono text-slate-400 tracking-[0.16em] uppercase shrink-0">
              3 active threat vectors
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default React.memo(ProblemSection);
