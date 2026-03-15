import React from 'react';

function Section({ children, id, className = '' }) {
  return (
    <section id={id} className={`w-full py-20 ${className}`}>
      <div className="w-full">{children}</div>
    </section>
  );
}

export default React.memo(Section);