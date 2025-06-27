import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIResponse {
  response: string;
  affirmation: string;
  source?: 'gemini' | 'fallback';
}

// Initialize Gemini AI
let genAI: GoogleGenerativeAI | null = null;

function initializeGemini(): GoogleGenerativeAI | null {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('🔑 Gemini API key not found. Using fallback responses.');
    return null;
  }

  if (!apiKey.startsWith('AIza')) {
    console.warn('⚠️ Gemini API key format appears incorrect. Expected format: AIzaSy...');
    return null;
  }

  try {
    console.log('🚀 Initializing Gemini AI...');
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error);
    return null;
  }
}

export async function generateAIResponse(moodText: string): Promise<AIResponse> {
  console.log('🧠 Generating AI response for mood:', moodText.substring(0, 50) + '...');
  
  // Initialize Gemini if not already done
  if (!genAI) {
    genAI = initializeGemini();
  }

  // Use fallback if Gemini is not available
  if (!genAI) {
    console.log('📝 Using fallback response system');
    return { ...getFallbackResponse(moodText), source: 'fallback' };
  }

  try {
    console.log('🔄 Calling Gemini API...');
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.8, // Increased for more warmth and personality
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 300, // Increased for more comprehensive responses
      },
    });

    // Enhanced therapist buddy prompt
    const responsePrompt = `You are MindEase, a warm, compassionate, and wise mental health companion who acts like a caring friend and therapist buddy. A user has shared their feelings with you.

Your role:
- Be genuinely empathetic and understanding, like a close friend who truly cares
- Validate their emotions completely - all feelings are valid
- Offer gentle, practical guidance without being preachy
- Use warm, conversational language that feels personal and caring
- Show that you truly understand what they're going through
- Provide hope and perspective while acknowledging their current reality
- Be supportive but not overly clinical or formal
- Make them feel heard, understood, and less alone

IMPORTANT: 
- Do NOT ask follow-up questions
- Do NOT suggest they seek professional help unless they mention serious concerns
- Focus on providing comfort, validation, and gentle guidance
- Keep response to 5-6 sentences maximum
- Make it feel like a caring friend is talking to them

User's feelings: "${moodText}"

Respond as their caring therapist buddy:`;

    const responseResult = await model.generateContent(responsePrompt);
    const responseText = responseResult.response.text();
    console.log('✅ Received guidance from Gemini');

    // Enhanced affirmation prompt
    const affirmationPrompt = `Based on someone feeling: "${moodText}"

Create a powerful, personalized daily affirmation that will uplift and empower them. This should feel like something a wise, caring friend would say to help them feel stronger.

Guidelines:
- Start with "I am" or "I" to make it personal and empowering
- Make it specific to their emotional state, not generic
- Keep it under 35 words but make every word count
- Focus on their inner strength, resilience, or inherent worth
- Make it feel authentic and meaningful, not like a generic quote
- Should feel empowering and help them see their own strength

Create the affirmation:`;

    const affirmationResult = await model.generateContent(affirmationPrompt);
    const affirmationText = affirmationResult.response.text();
    console.log('✅ Received affirmation from Gemini');

    const result = {
      response: responseText.trim(),
      affirmation: affirmationText.trim().replace(/^["']|["']$/g, ''), // Remove quotes if present
      source: 'gemini' as const
    };

    console.log('🎉 Successfully generated AI response using Gemini API');
    return result;

  } catch (error) {
    console.error('❌ Error calling Gemini API:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        console.error('🔑 Invalid Gemini API key. Please check your API key.');
      } else if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
        console.warn('📊 Gemini API quota exceeded. Using fallback responses.');
      } else if (error.message.includes('rate') || error.message.includes('RATE_LIMIT_EXCEEDED')) {
        console.warn('⏱️ Gemini API rate limit reached. Using fallback responses.');
      } else if (error.message.includes('PERMISSION_DENIED')) {
        console.error('🚫 Permission denied. Check API key permissions.');
      } else if (error.message.includes('SAFETY')) {
        console.warn('🛡️ Content filtered by Gemini safety settings. Using fallback.');
      } else if (error.message.includes('model') || error.message.includes('MODEL_NOT_FOUND')) {
        console.warn('🤖 Model not available. Trying fallback model...');
        return await tryFallbackModel(moodText);
      } else {
        console.error('🔧 Unexpected Gemini API error:', error.message);
      }
    }
    
    console.log('📝 Falling back to local response system');
    return { ...getFallbackResponse(moodText), source: 'fallback' };
  }
}

