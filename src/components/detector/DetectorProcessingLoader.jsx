import { useState, useEffect, useRef } from 'react';

const PIPELINE_STEPS = [
  {
    id: 'processing',
    label: 'Claim Processing',
    desc: 'Claim normalized and structured for verification.',
    doneDesc: 'Payload processed • claim extracted',
    duration: 1000,
  },
  {
    id: 'retrieval',
    label: 'Evidence Retrieval',
    desc: 'Searching knowledge bases and news sources...',
    doneDesc: 'Retrieving relevant sources and ranking evidence passages related to the claim.',
    duration: 1000,
  },
  {
    id: 'verification',
    label: 'Evidence Verification',
    desc: 'Running evidence verification...',
    doneDesc: 'Evaluating claim–evidence relationships to detect support or contradiction.',
    duration: 1000,
  },
  {
    id: 'generation',
    label: 'Verdict Generation',
    desc: 'Synthesizing results...',
    doneDesc: 'Aggregating evidence signals to produce the final verdict and confidence score.',
    duration: 1000,
  },
];

const TOTAL_DURATION = PIPELINE_STEPS.reduce((s, step) => s + step.duration, 0);

function DetectorProcessingLoader({ headline, onComplete }) {
  const [activeStep, setActiveStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startTime = useRef(Date.now());
  const animFrameRef = useRef(null);

  useEffect(() => {
    const totalMs = TOTAL_DURATION;
    let running = true;

    const tick = () => {
      if (!running) return;
      const now = Date.now();
      const dt = now - startTime.current;
      const overall = Math.min(dt / totalMs, 1);

      setElapsed(dt);
      setOverallProgress(Math.round(overall * 100));

      let accumulated = 0;
      for (let i = 0; i < PIPELINE_STEPS.length; i++) {
        accumulated += PIPELINE_STEPS[i].duration;
        if (dt < accumulated) {
          setActiveStep(i);
          const stepStart = accumulated - PIPELINE_STEPS[i].duration;
          const stepProg = Math.min((dt - stepStart) / PIPELINE_STEPS[i].duration, 1);
          setStepProgress(Math.round(stepProg * 100));
          break;
        }
        if (i === PIPELINE_STEPS.length - 1) {
          setActiveStep(PIPELINE_STEPS.length - 1);
          setStepProgress(100);
        }
      }

      if (overall < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        // Call onComplete when finished
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [onComplete]);

  const etaMs = Math.max(0, TOTAL_DURATION - elapsed);
  const etaSec = (etaMs / 1000).toFixed(1);

  return (
    <div className="w-full">
      <div className="relative rounded-2xl border border-slate-700/50 bg-slate-950/50 backdrop-blur-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        {/* Top glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ background: 'radial-gradient(900px 200px at 50% -10%, rgba(34,211,238,0.3), transparent 55%)' }}
        />

        {/* Header bar */}
        <div className="relative flex items-center justify-between px-5 py-3 border-b border-slate-700/40 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 tracking-[0.14em] uppercase">
              verify-x v1
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-50" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
            </span>
            <span className="text-[10px] font-mono text-cyan-300/80 tracking-[0.12em] uppercase">
              Processing
            </span>
          </div>
        </div>

        <div className="relative p-6 space-y-5">
          {/* Scan-line texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.012]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 4px)',
            }}
          />

          {/* Intercepted claim */}
          <div className="relative rounded-xl border border-slate-700/40 bg-slate-900/30 p-4 overflow-hidden">
            {/* Corner brackets */}
            <div aria-hidden="true" className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-cyan-500/30" />
            <div aria-hidden="true" className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-cyan-500/20" />
            <div aria-hidden="true" className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-cyan-500/20" />
            <div aria-hidden="true" className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-cyan-500/30" />

            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] font-mono text-slate-500 tracking-[0.14em] uppercase">
                Intercepted Claim
              </span>
              <div className="h-px flex-1 bg-slate-700/40" />
            </div>
            <p className="text-white font-semibold text-base leading-snug">
              &ldquo;{headline}&rdquo;
            </p>
          </div>

          {/* Overall Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-400">
                Analysis Progress
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-600 tabular-nums tracking-wide">
                  ETA {etaSec}s
                </span>
                <span className="text-sm font-bold text-cyan-400 tabular-nums">
                  {overallProgress}%
                </span>
              </div>
            </div>
            <div className="h-1 w-full rounded-full bg-slate-800/70 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-150 ease-linear"
                style={{
                  width: `${overallProgress}%`,
                  background: 'linear-gradient(90deg, #06b6d4, #818cf8)',
                }}
              />
            </div>
          </div>

          {/* Pipeline Steps */}
          <div className="space-y-0.5">
            {PIPELINE_STEPS.map((step, i) => {
              const isDone = i < activeStep || (i === activeStep && stepProgress >= 100 && overallProgress >= 100);
              const isActive = i === activeStep && !isDone;

              return (
                <div
                  key={step.id}
                  className={`group relative flex items-start gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-800/30'
                      : isDone
                      ? 'bg-slate-800/15'
                      : ''
                  }`}
                >
                  {/* Active left accent */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-r bg-cyan-400/60" />
                  )}

                  {/* Step indicator */}
                  <div className="mt-0.5 flex-shrink-0">
                    {isDone ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20">
                        <svg className="h-3 w-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    ) : isActive ? (
                      <span className="flex h-5 w-5 items-center justify-center">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-slate-700/80" />
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium transition-colors duration-200 ${
                          isDone
                            ? 'text-emerald-400/80'
                            : isActive
                            ? 'text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        {step.label}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-mono text-cyan-400/60 tabular-nums">
                          {stepProgress}%
                        </span>
                      )}
                      {isDone && (
                        <span className="text-[10px] font-mono text-emerald-400/50 tracking-[0.08em] uppercase">
                          Done
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 font-mono ${
                        isDone
                          ? 'text-slate-600'
                          : isActive
                          ? 'text-slate-400'
                          : 'text-slate-700'
                      }`}
                    >
                      {isDone ? step.doneDesc : step.desc}
                    </p>

                    {isActive && (
                      <div className="mt-2.5 h-0.5 w-full rounded-full bg-slate-800/70 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-500/40 transition-all duration-100 ease-linear"
                          style={{ width: `${stepProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-2.5 border-t border-slate-700/30 bg-slate-900/20">
          <span className="text-[9px] font-mono text-slate-600 tracking-[0.1em] uppercase">
            Ensemble Pipeline · {PIPELINE_STEPS.length} stages
          </span>
          <span className="text-[9px] font-mono text-slate-600 tracking-[0.1em] tabular-nums">
            {(elapsed / 1000).toFixed(1)}s elapsed
          </span>
        </div>
      </div>
    </div>
  );
}

export default DetectorProcessingLoader;
