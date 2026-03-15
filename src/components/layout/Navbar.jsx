import React, { useState, useCallback, useEffect } from 'react';
import { NAV_LINKS } from '@/constants/nav';
import { useNavbarVisibility } from '@/hooks/useNavbarVisibility';

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showNavbar } = useNavbarVisibility();
  const handleNavClick = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!showNavbar) setMobileOpen(false);
  }, [showNavbar]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-transparent transition-transform duration-300 ease-out ${showNavbar ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`}
    >
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent"
        aria-hidden="true"
      />
      <div className="w-full max-w-[1400px] mx-auto px-4 text-slate-100">
        <div className="relative flex items-center h-16 md:h-[4.25rem]">
          <div className="hidden md:flex items-center gap-3 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-metallic rounded-full px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3 md:ml-4">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-700/70 bg-slate-900/70 p-2 text-slate-200 hover:text-white hover:border-slate-500/80 transition-colors"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div id="mobile-nav-menu" className="md:hidden pb-4">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/80 backdrop-blur-sm p-3 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className="nav-metallic rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-200 hover:text-white transition-all duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default React.memo(Navbar);
