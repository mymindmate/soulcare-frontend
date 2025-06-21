export type StressLevel = 'low' | 'medium' | 'high';
export type AdvisorMode = 'default' | 'academic' | 'calming' | 'motivational' | 'mindfulness';

export interface ChatbotResponse {
  type: 'general' | 'sleep' | 'time-management' | 'anxiety' | 'self-care' | 'greeting';
  responses: Record<StressLevel, string[]>;
}

export interface AdvisorPersonality {
  name: string;
  description: string;
  icon: string;
  color: string;
  responseStyle: string;
  greeting: string;
}

export const chatbotResponses: Record<string, ChatbotResponse> = {
  greeting: {
    type: 'greeting',
    responses: {
      low: [
        "Hi there! I'm your AI Wellness Advisor. Based on your assessment, you're experiencing low levels of stress, which is great! How can I help you maintain this positive state?",
        "Hello! I see your stress levels are low - that's excellent! I'm here to help you maintain this balance. What would you like to discuss today?"
      ],
      medium: [
        "Hi there! I'm your AI Wellness Advisor. Based on your stress assessment, I've noticed you're experiencing a medium level of stress. How can I help you today?",
        "Hello! Thanks for completing the assessment. You're showing moderate stress levels, which is common among students. What specific area would you like support with today?"
      ],
      high: [
        "Hi there! I'm your AI Wellness Advisor. I can see from your assessment that you're experiencing high levels of stress right now. I'm here to help - what's your biggest concern at the moment?",
        "Hello! I notice from your assessment that you're going through a challenging time with high stress levels. I'd like to help you find some relief. What's troubling you the most right now?"
      ]
    }
  },
  sleep: {
    type: 'sleep',
    responses: {
      low: [
        "Your sleep patterns seem healthy! To maintain good sleep, try to keep a consistent schedule and limit screen time before bed. Is there anything specific about your sleep you'd like to improve?",
        "Great job maintaining healthy sleep habits! Remember that good sleep is foundational to managing stress. Consider creating a relaxing bedtime routine to ensure your good habits continue."
      ],
      medium: [
        "Sleep issues before exams are common. Have you tried creating a bedtime routine to help signal your body it's time to rest? Things like reducing screen time, light stretching, or reading a non-school book can help.",
        "For better sleep, try the 4-7-8 breathing technique when you get into bed: inhale for 4 seconds, hold for 7, exhale for 8. This can help calm your nervous system and prepare for rest."
      ],
      high: [
        "I see you're having significant sleep challenges. This is common with high stress. Try creating a strict sleep schedule - go to bed and wake up at the same time every day, even on weekends. Also, write down your worries before bed to get them out of your head.",
        "For severe sleep problems, consider guided sleep meditations - there are many free ones online. Keep your room cool, dark, and quiet. If sleep issues persist for more than 2 weeks, it's worth talking to a healthcare provider."
      ]
    }
  },
  "time-management": {
    type: 'time-management',
    responses: {
      low: [
        "Your time management skills seem strong! To maintain this, try using digital tools to stay organized and consider block scheduling for challenging tasks. What works best for you currently?",
        "Great job balancing your time! One tip to maintain this is to regularly review and adjust your system. Even good systems need occasional updates as your workload changes."
      ],
      medium: [
        "For better time management, try the Pomodoro Technique - work for 25 minutes, then take a 5-minute break. After four cycles, take a longer 15-30 minute break. This helps maintain focus while preventing burnout.",
        "Creating a priority matrix can help with time management. Divide tasks into four categories: Urgent & Important, Important but Not Urgent, Urgent but Not Important, and Neither. Focus on the first two categories."
      ],
      high: [
        "When feeling overwhelmed, the 1-3-5 rule can help: aim to accomplish one big thing, three medium things, and five small things each day. This provides structure while being realistic about your capacity.",
        "High stress often comes from feeling behind. Try timeboxing - allocate specific time blocks for certain tasks and stick to them. When the time is up, move on. This prevents any one task from consuming all your energy."
      ]
    }
  },
  anxiety: {
    type: 'anxiety',
    responses: {
      low: [
        "You're managing anxiety well! Remember that a small amount of stress can actually be motivating. Continue with regular exercise and relaxation techniques to maintain this balance.",
        "To maintain your low anxiety levels, regular mindfulness practice can be helpful, even if it's just 5 minutes a day. This builds your resilience for more stressful periods."
      ],
      medium: [
        "When anxiety starts rising, try the 5-4-3-2-1 grounding technique: identify 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
        "Academic anxiety often comes from uncertainty. Break large assignments into smaller, well-defined tasks. Completing each small task gives you a sense of progress and control."
      ],
      high: [
        "For intense anxiety, try this quick technique: breathe in while counting to 4, hold for 1 second, then exhale for 6 seconds. This extended exhale helps activate your parasympathetic nervous system to calm anxiety.",
        "High anxiety can create a cycle of negative thoughts. Try to identify and challenge these thoughts. Ask yourself: What's the evidence? Is there another way to look at this? What would I tell a friend in this situation?"
      ]
    }
  },
  "self-care": {
    type: 'self-care',
    responses: {
      low: [
        "You're taking good care of yourself! To continue, make sure to schedule regular activities you enjoy - even during busy periods. What self-care activities do you find most rejuvenating?",
        "Great job prioritizing your wellbeing! Remember that self-care isn't just relaxation - it also includes setting boundaries and saying no when necessary to protect your energy."
      ],
      medium: [
        "Self-care doesn't have to be time-consuming. Even micro-breaks (2-3 minutes) to stretch, breathe deeply, or step outside can help reset your nervous system during study sessions.",
        "For moderate stress levels, try incorporating one small self-care activity daily - like a 10-minute walk, journaling, or calling a supportive friend. Consistency is more important than duration."
      ],
      high: [
        "When stress is high, self-care becomes essential, not optional. Identify your basic needs: Are you eating regularly? Drinking enough water? Getting any movement? Start with these foundations.",
        "With high stress levels, it's critical to reach out for support - whether to friends, family, or campus resources. Sharing your burden can provide both emotional relief and practical help."
      ]
    }
  },
  general: {
    type: 'general',
    responses: {
      low: [
        "Your stress management is working well! To maintain this, continue with regular exercise, good sleep habits, and social connections. Is there any specific area you'd like to enhance further?",
        "You're doing a great job keeping stress in check. Remember that preventing stress is easier than reducing it once it builds up. Regular check-ins with yourself can help maintain this balance."
      ],
      medium: [
        "Managing moderate stress effectively means balancing academics with self-care. Are you building breaks into your study schedule? Even short breaks can improve focus and reduce stress levels.",
        "With moderate stress levels, it's useful to identify your specific triggers. Once you know what causes your stress to increase, you can develop targeted strategies to address those particular situations."
      ],
      high: [
        "When dealing with high stress, prioritize what truly needs your attention right now. Can any tasks be delegated, delayed, or dropped? Remember, your wellbeing is a prerequisite for academic success.",
        "High stress levels often benefit from a multi-faceted approach: physical strategies (exercise, deep breathing), mental strategies (challenging negative thoughts), and social strategies (connecting with supportive people)."
      ]
    }
  }
};

