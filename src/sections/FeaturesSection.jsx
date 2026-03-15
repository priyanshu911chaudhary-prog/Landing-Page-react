import React from 'react';
import Section from '@/ui/Section';
import { FEATURES } from '@/constants/features';

function FeaturesSection() {
  return (
    <Section id="features" className="bg-transparent py-24 sm:py-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight mb-6">
          Enterprise Grade Features
        </h2>
        <p className="mt-4 text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
          Built for investigative journalists, policy researchers, and conscious consumers. Our
          robust toolset gives you unparalleled oversight into digital media.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mx-auto w-full max-w-[1400px]">
        {FEATURES.map((feature, idx) => (
          <div key={idx} className="bg-transparent rounded-3xl p-8 shadow-sm border border-slate-700/50 hover:border-slate-600 transition">
            <div className="w-12 h-12 bg-transparent rounded-2xl border border-blue-500/20 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mt-4">{feature.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default React.memo(FeaturesSection);