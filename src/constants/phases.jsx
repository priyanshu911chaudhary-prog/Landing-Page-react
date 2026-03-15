import React from 'react';

/** Progress percentages for phase indicators in How It Works */
export const PHASE_PROGRESS = [33, 66, 100];

/** Tag chips per phase */
export const PHASE_TAGS = [
  ['Claim Normalize', 'Entity Extract', 'Structure Parse'],
  ['Evidence Retrieve', 'Passage Rank', 'NLI Verification'],
  ['Confidence Score', 'Evidence Links', 'Final Verdict'],
];

/**
 * Pipeline phases for the How It Works section.
 */
export const PHASES = [
  {
    phase: 'PHASE_01',
    status: 'INPUT',
    statusColor: 'text-sky-400',
    dotColor: 'bg-sky-400',
    dotGlow: 'shadow-[0_0_8px_rgba(56,189,248,1)]',
    borderAccent: 'border-t-sky-500/60',
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(56,189,248,0.07)]',
    hoverBorder: 'hover:border-sky-500/30',
    innerGlow: 'rgba(56,189,248,0.05)',
    metric: '< 60 ms',
    metricLabel: 'CLAIM PARSE LATENCY',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Claim Processing',
    description:
      'Paste a headline or factual statement. The system normalizes the claim, removes attribution noise, and extracts the core verifiable assertion for analysis.',
  },
  {
    phase: 'PHASE_02',
    status: 'PROCESSING',
    statusColor: 'text-indigo-400',
    dotColor: 'bg-indigo-400',
    dotGlow: 'shadow-[0_0_8px_rgba(129,140,248,1)]',
    borderAccent: 'border-t-indigo-500/60',
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(99,102,241,0.07)]',
    hoverBorder: 'hover:border-indigo-500/30',
    innerGlow: 'rgba(99,102,241,0.05)',
    metric: '500+',
    metricLabel: 'DOCUMENTS ANALYZED',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Evidence Analysis',
    description:
      'The system retrieves relevant sources and performs structured reasoning across multiple passages to evaluate whether the claim is supported, contradicted, or unclear.',
  },
  {
    phase: 'PHASE_03',
    status: 'COMPLETE',
    statusColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    dotGlow: 'shadow-[0_0_8px_rgba(52,211,153,1)]',
    borderAccent: 'border-t-emerald-500/60',
    hoverGlow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.07)]',
    hoverBorder: 'hover:border-emerald-500/30',
    innerGlow: 'rgba(16,185,129,0.05)',
    metric: 'VERDICT READY',
    metricLabel: '',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verdict Generation',
    description:
      'Evidence signals are aggregated to produce a final verdict with confidence score and supporting citations.',
  },
];