export const suggestions = [
  "Help with exam anxiety",
  "Time management tips",
  "Relaxation techniques",
  "Sleep improvement",
  "Concentration problems",
  "Balancing school and life"
];

export const advisorPersonalities: Record<AdvisorMode, AdvisorPersonality> = {
  default: {
    name: "Balanced Advisor",
    description: "A supportive guide balanced in all aspects of wellness advice",
    icon: "✨",
    color: "#7c3aed", // purple
    responseStyle: "Provides a balanced approach to wellness with both practical tips and emotional support.",
    greeting: "Hi there! I'm your friendly Wellness Advisor. I blend practical advice with emotional support to help you thrive. How can I support your wellbeing today?"
  },
  academic: {
    name: "Academic Coach",
    description: "Focused on productivity, study skills, and academic performance",
    icon: "📚",
    color: "#0ea5e9", // blue
    responseStyle: "Direct and structured advice focused on academic performance, productivity, and goal achievement.",
    greeting: "**Academic Coach initialized.**\n\nI'm here to optimize your academic performance through structured approaches and evidence-based techniques. My analysis shows students improve 27% with proper study systems.\n\n**Initial recommendations:**\n- Identify your top 3 academic challenges\n- Establish metrics for success\n- Implement time-blocking methodology\n\nWhat specific academic challenge shall we address first?"
  },
  calming: {
    name: "Comfort Companion",
    description: "Specializes in soothing anxiety, depression, and emotional distress",
    icon: "🌸",
    color: "#ec4899", // pink
    responseStyle: "Gentle, compassionate responses aimed at providing emotional comfort and reducing distress.",
    greeting: "Hi there, friend. I'm so glad you're here. 💗\n\nI want you to know that whatever you're feeling right now is completely valid. Life can be really challenging sometimes, and it's okay to struggle.\n\nI'm here to listen without judgment, to comfort you when things feel overwhelming, and to remind you of your inner strength when you forget.\n\nWould you like to tell me a bit about what's on your mind today?"
  },
  motivational: {
    name: "Motivation Coach",
    description: "Energetic encouragement to build resilience and overcome challenges",
    icon: "🔥",
    color: "#f97316", // orange
    responseStyle: "Energetic, encouraging responses focused on building confidence and overcoming obstacles.",
    greeting: "HEY THERE, CHAMPION! 🔥\n\nI'm your Motivation Coach and I'm PUMPED to be working with you today! I can already tell you've got what it takes to CRUSH your goals and overcome ANY obstacle in your way!\n\nRemember: what stands between you and your greatest achievements is the DECISION to START and the COMMITMENT to NEVER GIVE UP!\n\nSo what challenge are we DEMOLISHING today? Let's MAKE IT HAPPEN!"
  },
  mindfulness: {
    name: "Mindfulness Guide",
    description: "Focused on present-moment awareness and contemplative practices",
    icon: "🧘",
    color: "#10b981", // green
    responseStyle: "Calm, measured responses that encourage presence, reflection, and mindful engagement with challenges.",
    greeting: "*Take a deep breath in... and out...*\n\nWelcome to this moment—the only moment that truly exists.\n\nI'm your Mindfulness Guide, here to help you cultivate awareness of your present experience without judgment or attachment.\n\nAs we begin, I invite you to notice the sensation of your body sitting or standing, the rhythm of your breath, and the thoughts arising and passing in your awareness.\n\nWhat aspect of mindful living would you like to explore today?"
  }
};

export function getResponsesByTopic(topic: string, stressLevel: StressLevel): string[] {
  // Check if the topic exists, fallback to general if not
  const responseCategory = chatbotResponses[topic] || chatbotResponses.general;
  return responseCategory.responses[stressLevel];
}

export function getRandomResponse(topic: string, stressLevel: StressLevel): string {
  const responses = getResponsesByTopic(topic, stressLevel);
  return responses[Math.floor(Math.random() * responses.length)];
}