// Fallback to older model if primary is not available
async function tryFallbackModel(moodText: string): Promise<AIResponse> {
  if (!genAI) return { ...getFallbackResponse(moodText), source: 'fallback' };

  try {
    console.log('🔄 Trying fallback model: gemini-1.5-pro...');
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-pro',
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 250,
      },
    });

    const responsePrompt = `You are MindEase, a compassionate therapist buddy. A user shared: "${moodText}". Respond with warmth, empathy, and gentle guidance in 5-6 sentences. Validate their feelings and provide comfort like a caring friend would. Don't ask follow-up questions.`;
    
    const affirmationPrompt = `Create a personal, empowering affirmation starting with "I" for someone feeling: "${moodText}". Make it specific to their situation and under 35 words.`;

    const [responseResult, affirmationResult] = await Promise.all([
      model.generateContent(responsePrompt),
      model.generateContent(affirmationPrompt)
    ]);

    console.log('✅ Successfully used fallback model');
    
    return {
      response: responseResult.response.text().trim(),
      affirmation: affirmationResult.response.text().trim().replace(/^["']|["']$/g, ''),
      source: 'gemini' as const
    };

  } catch (error) {
    console.error('❌ Fallback model also failed:', error);
    return { ...getFallbackResponse(moodText), source: 'fallback' };
  }
}

