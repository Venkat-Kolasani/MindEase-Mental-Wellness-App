import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  response?: string;
  affirmation?: string;
}

interface AppState {
  currentMood: string;
  currentEmoji: string;
  aiResponse: string;
  aiAffirmation: string;
  entries: MoodEntry[];
  isLoading: boolean;
}

type AppAction = 
  | { type: 'SET_MOOD'; payload: { mood: string; emoji: string } }
  | { type: 'SET_AI_RESPONSE'; payload: { response: string; affirmation: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_ENTRIES'; payload: MoodEntry[] }
  | { type: 'ADD_ENTRY'; payload: MoodEntry };

const initialState: AppState = {
  currentMood: '',
  currentEmoji: '',
  aiResponse: '',
  aiAffirmation: '',
  entries: [],
  isLoading: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MOOD':
      return {
        ...state,
        currentMood: action.payload.mood,
        currentEmoji: action.payload.emoji,
      };
    case 'SET_AI_RESPONSE':
      return {
        ...state,
        aiResponse: action.payload.response,
        aiAffirmation: action.payload.affirmation,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'LOAD_ENTRIES':
      return {
        ...state,
        entries: action.payload,
      };
    case 'ADD_ENTRY':
      return {
        ...state,
        entries: [...state.entries, action.payload],
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load entries from localStorage on mount
  React.useEffect(() => {
    const savedEntries = localStorage.getItem('mindease-entries');
    if (savedEntries) {
      dispatch({ type: 'LOAD_ENTRIES', payload: JSON.parse(savedEntries) });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}