import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Calendar, Filter, TrendingUp, Heart, Info } from 'lucide-react';

// Enhanced mood value mapping with more nuanced scoring
const moodValues = {
  '😊': 5,    // Happy - Very Positive
  '😐': 3,    // Neutral - Baseline
  '😞': 2,    // Sad - Below Baseline
  '😭': 1,    // Very Sad - Low
  '😠': 2.5,  // Angry - Slightly below baseline (anger can be energizing but negative)
};

// Helper function to get mood description
const getMoodDescription = (value: number): string => {
  if (value >= 4.5) return 'Very Positive';
  if (value >= 3.5) return 'Positive';
  if (value >= 2.5) return 'Neutral';
  if (value >= 1.5) return 'Below Average';
  return 'Needs Support';
};

// Helper function to get mood color
const getMoodColor = (value: number): string => {
  if (value >= 4.5) return 'text-terracotta-400';
  if (value >= 3.5) return 'text-dusty-orange-400';
  if (value >= 2.5) return 'text-warm-beige-400';
  if (value >= 1.5) return 'text-muted-sage-400';
  return 'text-warm-taupe-400';
};

export default function TrendsPage() {
  const { state } = useAppContext();
  const [timeFilter, setTimeFilter] = useState('week');
  const [showMoodInfo, setShowMoodInfo] = useState(false);

  const chartData = useMemo(() => {
    const now = new Date();
    const daysToShow = timeFilter === 'week' ? 7 : 30;
    const startDate = new Date(now.getTime() - (daysToShow * 24 * 60 * 60 * 1000));

    const filteredEntries = state.entries.filter(entry => 
      new Date(entry.date) >= startDate
    );

    const dailyMoods = new Map();
    
    // Initialize all days with null values
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMoods.set(dateStr, { moods: [], average: null });
    }

    // Collect all mood entries for each day
    filteredEntries.forEach(entry => {
      const date = new Date(entry.date);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const moodValue = moodValues[entry.emoji as keyof typeof moodValues] || 3;
      
      if (dailyMoods.has(dateStr)) {
        const dayData = dailyMoods.get(dateStr);
        dayData.moods.push(moodValue);
        // Calculate weighted average (more recent entries in the day have slightly more weight)
        const weights = dayData.moods.map((_, index) => 1 + (index * 0.1));
        const weightedSum = dayData.moods.reduce((sum, mood, index) => sum + (mood * weights[index]), 0);
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        dayData.average = weightedSum / totalWeight;
        dailyMoods.set(dateStr, dayData);
      }
    });

    return Array.from(dailyMoods.entries()).map(([date, data]) => ({
      date,
      mood: data.average,
      entryCount: data.moods.length,
    }));
  }, [state.entries, timeFilter]);

  const averageMood = useMemo(() => {
    const validMoods = chartData.filter(d => d.mood !== null).map(d => d.mood!);
    if (validMoods.length === 0) return 0;
    
    // Calculate weighted average based on recency (more recent days have more weight)
    const weights = validMoods.map((_, index) => 1 + (index * 0.05));
    const weightedSum = validMoods.reduce((sum, mood, index) => sum + (mood * weights[index]), 0);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    return weightedSum / totalWeight;
  }, [chartData]);

  const getMoodEmoji = (value: number) => {
    if (value >= 4.5) return '😊';
    if (value >= 3.5) return '😐';
    if (value >= 2.5) return '😞';
    if (value >= 1.5) return '😭';
    return '😠';
  };

  const moodTrend = useMemo(() => {
    const recentMoods = chartData.filter(d => d.mood !== null).slice(-3).map(d => d.mood!);
    if (recentMoods.length < 2) return 'stable';
    
    const firstHalf = recentMoods.slice(0, Math.ceil(recentMoods.length / 2));
    const secondHalf = recentMoods.slice(Math.ceil(recentMoods.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, mood) => sum + mood, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, mood) => sum + mood, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 0.3) return 'improving';
    if (difference < -0.3) return 'declining';
    return 'stable';
  }, [chartData]);

  const getTrendIcon = () => {
    switch (moodTrend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  const getTrendMessage = () => {
    switch (moodTrend) {
      case 'improving': return 'Your mood has been trending upward recently. Keep up the great work!';
      case 'declining': return 'Your mood has been lower lately. Remember to be gentle with yourself and consider reaching out for support.';
      default: return 'Your mood has been relatively stable. Consistency is a sign of emotional balance.';
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
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-soft-cream-500 mb-4">
          Your Mood Journey
        </h1>
        <p className="text-warm-taupe-400 text-lg">
          Track your emotional well-being over time
        </p>
      </motion.div>

      {state.entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center py-16"
        >
          <Heart size={48} className="text-terracotta-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-warm-taupe-400 mb-2">
            No entries yet
          </h2>
          <p className="text-warm-taupe-500">
            Start by checking in with your mood to see trends here
          </p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-warm-charcoal-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-terracotta-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-soft-cream-500">Total Entries</h3>
                <Calendar size={20} className="text-terracotta-400" />
              </div>
              <div className="text-3xl font-bold text-terracotta-400">
                {state.entries.length}
              </div>
            </div>

            <div className="bg-warm-charcoal-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-terracotta-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-soft-cream-500">Average Mood</h3>
                <button
                  onClick={() => setShowMoodInfo(!showMoodInfo)}
                  className="text-dusty-orange-400 hover:text-dusty-orange-300 transition-colors"
                >
                  <Info size={20} />
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{getMoodEmoji(averageMood)}</div>
                <div className="flex flex-col">
                  <div className={`text-2xl font-bold ${getMoodColor(averageMood)}`}>
                    {averageMood.toFixed(1)}
                  </div>
                  <div className="text-xs text-warm-taupe-400">
                    {getMoodDescription(averageMood)}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-warm-charcoal-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-terracotta-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-soft-cream-500">Recent Trend</h3>
                <TrendingUp size={20} className="text-warm-beige-400" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getTrendIcon()}</div>
                <div className="text-sm text-warm-taupe-300 capitalize">
                  {moodTrend}
                </div>
              </div>
            </div>

            <div className="bg-warm-charcoal-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-terracotta-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-soft-cream-500">Latest Entry</h3>
                <Heart size={20} className="text-warm-beige-400" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{state.entries[state.entries.length - 1]?.emoji}</div>
                <div className="text-sm text-warm-taupe-400">
                  {state.entries[state.entries.length - 1] && 
                    new Date(state.entries[state.entries.length - 1].date).toLocaleDateString()
                  }
                </div>
              </div>
            </div>
          </motion.div>

          {showMoodInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-dusty-orange-500/20 to-warm-beige-500/20 rounded-2xl p-6 shadow-lg border border-dusty-orange-400/30 mb-8"
            >
              <h4 className="text-lg font-semibold text-soft-cream-500 mb-4">How Average Mood is Calculated</h4>
              <div className="space-y-2 text-warm-taupe-300">
                <p>• Each emoji has a numerical value: 😊 (5), 😐 (3), 😞 (2), 😭 (1), 😠 (2.5)</p>
                <p>• Multiple entries per day are weighted, with later entries having slightly more influence</p>
                <p>• Recent days have more weight in the overall average to reflect your current state</p>
                <p>• The trend shows whether your mood has been improving, declining, or stable recently</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-warm-charcoal-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-terracotta-500/20 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-soft-cream-500">Mood Trends</h3>
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-warm-taupe-400" />
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-warm-charcoal-700 border border-terracotta-500/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400 text-soft-cream-500"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                </select>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#C9B99B" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#C9B99B"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[1, 5]}
                    stroke="#C9B99B"
                    fontSize={12}
                    tickFormatter={(value) => getMoodEmoji(value)}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload[0]) {
                        const value = payload[0].value as number;
                        const entryCount = payload[0].payload.entryCount;
                        return (
                          <div className="bg-warm-charcoal-800 p-3 rounded-lg shadow-lg border border-terracotta-500/30">
                            <p className="font-semibold text-soft-cream-500">{label}</p>
                            <p className="text-terracotta-400">
                              Mood: {getMoodEmoji(value)} ({value.toFixed(1)})
                            </p>
                            <p className="text-warm-taupe-400 text-sm">
                              {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
                            </p>
                            <p className="text-warm-taupe-400 text-sm">
                              {getMoodDescription(value)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#E8956B" 
                    strokeWidth={3}
                    dot={{ fill: '#E8956B', strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-warm-beige-500/20 to-dusty-orange-500/20 rounded-2xl p-6 shadow-lg border border-warm-beige-400/30 mb-8"
          >
            <h3 className="text-xl font-semibold text-soft-cream-500 mb-4">Mood Insights</h3>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{getTrendIcon()}</div>
              <p className="text-warm-taupe-300 leading-relaxed">
                {getTrendMessage()}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-warm-charcoal-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-terracotta-500/20"
          >
            <h3 className="text-xl font-semibold text-soft-cream-500 mb-4">Recent Entries</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {state.entries.slice(-5).reverse().map((entry) => (
                <div key={entry.id} className="flex items-start space-x-4 p-3 bg-warm-charcoal-700/50 rounded-xl">
                  <div className="text-2xl">{entry.emoji}</div>
                  <div className="flex-1">
                    <div className="text-sm text-warm-taupe-400 mb-1">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <p className="text-warm-taupe-300 line-clamp-2">{entry.mood}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}