import React from 'react';

function Button({ children, onClick, type = 'button', className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn-accent-primary inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition active:scale-[0.98] ${className}`}
    >
      {children}
    </button>
  );
}

export default React.memo(Button);