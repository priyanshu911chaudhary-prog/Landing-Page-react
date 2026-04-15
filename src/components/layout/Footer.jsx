import React from 'react';
import { NAV_LINKS } from '@/constants/nav';

function Footer() {
  return (
    <footer className="bg-transparent border-t border-slate-700/50 py-6 sm:py-7">
      <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-12">
        <div className="flex flex-col gap-4 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a href="#hero-section" className="inline-flex items-center" aria-label="Go to top of page">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">
              verify-X
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-slate-400">
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-sm text-slate-500">Copyright 2026 verify-X</p>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
