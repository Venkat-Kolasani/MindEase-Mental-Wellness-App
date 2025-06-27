import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Eye, Ear, Hand, DoorClosed as Nose, Mouse as Mouth } from 'lucide-react';

export default function ToolsPage() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathePhase, setBreathePhase] = useState('inhale');
  const [groundingStep, setGroundingStep] = useState(0);

  const groundingSteps = [
    {
      number: 5,
      sense: 'see',
      icon: Eye,
      color: 'from-dusty-orange-400 to-dusty-orange-500',
      instruction: 'Name 5 things you can see around you',
      examples: ['A book on the shelf', 'Light coming through the window', 'The texture of the wall', 'A plant in the corner', 'Your hands']
    },
    {
      number: 4,
      sense: 'touch',
      icon: Hand,
      color: 'from-terracotta-400 to-terracotta-500',
      instruction: 'Name 4 things you can touch',
      examples: ['The surface you\'re sitting on', 'Your clothing fabric', 'The temperature of the air', 'Your phone or device']
    },
    {
      number: 3,
      sense: 'hear',
      icon: Ear,
      color: 'from-warm-beige-400 to-warm-beige-500',
      instruction: 'Name 3 things you can hear',
      examples: ['Sounds from outside', 'Your own breathing', 'Background noise or music']
    },
    {
      number: 2,
      sense: 'smell',
      icon: Nose,
      color: 'from-muted-sage-400 to-muted-sage-500',
      instruction: 'Name 2 things you can smell',
      examples: ['The air freshener', 'Food cooking nearby']
    },
    {
      number: 1,
      sense: 'taste',
      icon: Mouth,
      color: 'from-terracotta-400 to-dusty-orange-400',
      instruction: 'Name 1 thing you can taste',
      examples: ['The lingering taste of your last drink']
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathePhase(prev => {
          if (prev === 'inhale') return 'hold1';
          if (prev === 'hold1') return 'exhale';
          if (prev === 'exhale') return 'hold2';
          return 'inhale';
        });
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isBreathing]);

  const getBreathingText = () => {
    switch (breathePhase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
      default: return 'Breathe In';
    }
  };

  const getCircleScale = () => {
    switch (breathePhase) {
      case 'inhale': return 1.2;
      case 'hold1': return 1.2;
      case 'exhale': return 0.8;
      case 'hold2': return 0.8;
      default: return 1;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-soft-cream-500 mb-4">
          Grounding Tools
        </h1>
        <p className="text-warm-taupe-400 text-lg">
          Simple techniques to help you feel centered and calm
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Breathing Exercise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-warm-charcoal-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-terracotta-500/20"
        >
          <h2 className="text-2xl font-bold text-soft-cream-500 mb-6 text-center">
            4-7-8 Breathing
          </h2>
          
          <div className="flex flex-col items-center space-y-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <motion.div
                className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg animate-warm-breathe"
                animate={{ 
                  scale: getCircleScale(),
                }}
                transition={{ 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <div className="text-warm-charcoal-900 font-semibold text-lg text-center">
                  {getBreathingText()}
                </div>
              </motion.div>
              
              {/* Decorative circles */}
              <motion.div
                className="absolute w-40 h-40 border-2 border-warm-beige-400/50 rounded-full"
                animate={{ rotate: isBreathing ? 360 : 0 }}
                transition={{ duration: 8, repeat: isBreathing ? Infinity : 0, ease: "linear" }}
              />
              <motion.div
                className="absolute w-48 h-48 border border-warm-beige-300/30 rounded-full"
                animate={{ rotate: isBreathing ? -360 : 0 }}
                transition={{ duration: 12, repeat: isBreathing ? Infinity : 0, ease: "linear" }}
              />
            </div>

            <div className="text-center text-warm-taupe-400 mb-4">
              <p className="text-sm">Inhale for 4 • Hold for 7 • Exhale for 8</p>
            </div>

            <div className="flex space-x-4">
              <motion.button
                onClick={() => setIsBreathing(!isBreathing)}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg transition-all duration-300 ${
                  isBreathing 
                    ? 'bg-gradient-to-r from-warm-beige-400 to-warm-beige-500 text-warm-charcoal-900' 
                    : 'bg-gradient-to-r from-terracotta-500 to-dusty-orange-500 text-warm-charcoal-900'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isBreathing ? <Pause size={20} /> : <Play size={20} />}
                <span>{isBreathing ? 'Pause' : 'Start'}</span>
              </motion.button>

              <motion.button
                onClick={() => {
                  setIsBreathing(false);
                  setBreathePhase('inhale');
                }}
                className="px-6 py-3 rounded-xl font-semibold bg-warm-charcoal-700 hover:bg-warm-charcoal-600 text-warm-taupe-300 flex items-center space-x-2 shadow-lg transition-all duration-300 border border-terracotta-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={20} />
                <span>Reset</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* 5-4-3-2-1 Grounding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-warm-charcoal-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-terracotta-500/20"
        >
          <h2 className="text-2xl font-bold text-soft-cream-500 mb-6 text-center">
            5-4-3-2-1 Grounding
          </h2>

          <div className="space-y-6">
            <div className="text-center text-warm-taupe-400 mb-6">
              <p className="text-sm">Use your senses to connect with the present moment</p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={groundingStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                {groundingStep < groundingSteps.length ? (
                  <>
                    <div className="text-center">
                      <motion.div
                        className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${groundingSteps[groundingStep].color} text-warm-charcoal-900 text-2xl font-bold mb-4 shadow-lg`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        {groundingSteps[groundingStep].number}
                      </motion.div>
                      <h3 className="text-xl font-semibold text-soft-cream-500 mb-2">
                        {groundingSteps[groundingStep].instruction}
                      </h3>
                    </div>

                    <div className="bg-warm-charcoal-700/50 rounded-xl p-4 border border-terracotta-500/20">
                      <h4 className="font-medium text-warm-taupe-300 mb-2">Examples:</h4>
                      <ul className="space-y-1">
                        {groundingSteps[groundingStep].examples.map((example, index) => (
                          <li key={index} className="text-warm-taupe-400 text-sm flex items-center">
                            <div className="w-1.5 h-1.5 bg-terracotta-400 rounded-full mr-2"></div>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <motion.button
                      onClick={() => setGroundingStep(prev => prev + 1)}
                      className="w-full bg-gradient-to-r from-dusty-orange-500 to-warm-beige-500 text-warm-charcoal-900 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Next Step
                    </motion.button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-6xl mb-4"
                    >
                      ✨
                    </motion.div>
                    <h3 className="text-xl font-semibold text-soft-cream-500">
                      Well done!
                    </h3>
                    <p className="text-warm-taupe-400">
                      You've completed the 5-4-3-2-1 grounding exercise. 
                      Take a moment to notice how you feel now.
                    </p>
                    <motion.button
                      onClick={() => setGroundingStep(0)}
                      className="bg-gradient-to-r from-terracotta-500 to-dusty-orange-500 text-warm-charcoal-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Over
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12 bg-gradient-to-r from-warm-beige-500/20 to-dusty-orange-500/20 rounded-2xl p-8 shadow-lg border border-warm-beige-400/30"
      >
        <h3 className="text-xl font-semibold text-soft-cream-500 mb-4 text-center">
          Remember
        </h3>
        <p className="text-warm-taupe-300 text-center leading-relaxed">
          These tools are here whenever you need them. Regular practice can help you feel more grounded 
          and present in your daily life. Take your time, be patient with yourself, and remember that 
          healing is a journey, not a destination.
        </p>
      </motion.div>
    </motion.div>
  );
}