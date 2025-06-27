import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-warm-charcoal-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {children}
        {!isHome && <Navigation />}
      </div>
    </div>
  );
}