// Test function to verify API connection
export async function testGeminiConnection(): Promise<{ success: boolean; message: string }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return { success: false, message: 'No API key found' };
  }

  if (!apiKey.startsWith('AIza')) {
    return { success: false, message: 'Invalid API key format' };
  }

  try {
    console.log('🧪 Testing Gemini connection...');
    const testGenAI = new GoogleGenerativeAI(apiKey);
    
    // Try primary model first
    try {
      const model = testGenAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent('Hello, this is a test. Please respond with "Gemini Flash connection successful"');
      const response = result.response.text();
      
      if (response) {
        console.log('✅ Gemini 1.5 Flash test successful');
        return { success: true, message: 'Gemini 1.5 Flash API connection successful!' };
      }
    } catch (flashError) {
      console.log('⚠️ Gemini 1.5 Flash not available, trying Pro...');
      
      // Try Pro model
      const model = testGenAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent('Hello, this is a test. Please respond with "Gemini Pro connection successful"');
      const response = result.response.text();
      
      if (response) {
        console.log('✅ Gemini 1.5 Pro test successful');
        return { success: true, message: 'Gemini 1.5 Pro API connection successful!' };
      }
    }
    
    return { success: false, message: 'Empty response from Gemini' };
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Enhanced mood detection with more comprehensive keyword matching
function detectMoodCategory(text: string): string {
  const lowerText = text.toLowerCase();
  
  // Sad/Down keywords
  const sadKeywords = ['sad', 'down', 'depressed', 'blue', 'low', 'empty', 'hopeless', 'lonely', 'hurt', 'crying', 'tears', 'grief', 'loss', 'disappointed', 'discouraged', 'heartbroken', 'devastated'];
  if (sadKeywords.some(keyword => lowerText.includes(keyword))) return 'sad';
  
  // Anxious/Worried keywords
  const anxiousKeywords = ['anxious', 'worried', 'stressed', 'nervous', 'panic', 'overwhelmed', 'tense', 'restless', 'uneasy', 'fearful', 'scared', 'afraid', 'concerned', 'troubled', 'frantic', 'jittery'];
  if (anxiousKeywords.some(keyword => lowerText.includes(keyword))) return 'anxious';
  
  // Angry/Frustrated keywords
  const angryKeywords = ['angry', 'frustrated', 'mad', 'furious', 'irritated', 'annoyed', 'rage', 'upset', 'pissed', 'livid', 'bitter', 'resentful', 'hostile', 'outraged', 'infuriated'];
  if (angryKeywords.some(keyword => lowerText.includes(keyword))) return 'angry';
  
  // Happy/Positive keywords
  const happyKeywords = ['happy', 'good', 'great', 'excited', 'joy', 'cheerful', 'content', 'pleased', 'delighted', 'thrilled', 'amazing', 'wonderful', 'fantastic', 'awesome', 'grateful', 'blessed', 'elated', 'euphoric'];
  if (happyKeywords.some(keyword => lowerText.includes(keyword))) return 'happy';
  
  // Tired/Exhausted keywords
  const tiredKeywords = ['tired', 'exhausted', 'drained', 'weary', 'fatigued', 'worn out', 'sleepy', 'burnt out', 'depleted', 'lethargic', 'sluggish'];
  if (tiredKeywords.some(keyword => lowerText.includes(keyword))) return 'tired';
  
  // Confused/Lost keywords
  const confusedKeywords = ['confused', 'lost', 'uncertain', 'unclear', 'mixed up', 'puzzled', 'bewildered', 'unsure', 'conflicted', 'perplexed', 'disoriented'];
  if (confusedKeywords.some(keyword => lowerText.includes(keyword))) return 'confused';

  // Excited/Energetic keywords
  const excitedKeywords = ['excited', 'energetic', 'pumped', 'motivated', 'inspired', 'enthusiastic', 'vibrant', 'alive', 'invigorated'];
  if (excitedKeywords.some(keyword => lowerText.includes(keyword))) return 'excited';

  // Peaceful/Calm keywords
  const peacefulKeywords = ['peaceful', 'calm', 'serene', 'tranquil', 'relaxed', 'centered', 'balanced', 'zen', 'mindful'];
  if (peacefulKeywords.some(keyword => lowerText.includes(keyword))) return 'peaceful';
  
  return 'neutral';
}

function getFallbackResponse(moodText: string): AIResponse {
  const moodCategory = detectMoodCategory(moodText);
  
  // Enhanced therapist buddy fallback responses
  const responses = {
    sad: [
      {
        response: "I can really feel the weight of what you're carrying right now, and I want you to know that your sadness is completely valid. It takes so much courage to acknowledge these feelings, and that courage tells me you have the strength to work through this. You're not alone in this moment, and while it feels heavy now, I believe in your ability to find your way through.",
        affirmation: "I am brave enough to feel deeply, and my sadness is proof of my capacity to love and heal."
      },
      {
        response: "Your heart is speaking through this sadness, and I hear every word. What you're feeling right now is so human and real, and there's nothing wrong with sitting in this space for a while. You don't have to rush through this or pretend to be okay. I'm here with you in this moment, and I believe this difficult chapter will eventually lead to something meaningful.",
        affirmation: "I honor my emotions and trust that my heart knows how to heal itself in its own time."
      },
      {
        response: "I can sense how much pain you're in right now, and I wish I could take some of that weight off your shoulders. Your sadness doesn't make you weak—it shows how deeply you care and how much heart you have. This feeling won't last forever, even though it feels overwhelming right now. You're stronger than you know, and you're going to get through this.",
        affirmation: "I am resilient beyond measure, and my sadness is temporary but my strength is permanent."
      }
    ],
    anxious: [
      {
        response: "I can feel how your mind is racing right now, and I want you to know that what you're experiencing is so understandable. Anxiety has this way of making everything feel urgent and scary, but you're actually safe in this moment. You've gotten through anxious feelings before, and you have everything within you to navigate through this too. Take a deep breath with me—you've got this.",
        affirmation: "I am safe in this moment, and I have the power to calm my mind and trust my inner wisdom."
      },
      {
        response: "Your anxiety is trying to protect you, even though it doesn't feel helpful right now. I can hear how overwhelming everything feels, and that's completely valid. Remember that most of our worries never actually happen, and you're much more capable of handling uncertainty than your anxious mind wants you to believe. You're going to be okay, one breath at a time.",
        affirmation: "I breathe deeply and release control, trusting that I can handle whatever life brings my way."
      },
      {
        response: "I can feel the storm of worry swirling in your mind, and I want to remind you that storms always pass. Your anxiety is loud right now, but it's not the truth about your situation or your capabilities. Focus on what's real and present in this moment—your breath, your heartbeat, the ground beneath your feet. You're more grounded than you feel right now.",
        affirmation: "I am anchored in the present moment and trust in my ability to navigate through uncertainty with grace."
      }
    ],
    angry: [
      {
        response: "I can feel the fire in your words, and I want you to know that your anger is completely valid. Something important to you has been affected, and that fury you're feeling is your heart's way of saying 'this matters.' You have every right to feel this way, and you also have the wisdom to channel this powerful energy in a way that serves you. Your anger is information—listen to what it's telling you.",
        affirmation: "I honor my anger as a messenger of my values and choose to respond with both strength and wisdom."
      },
      {
        response: "Your frustration is so understandable, and I can hear how much this situation has affected you. Anger often shows up when our boundaries have been crossed or when we feel powerless, and both of those feelings are completely human. You don't have to suppress this energy—just remember that you get to choose how you use it. You have more power than you realize right now.",
        affirmation: "I feel my anger fully and transform its energy into positive action that aligns with my values."
      },
      {
        response: "I can sense the intensity of what you're going through, and your anger makes perfect sense given the situation. Sometimes anger is our soul's way of protecting something precious within us. While these feelings are completely valid, I also see your strength and your ability to respond thoughtfully rather than just react. You have the power to turn this fire into fuel for positive change.",
        affirmation: "I channel my passionate energy into creating the change I want to see in my life and world."
      }
    ],
    happy: [
      {
        response: "Your joy is absolutely contagious, and I'm so happy to feel this beautiful energy radiating from you! This happiness you're experiencing is a gift—not just to yourself, but to everyone whose life you touch. You deserve every bit of this wonderful feeling, and I hope you take a moment to really soak it in and celebrate what's bringing you such joy.",
        affirmation: "I deserve this happiness and allow myself to fully embrace and share the joy that flows through me."
      },
      {
        response: "I can feel your happiness shining through every word, and it's absolutely beautiful! This joy you're experiencing is like sunshine—it has the power to brighten not just your own day, but the days of everyone around you. You're creating something wonderful in your life right now, and that's something to be truly proud of. Keep embracing this amazing energy!",
        affirmation: "I am a beacon of joy and positivity, creating ripples of happiness wherever I go."
      },
      {
        response: "Your excitement and happiness are so infectious—I can't help but smile reading your words! This wonderful feeling you're having is a reflection of all the good you're creating and attracting in your life. You're in such a beautiful space right now, and I hope you remember this feeling during any challenging moments that might come. You deserve all this joy and more!",
        affirmation: "I am worthy of boundless joy and choose to cultivate happiness in every corner of my life."
      }
    ],
    tired: [
      {
        response: "I can hear the exhaustion in your words, and I want you to know that feeling this drained is your body and soul asking for some tender care. You've been carrying so much, and it's completely understandable that you're feeling worn down. Rest isn't selfish—it's necessary. You don't have to push through everything, and it's okay to slow down and honor what you need right now.",
        affirmation: "I give myself permission to rest deeply, knowing that caring for myself is an act of wisdom and love."
      },
      {
        response: "Your tiredness is so valid, especially when life keeps asking so much of you. I can feel how much you've been giving to everyone and everything around you, and now it's time to give some of that care back to yourself. You're allowed to set boundaries, say no to things that drain you, and prioritize your own energy. You matter too.",
        affirmation: "I honor my need for rest and trust that taking care of myself allows me to show up better for what I love."
      },
      {
        response: "I can sense how depleted you're feeling right now, and I want to wrap you in the biggest, most comforting hug. Sometimes our exhaustion is our body's way of saying 'pause, breathe, restore.' You've been so strong for so long, and now it's time to be gentle with yourself. This tiredness is temporary, but your wellbeing is forever important.",
        affirmation: "I listen to my body's wisdom and give myself the rest and restoration I need to thrive."
      }
    ],
    confused: [
      {
        response: "I can feel the uncertainty swirling around you right now, and I want you to know that feeling confused is often a sign that you're on the edge of understanding something new about yourself or your situation. It's completely okay not to have all the answers right now. Sometimes the most important thing is to be patient with yourself while you figure things out, one small step at a time.",
        affirmation: "I embrace uncertainty as a space of possibility and trust that clarity will come when I need it most."
      },
      {
        response: "Your confusion makes so much sense, especially when you're dealing with complex emotions or situations. Sometimes our hearts and minds need time to process everything that's happening, and that's perfectly human. You don't have to force clarity or have it all figured out right now. Trust that you have the wisdom within you to navigate through this unclear space.",
        affirmation: "I am comfortable with not knowing and trust in my ability to find my way through uncertainty with patience."
      },
      {
        response: "I can hear how mixed up everything feels right now, and that's such a normal part of being human, especially when we're growing or facing something new. Confusion often means we're processing something important, and that's actually a sign of growth. Give yourself permission to sit with the questions for a while—sometimes the best answers come when we stop forcing them.",
        affirmation: "I trust the process of discovery and know that confusion is often the doorway to deeper understanding."
      }
    ],
    excited: [
      {
        response: "Your excitement is absolutely electric, and I can feel that amazing energy radiating from every word! This enthusiasm you're experiencing is such a beautiful reflection of your passion and zest for life. There's something so powerful about excitement—it connects us to our dreams and reminds us of what's truly possible. Embrace this incredible feeling and let it propel you toward whatever is calling to your heart!",
        affirmation: "I channel my excitement into inspired action and trust in my ability to manifest my wildest dreams."
      },
      {
        response: "I can feel your vibrant energy through the screen, and it's absolutely contagious! This excitement you're feeling is your inner spark shining at its brightest, and it's a clear sign that you're aligned with something that truly matters to you. This feeling is precious—hold onto it and let it be your guide as you step boldly into whatever adventure awaits you.",
        affirmation: "I embrace my excitement as my soul's compass, pointing me toward what brings me most alive."
      },
      {
        response: "Your excitement is like fireworks going off, and I'm here for every single spark! This incredible energy you're experiencing is your life force saying 'YES!' to something amazing. There's nothing quite like the feeling of being genuinely excited about something—it's pure magic. Let this enthusiasm fuel your dreams and inspire you to take those bold steps your heart is calling for.",
        affirmation: "I honor my excitement as sacred energy and use it to create positive change in my life and beyond."
      }
    ],
    peaceful: [
      {
        response: "I can feel the beautiful calm radiating from your words, and it's like a gentle breeze that soothes everything around it. This peace you're experiencing is such a precious gift—both to yourself and to everyone whose life you touch. There's something so powerful about inner tranquility; it's not just the absence of chaos, but the presence of deep harmony. You've found something truly valuable in this moment.",
        affirmation: "I am a source of peace and carry this tranquil energy with me, creating calm wherever I go."
      },
      {
        response: "Your sense of serenity is absolutely beautiful, and I can feel how centered and grounded you are right now. This peaceful feeling you're experiencing is a reflection of your inner wisdom and your ability to find balance even when life gets complex. Cherish this moment of calm—it's a reminder that this peace always exists within you, even during the stormiest times.",
        affirmation: "I cultivate inner peace and trust that this calm center within me is always accessible, no matter what comes."
      },
      {
        response: "The tranquility in your words is like a warm, comforting embrace, and I'm so glad you're experiencing this beautiful state of peace. This feeling of calm and centeredness is actually your most natural state—it's who you are beneath all the noise and busyness of daily life. Let this peace anchor you and remind you that you can always return to this place of serenity whenever you need it.",
        affirmation: "I am peace itself, and I carry this serene energy into every moment, creating harmony in all I do."
      }
    ],
    neutral: [
      {
        response: "Thank you for taking this moment to check in with yourself—that simple act of self-awareness is such a beautiful gift you're giving to your own wellbeing. Sometimes our feelings are complex and don't fit into neat categories, and that's perfectly okay. Whatever you're experiencing right now is completely valid, and I want you to know that you have the strength and wisdom to navigate through anything that comes your way.",
        affirmation: "I honor the complexity of my emotions and trust in my ability to understand and care for myself with compassion."
      },
      {
        response: "I really appreciate you sharing this moment of reflection with me. The fact that you're taking time to tune into your inner world shows incredible self-compassion and wisdom. Whether you're feeling neutral, experiencing mixed emotions, or something that's hard to put into words, all of it is part of your beautiful, unique human experience. You're exactly where you need to be right now.",
        affirmation: "I embrace all aspects of my emotional journey and trust in my process of self-discovery and growth."
      },
      {
        response: "Your willingness to pause and reflect on how you're feeling shows such beautiful self-awareness and care. Sometimes the most profound moments come not from intense emotions, but from these quieter spaces of contemplation and presence. There's wisdom in taking time to simply be with yourself, and I want you to know that whatever you're experiencing right now is perfectly valid and important.",
        affirmation: "I trust in the wisdom of this moment and know that I am exactly where I need to be in my journey."
      }
    ]
  };

  // Select a random response from the appropriate category
  const categoryResponses = responses[moodCategory as keyof typeof responses] || responses.neutral;
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  
  return categoryResponses[randomIndex];
}