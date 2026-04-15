import React from 'react';
import Section from '@/ui/Section';

function CTASection() {
  return (
    <Section className="bg-transparent relative overflow-hidden py-28 sm:py-40">

      {/* Subtle ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(ellipse at center, #94a3b8 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-20"
        style={{ background: "linear-gradient(to right, transparent, rgba(148,163,184,0.4), transparent)" }}
      />

      <div data-section-panel className="relative mx-auto w-full max-w-[1400px] px-6 lg:px-12 scroll-build-surface">

        {/* ── Console label ── */}
        <div data-reveal className="flex items-center gap-3 mb-10">
          <div className="h-px w-6 bg-slate-500/60" />
          <span className="text-[10px] font-mono tracking-[0.32em] uppercase text-slate-500">
            Launch Console
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          <span className="text-[10px] font-mono text-emerald-500/60 tracking-[0.2em]">READY_STATE</span>
        </div>

        {/* ── Main heading — stacked, cinematic ── */}
        <div className="mb-14 lg:mb-16">
          <h2
            data-reveal
            className="font-heading font-bold tracking-tight leading-[0.95] text-white"
            style={{ fontSize: "clamp(2.56rem, 6.4vw, 5.6rem)" }}
          >
            Ready to Verify
          </h2>
          <h2
            data-reveal
            className="font-heading font-bold tracking-tight leading-[0.95] text-metallic"
            style={{ fontSize: "clamp(2.56rem, 6.4vw, 5.6rem)" }}
          >
            and Open the
          </h2>
          <h2
            data-reveal
            className="font-heading font-bold tracking-tight leading-[0.95] text-white"
            style={{ fontSize: "clamp(2.56rem, 6.4vw, 5.6rem)" }}
          >
            Detector?
          </h2>
        </div>

        {/* ── Single CTA button ── */}
        <div data-reveal>
          <a
            href="#hero-section"
            data-cursor="cta"
            data-cursor-label="TRY"
            className="btn-metallic group inline-flex items-center gap-3 rounded-full px-10 py-5 font-heading font-semibold text-white text-lg tracking-wide"
          >
            Try Detector
            <svg
              className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>
    </Section>
  );
}

export default React.memo(CTASection);