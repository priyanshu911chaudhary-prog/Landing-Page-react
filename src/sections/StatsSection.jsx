import React from 'react';
import Section from '@/ui/Section';
import { STATS } from '@/constants/stats';

function StatsSection() {
  return (
    <Section id="stats" className="bg-transparent py-16 sm:py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mx-auto w-full max-w-[1400px] px-4">
        {STATS.map((stat, idx) => (
          <div key={idx} className="surface-glass rounded-2xl p-8 text-center">
            <p className="text-4xl font-extrabold text-sky-200 tracking-tight">{stat.value}</p>
            <p className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export default React.memo(StatsSection);