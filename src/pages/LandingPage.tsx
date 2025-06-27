import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Sparkles, Heart } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-8"
      >
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-terracotta-400 to-dusty-orange-400 rounded-full flex items-center justify-center mb-6 mx-auto animate-gentle-pulse shadow-2xl">
            <Brain size={48} className="text-warm-charcoal-900" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-warm-beige-400 rounded-full flex items-center justify-center shadow-lg"
          >
            <Sparkles size={16} className="text-warm-charcoal-800" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-5xl md:text-6xl font-bold text-soft-cream-500 mb-4"
      >
        Mind<span className="text-terracotta-400">Ease</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-xl md:text-2xl text-warm-taupe-400 mb-12 max-w-2xl font-light"
      >
        Your pocket-sized therapist for daily mental clarity
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-6"
      >
        <motion.button
          onClick={() => navigate('/checkin')}
          className="bg-gradient-to-r from-terracotta-500 to-dusty-orange-500 text-warm-charcoal-900 px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-3 animate-soft-glow"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Heart size={24} />
          <span>Start a Check-in</span>
        </motion.button>

        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { icon: Heart, label: 'Mood Tracking', color: 'from-terracotta-400 to-terracotta-500' },
            { icon: Brain, label: 'AI Support', color: 'from-dusty-orange-400 to-warm-beige-400' },
            { icon: Sparkles, label: 'Mindfulness', color: 'from-warm-beige-400 to-muted-sage-400' },
          ].map(({ icon: Icon, label, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className={`bg-gradient-to-r ${color} text-warm-charcoal-900 px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 shadow-md`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 text-warm-taupe-500 text-sm"
      >
        Take a moment for yourself today
      </motion.div>
    </motion.div>
  );
}