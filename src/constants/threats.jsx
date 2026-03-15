import React from 'react';

/**
 * Threat assessment data for the Problem section.
 * Icons are inline SVG elements for consistent styling.
 */
export const THREATS = [
  {
    id: '01',
    label: 'THREAT · CRITICAL',
    labelColor: 'text-red-400',
    accentBorder: 'border-l-red-500/70',
    accentGlow: 'shadow-[0_0_40px_rgba(239,68,68,0.08)]',
    hoverBorder: 'hover:border-red-500/30',
    dotColor: 'bg-red-400',
    dotGlow: 'shadow-[0_0_8px_rgba(248,113,113,1)]',
    cardGlow: 'rgba(239,68,68,0.04)',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Viral Velocity',
    description:
      'False claims can spread widely before verification teams publish context.',
  },
  {
    id: '02',
    label: 'THREAT · HIGH',
    labelColor: 'text-orange-400',
    accentBorder: 'border-l-orange-500/70',
    accentGlow: 'shadow-[0_0_40px_rgba(249,115,22,0.08)]',
    hoverBorder: 'hover:border-orange-500/30',
    dotColor: 'bg-orange-400',
    dotGlow: 'shadow-[0_0_8px_rgba(251,146,60,1)]',
    cardGlow: 'rgba(249,115,22,0.04)',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Scale Collapse',
    description:
      'Manual review is hard to scale when new claims appear continuously across platforms.',
  },
  {
    id: '03',
    label: 'THREAT · ELEVATED',
    labelColor: 'text-yellow-400',
    accentBorder: 'border-l-yellow-500/60',
    accentGlow: 'shadow-[0_0_40px_rgba(234,179,8,0.07)]',
    hoverBorder: 'hover:border-yellow-500/30',
    dotColor: 'bg-yellow-400',
    dotGlow: 'shadow-[0_0_8px_rgba(250,204,21,1)]',
    cardGlow: 'rgba(234,179,8,0.04)',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: 'Deep Deception',
    description:
      'Synthetic text and media make source evaluation harder and increase verification time.',
  },
];
