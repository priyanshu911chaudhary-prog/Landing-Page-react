import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AppBackground from '@/components/background/AppBackground';

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <AppBackground />
      <main className="flex-1 relative pointer-events-auto">{children}</main>
    </div>
  );
}

export default React.memo(MainLayout);
