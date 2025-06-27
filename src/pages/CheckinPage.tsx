import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generateAIResponse, testGeminiConnection } from '../utils/gemini';
import { Send, Loader2, Zap, AlertCircle } from 'lucide-react';

const moodEmojis = [
  { emoji: '😊', label: 'Happy', value: 5 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '😞', label: 'Sad', value: 2 },
  { emoji: '😭', label: 'Very Sad', value: 1 },
  { emoji: '😠', label: 'Angry', value: 2 },
];

export default function CheckinPage() {
  const [moodText, setMoodText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'connected' | 'failed'>('unknown');
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const testConnection = async () => {
    setConnectionStatus('testing');
    const result = await testGeminiConnection();
    setConnectionStatus(result.success ? 'connected' : 'failed');
    
    // Auto-hide status after 3 seconds
    setTimeout(() => {
      setConnectionStatus('unknown');
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!moodText.trim() || !selectedEmoji) {
      return;
    }

    dispatch({ type: 'SET_MOOD', payload: { mood: moodText, emoji: selectedEmoji } });
    dispatch({ type: 'SET_LOADING', payload: true });

    // The generateAIResponse function handles all error cases and API key fallbacks internally
    const result = await generateAIResponse(moodText);
    
    dispatch({ 
      type: 'SET_AI_RESPONSE', 
      payload: { response: result.response, affirmation: result.affirmation } 
    });
    
    navigate('/response');
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-terracotta-400';
      case 'failed': return 'text-dusty-orange-400';
      case 'testing': return 'text-warm-beige-400';
      default: return 'text-warm-taupe-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Gemini AI Connected ✓';
      case 'failed': return 'Using Fallback Responses';
      case 'testing': return 'Testing Connection...';
      default: return 'Test Gemini Connection';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="max-w-2xl mx-auto w-full px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-soft-cream-500 mb-4">
            How are you feeling today?
          </h1>
          <p className="text-warm-taupe-400 text-lg mb-6">
            Take a moment to reflect on your current state of mind
          </p>
          
          {/* Connection Test Button */}
          <motion.button
            onClick={testConnection}
            disabled={connectionStatus === 'testing'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 mx-auto border ${getConnectionStatusColor()} border-current/30 hover:bg-current/10`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {connectionStatus === 'testing' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : connectionStatus === 'connected' ? (
              <Zap size={16} />
            ) : connectionStatus === 'failed' ? (
              <AlertCircle size={16} />
            ) : (
              <Zap size={16} />
            )}
            <span className={getConnectionStatusColor()}>{getConnectionStatusText()}</span>
          </motion.button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-lg font-medium text-soft-cream-500 mb-4">
              Share your thoughts
            </label>
            <textarea
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="I'm feeling..."
              className="w-full h-32 p-4 border border-terracotta-500/30 rounded-2xl focus:ring-2 focus:ring-terracotta-400 focus:border-transparent resize-none text-lg bg-warm-charcoal-800/50 backdrop-blur-sm shadow-sm text-soft-cream-500 placeholder-warm-taupe-500"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-lg font-medium text-soft-cream-500 mb-4">
              Choose your mood
            </label>
            <div className="grid grid-cols-5 gap-4">
              {moodEmojis.map(({ emoji, label, value }) => (
                <motion.button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`p-4 rounded-2xl text-center transition-all duration-200 ${
                    selectedEmoji === emoji
                      ? 'bg-terracotta-500/20 border-2 border-terracotta-400 shadow-lg'
                      : 'bg-warm-charcoal-800/50 border-2 border-terracotta-500/20 hover:border-terracotta-400/50 hover:bg-terracotta-500/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-3xl mb-2">{emoji}</div>
                  <div className="text-sm font-medium text-warm-taupe-400">{label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center pt-4"
          >
            <motion.button
              type="submit"
              disabled={!moodText.trim() || !selectedEmoji || state.isLoading}
              className="bg-gradient-to-r from-terracotta-500 to-dusty-orange-500 text-warm-charcoal-900 px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {state.isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={24} />
                  <span>Submit</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}