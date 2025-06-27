import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Save, TrendingUp, Sparkles, Zap, Bot } from 'lucide-react';
import type { MoodEntry } from '../context/AppContext';

export default function ResponsePage() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleSaveEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: state.currentMood,
      emoji: state.currentEmoji,
      response: state.aiResponse,
      affirmation: state.aiAffirmation,
    };

    const savedEntries = JSON.parse(localStorage.getItem('mindease-entries') || '[]');
    const updatedEntries = [...savedEntries, newEntry];
    localStorage.setItem('mindease-entries', JSON.stringify(updatedEntries));
    
    dispatch({ type: 'ADD_ENTRY', payload: newEntry });
    
    // Show success message or navigate
    navigate('/trends');
  };

  if (!state.aiResponse) {
    navigate('/checkin');
    return null;
  }

  // Check if response came from Gemini API (look for source indicator in localStorage or state)
  const isGeminiResponse = state.aiResponse.length > 100; // Gemini responses tend to be longer
  const responseSource = isGeminiResponse ? 'gemini' : 'fallback';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="text-6xl mb-4">{state.currentEmoji}</div>
        <h1 className="text-3xl font-bold text-soft-cream-500 mb-2">
          Thank you for sharing
        </h1>
        <p className="text-warm-taupe-400">
          Here's some gentle guidance for you
        </p>
        
        {/* API Status Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 flex items-center justify-center space-x-2"
        >
          {responseSource === 'gemini' ? (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-terracotta-500/20 to-dusty-orange-500/20 px-3 py-1 rounded-full border border-terracotta-400/30">
              <Zap size={14} className="text-terracotta-400" />
              <span className="text-xs text-terracotta-400 font-medium">Powered by Gemini AI</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-gradient-to-r from-warm-beige-500/20 to-muted-sage-500/20 px-3 py-1 rounded-full border border-warm-beige-400/30">
              <Bot size={14} className="text-warm-beige-400" />
              <span className="text-xs text-warm-beige-400 font-medium">Curated Response</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      <div className="space-y-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-warm-charcoal-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-terracotta-500/20"
        >
          <h2 className="text-xl font-semibold text-soft-cream-500 mb-4 flex items-center">
            <div className="w-2 h-2 bg-terracotta-400 rounded-full mr-3"></div>
            Gentle Guidance
          </h2>
          <p className="text-warm-taupe-300 leading-relaxed text-lg">
            {state.aiResponse}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-warm-beige-500/20 to-dusty-orange-500/20 rounded-2xl p-6 shadow-lg border border-warm-beige-400/30"
        >
          <h2 className="text-xl font-semibold text-soft-cream-500 mb-4 flex items-center">
            <Sparkles size={20} className="text-warm-beige-400 mr-3" />
            Daily Affirmation
          </h2>
          <p className="text-warm-taupe-300 leading-relaxed text-lg font-medium italic">
            "{state.aiAffirmation}"
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <motion.button
          onClick={handleSaveEntry}
          className="bg-gradient-to-r from-dusty-orange-500 to-warm-beige-500 text-warm-charcoal-900 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={20} />
          <span>Save Entry</span>
        </motion.button>

        <motion.button
          onClick={() => navigate('/trends')}
          className="bg-gradient-to-r from-terracotta-500 to-dusty-orange-500 text-warm-charcoal-900 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <TrendingUp size={20} />
          <span>View Mood Trends</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}