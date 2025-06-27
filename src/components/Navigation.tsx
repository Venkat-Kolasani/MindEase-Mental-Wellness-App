import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Heart, TrendingUp, Compass } from 'lucide-react';

const navItems = [
  { icon: Home, path: '/', label: 'Home' },
  { icon: Heart, path: '/checkin', label: 'Check-in' },
  { icon: TrendingUp, path: '/trends', label: 'Trends' },
  { icon: Compass, path: '/tools', label: 'Tools' },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="bg-warm-charcoal-800/90 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-lg border border-terracotta-500/20">
        <div className="flex space-x-8">
          {navItems.map(({ icon: Icon, path, label }) => {
            const isActive = location.pathname === path;
            return (
              <motion.button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-colors ${
                  isActive 
                    ? 'text-terracotta-400' 
                    : 'text-warm-taupe-400 hover:text-terracotta-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}