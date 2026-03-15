import { useState, useCallback } from 'react';
import { EVIDENCE_SOURCES } from '@/constants/evidence';

const TONE = {
  positive: {
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-950/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
    glow: '#34d399',
    watermark: '✓',
    note: 'text-emerald-300/70',
    divider: 'bg-emerald-500/15',
    accentBorder: 'border-emerald-500/30',
  },
  warning: {
    border: 'border-amber-500/25',
    bg: 'bg-amber-950/20',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    glow: '#f59e0b',
    watermark: '?',
    note: 'text-amber-300/70',
    divider: 'bg-amber-500/15',
    accentBorder: 'border-amber-500/30',
  },
  negative: {
    border: 'border-red-500/25',
    bg: 'bg-red-950/20',
    text: 'text-red-400',
    dot: 'bg-red-400',
    glow: '#ef4444',
    watermark: '✕',
    note: 'text-red-300/70',
    divider: 'bg-red-500/15',
    accentBorder: 'border-red-500/30',
  },
};

function DetectorResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  const {
    headline = 'Unknown claim',
    classification = 'REAL',
    statusLabel = 'Verified',
    statusTone = 'positive',
    credibilityScore = 0,
    confidence = 0,
    summary = '',
  } = result || {};

  const t = TONE[statusTone] || TONE.positive;
  const filledSegs = Math.round((confidence / 100) * 10);
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleCopy = useCallback(() => {
    const text = [
      'DTI Verification Report',
      `Claim: ${headline}`,
      `Verdict: ${classification} — ${statusLabel}`,
      `Credibility: ${credibilityScore}%`,
      `Confidence: ${confidence}%`,
      `Summary: ${summary}`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [headline, classification, statusLabel, credibilityScore, confidence, summary]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `DTI Verdict: ${classification}`,
        text: `Claim: "${headline}" — Verdict: ${statusLabel} (${confidence}% confidence)`,
      });
    } else {
      handleCopy();
    }
  }, [headline, classification, statusLabel, confidence, handleCopy]);

  return (
    <div className="w-full space-y-4">
      {/* Main Result Card */}
      <div className="relative rounded-2xl border border-slate-700/50 bg-slate-950/50 backdrop-blur-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">

        {/* Top ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{ background: `radial-gradient(1200px 300px at 50% -15%, ${t.glow}, transparent 55%)` }}
        />

        {/* Terminal title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50 bg-slate-900/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 tracking-[0.16em] uppercase">
            detailed_report.txt
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
            <span className={`text-[10px] font-mono ${t.text} tracking-[0.12em]`}>COMPLETE</span>
          </div>
        </div>

        <div className="relative p-5 space-y-3">
          {/* Scan-line texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 4px)',
            }}
          />

          {/* Analyzed claim block */}
          <div className="relative rounded-xl border border-slate-700/50 bg-slate-900/40 p-4 overflow-hidden">
            {/* Corner brackets */}
            <div aria-hidden="true" className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-500/40" />
            <div aria-hidden="true" className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-500/20" />
            <div aria-hidden="true" className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-500/20" />
            <div aria-hidden="true" className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-500/40" />
            {/* Side glow gradient */}
            <div aria-hidden="true" className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-cyan-500/5 to-transparent" />

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono text-slate-400 tracking-[0.16em] uppercase">ANALYZED_CLAIM</span>
              <div className="h-px flex-1 bg-slate-700/50" />
              <span className="text-[10px] font-mono text-slate-500 italic">UTC {timestamp}</span>
            </div>
            <p className="text-white font-semibold text-base leading-snug">
              {headline}
            </p>
            {/* Scan bar - smaller */}
            <div className="mt-3 space-y-1">
              <div className="h-0.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-cyan-500/60 via-indigo-500/50 to-cyan-400/40 rounded-full" />
              </div>
            </div>
          </div>

          {/* Verdict + Confidence */}
          <div className="grid grid-cols-2 gap-3">
            {/* Verdict stamp */}
            <div className={`relative rounded-xl border ${t.border} ${t.bg} p-3.5 overflow-hidden`}>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${t.glow}, transparent 70%)` }}
              />
              {/* Ghost watermark */}
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-1 -right-1 text-[3.5rem] font-black leading-none select-none tracking-tighter" style={{ color: `${t.glow}08` }}>
                {t.watermark}
              </span>

              <span className="text-[9px] font-mono text-slate-400 tracking-[0.16em] uppercase">VERDICT</span>
              <div className="mt-1 flex items-center gap-2">
                <span className={`text-xl font-black ${t.text} tracking-tight`}>{classification}</span>
              </div>
              <div className={`mt-1.5 h-px ${t.divider}`} />
              <p className={`mt-1.5 text-[9px] font-mono ${t.note} tracking-[0.12em] uppercase`}>{statusLabel}</p>
            </div>

            {/* Confidence gauge */}
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3.5">
              <span className="text-[9px] font-mono text-slate-400 tracking-[0.16em] uppercase">CONFIDENCE</span>
              <div className="mt-1 flex items-end gap-1">
                <span className="text-2xl font-black text-white tracking-tighter leading-none tabular-nums">{confidence}</span>
                <span className="text-xs font-bold text-slate-400 mb-0.5">%</span>
              </div>
              {/* Segmented bar */}
              <div className="mt-2 grid grid-cols-10 gap-0.5">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-sm transition-all duration-500 ${
                      idx < filledSegs
                        ? idx < 3 ? 'bg-emerald-400/40' : idx < 6 ? 'bg-emerald-400/60' : 'bg-emerald-400/80'
                        : 'bg-slate-700/50'
                    }`}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[8px] font-mono text-slate-500 tracking-[0.12em] uppercase">
                  {confidence >= 80 ? 'HIGH' : confidence >= 50 ? 'MEDIUM' : 'LOW'}
                </span>
                <div className="flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-emerald-400/70" />
                  <span className="text-[8px] font-mono text-emerald-300/80 uppercase">calibrated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Credibility Score */}
          {/* Credibility Score + Reasoning Mini */}
          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3.5 flex flex-col justify-center">
              <span className="text-[9px] font-mono text-slate-400 tracking-[0.12em] uppercase mb-1">SCORE</span>
              <span className={`text-2xl font-black tabular-nums ${t.text}`}>{credibilityScore}%</span>
              <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500/70 to-emerald-400/50"
                  style={{ width: `${credibilityScore}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-3.5">
              <span className="text-[9px] font-mono text-slate-400 tracking-[0.12em] uppercase mb-1 block">REASONING</span>
              <p className="text-slate-300 text-[13px] leading-tight line-clamp-3">
                {summary}
              </p>
            </div>
          </div>

          {/* Source nodes */}
          {/* Source nodes - simplified */}
          <div className="rounded-xl border border-slate-700/40 bg-slate-900/30 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono text-slate-400 tracking-[0.12em] uppercase">KEY SOURCES</span>
              <span className="text-[9px] font-mono text-slate-500">{EVIDENCE_SOURCES.length} nodes</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {EVIDENCE_SOURCES.slice(0, 4).map((src) => (
                <div key={src.domain} className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-800/40 px-2 py-1.5 rounded-lg border border-slate-700/30">
                  <span className={`w-1 h-1 rounded-full ${src.barColor}`} />
                  <span className="truncate">{src.domain}</span>
                  <span className="ml-auto text-[10px] font-bold text-slate-500">{src.match}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer metadata */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-slate-500 tracking-[0.1em] uppercase">model: verify-x v1</span>
              <span className="text-slate-700/50">·</span>
              <span className="text-[9px] font-mono text-slate-500 tracking-[0.1em] uppercase">latency: 3.5s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="flex-1 group relative rounded-xl text-xs font-bold px-6 py-3.5 transition-all duration-300 overflow-hidden bg-gradient-to-r from-cyan-500 to-cyan-400 text-white hover:from-cyan-400 hover:to-cyan-300 active:scale-[0.99] shadow-[0_8px_32px_rgba(34,211,238,0.25)]"
        >
          <span className="relative flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Analyze Another
          </span>
        </button>

        <button
          onClick={handleCopy}
          className="rounded-xl border border-slate-700/40 bg-slate-900/50 px-3.5 py-3.5 text-slate-400 transition-all duration-200 hover:text-white hover:border-slate-600/60 hover:bg-slate-800/60 active:scale-[0.97]"
          title="Copy report"
        >
          {copied ? (
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        <button
          onClick={handleShare}
          className="rounded-xl border border-slate-700/40 bg-slate-900/50 px-3.5 py-3.5 text-slate-400 transition-all duration-200 hover:text-white hover:border-slate-600/60 hover:bg-slate-800/60 active:scale-[0.97]"
          title="Share report"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DetectorResultCard;
