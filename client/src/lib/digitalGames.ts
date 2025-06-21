export interface DigitalGame {
  id: string;
  title: string;
  description: string;
  instructions: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'focus' | 'memory' | 'relaxation' | 'breathing' | 'creativity' | 'cognitive' | 'mindfulness' | 'rhythm' | 'puzzle' | 'visualization';
  target: 'anxiety' | 'depression' | 'general stress' | 'overthinking' | 'burnout' | 'irritability' | 'focus issues' | 'sleep issues';
  recommendedFor: ('low' | 'medium' | 'high')[];
  iconEmoji: string;
  gamePath: string; // Path to the game component
  thumbnail: string; // Path to image thumbnail
  durationMinutes: number;
  benefits: string[];
}

export const digitalGames: DigitalGame[] = [
  {
    id: "breathing-lotus",
    title: "Breathing Lotus",
    description: "A guided breathing exercise using an animated lotus flower that expands and contracts with your breath",
    instructions: "Follow the expanding and contracting lotus with your breath. Inhale as it opens, exhale as it closes.",
    difficulty: "easy",
    category: "breathing",
    target: "anxiety",
    recommendedFor: ["medium", "high"],
    iconEmoji: "🧘",
    gamePath: "/games/breathing-lotus",
    thumbnail: "/game-thumbnails/breathing-lotus.png",
    durationMinutes: 5,
    benefits: [
      "Reduces anxiety and stress",
      "Lowers heart rate and blood pressure",
      "Improves focus and mindfulness",
      "Can be used anywhere anytime"
    ]
  },
  {
    id: "memory-rangoli",
    title: "Memory Rangoli",
    description: "A digital version of the traditional Indian art form Rangoli, transformed into a pattern memory game",
    instructions: "Memorize the colorful pattern shown briefly, then recreate it by selecting colors and positions correctly.",
    difficulty: "medium",
    category: "memory",
    target: "focus issues",
    recommendedFor: ["low", "medium"],
    iconEmoji: "🎨",
    gamePath: "/games/memory-rangoli",
    thumbnail: "/game-thumbnails/memory-rangoli.png",
    durationMinutes: 10,
    benefits: [
      "Improves visual memory",
      "Enhances concentration and attention to detail",
      "Provides creative expression",
      "Introduces cultural art forms"
    ]
  },
  {
    id: "mindful-stone-balancing",
    title: "Mindful Stone Balancing",
    description: "Digitally stack and balance stones with careful mouse/touch movements to create a stable tower",
    instructions: "Drag stones from the side panel and stack them carefully. Find the balance point of each stone. Focus on your breathing as you place each stone.",
    difficulty: "medium",
    category: "mindfulness",
    target: "general stress",
    recommendedFor: ["low", "medium", "high"],
    iconEmoji: "🗿",
    gamePath: "/games/stone-balancing",
    thumbnail: "/game-thumbnails/stone-balancing.png",
    durationMinutes: 8,
    benefits: [
      "Practices patience and persistence",
      "Enhances fine motor control",
      "Develops present moment awareness",
      "Creates a sense of accomplishment"
    ]
  },
  {
    id: "rhythmic-tabla",
    title: "Rhythmic Tabla",
    description: "Play along with traditional tabla rhythms by tapping in time with the beats",
    instructions: "Follow the visual cues to tap in rhythm with traditional tabla patterns. Start with simple patterns and progress to more complex ones.",
    difficulty: "medium",
    category: "rhythm",
    target: "irritability",
    recommendedFor: ["medium", "high"],
    iconEmoji: "🥁",
    gamePath: "/games/rhythmic-tabla",
    thumbnail: "/game-thumbnails/rhythmic-tabla.png",
    durationMinutes: 7,
    benefits: [
      "Enhances rhythmic awareness",
      "Improves concentration through audio-visual coordination",
      "Releases tension through rhythmic movement",
      "Provides sensory stimulation that can redirect focus from stressors"
    ]
  },
  {
    id: "tranquil-waters",
    title: "Tranquil Waters",
    description: "Create ripples in a pond by touching the water surface, with soothing sounds and visuals",
    instructions: "Touch or click on the water surface to create ripples. Observe how they interact and fade. Focus on the calming sounds and visual effects.",
    difficulty: "easy",
    category: "relaxation",
    target: "anxiety",
    recommendedFor: ["medium", "high"],
    iconEmoji: "💧",
    gamePath: "/games/tranquil-waters",
    thumbnail: "/game-thumbnails/tranquil-waters.png",
    durationMinutes: 5,
    benefits: [
      "Induces relaxation response",
      "Provides sensory grounding",
      "Can break anxious thought patterns",
      "Offers meditative experience without formal meditation"
    ]
  },
  {
    id: "word-mandala",
    title: "Word Mandala",
    description: "Create beautiful mandalas by typing positive affirmations that transform into visual patterns",
    instructions: "Type positive words or affirmations in the input field. Watch as each word transforms into elements of a growing mandala pattern.",
    difficulty: "easy",
    category: "creativity",
    target: "depression",
    recommendedFor: ["low", "medium", "high"],
    iconEmoji: "✨",
    gamePath: "/games/word-mandala",
    thumbnail: "/game-thumbnails/word-mandala.png",
    durationMinutes: 8,
    benefits: [
      "Encourages positive thinking",
      "Combines verbal and visual creativity",
      "Creates beautiful output from personal input",
      "Builds a visual representation of positive thoughts"
    ]
  },
  {
    id: "strategy-chaturanga",
    title: "Simplified Chaturanga",
    description: "A simplified digital version of the ancient Indian chess precursor with fewer pieces and a smaller board",
    instructions: "Move your pieces strategically on the 5x5 board. Each piece has specific movement patterns. Plan ahead and outthink the AI opponent.",
    difficulty: "hard",
    category: "cognitive",
    target: "overthinking",
    recommendedFor: ["low", "medium"],
    iconEmoji: "♟️",
    gamePath: "/games/chaturanga",
    thumbnail: "/game-thumbnails/chaturanga.png",
    durationMinutes: 12,
    benefits: [
      "Redirects overthinking into strategic channels",
      "Improves decision-making skills",
      "Requires full attention, blocking intrusive thoughts",
      "Builds cognitive flexibility and adaptability"
    ]
  },
  {
    id: "guided-forest-walk",
    title: "Guided Forest Walk",
    description: "Take a virtual walk through a peaceful forest with guided breathing and mindfulness prompts",
    instructions: "Move through the virtual forest by pressing arrow keys or tapping. Stop at highlighted spots for guided mindfulness moments and breathing exercises.",
    difficulty: "easy",
    category: "visualization",
    target: "burnout",
    recommendedFor: ["medium", "high"],
    iconEmoji: "🌳",
    gamePath: "/games/forest-walk",
    thumbnail: "/game-thumbnails/forest-walk.png",
    durationMinutes: 10,
    benefits: [
      "Provides mental break and change of scenery",
      "Combines visualization with guided mindfulness",
      "Incorporates nature elements known to reduce stress",
      "Structured approach makes meditation accessible"
    ]
  },
  {
    id: "wisdom-pachisi",
    title: "Wisdom Pachisi",
    description: "Roll virtual dice and move along a board filled with mindfulness prompts and reflection questions",
    instructions: "Roll the dice and move your token around the board. Land on spaces with different prompts and activities designed to promote mindfulness and reflection.",
    difficulty: "medium",
    category: "mindfulness",
    target: "general stress",
    recommendedFor: ["low", "medium", "high"],
    iconEmoji: "🎲",
    gamePath: "/games/wisdom-pachisi",
    thumbnail: "/game-thumbnails/wisdom-pachisi.png",
    durationMinutes: 15,
    benefits: [
      "Combines play with mindfulness practice",
      "Provides varied reflective prompts",
      "Creates structure for mental health practices",
      "Makes self-reflection engaging and accessible"
    ]
  },
  {
    id: "evening-light-lantern",
    title: "Evening Light Lantern",
    description: "Create and release virtual paper lanterns with worries written on them, watching them float away",
    instructions: "Type a worry or stressful thought. Design your lantern with colors and patterns. Light and release it, watching as it floats away carrying your concerns.",
    difficulty: "easy",
    category: "visualization",
    target: "overthinking",
    recommendedFor: ["medium", "high"],
    iconEmoji: "🏮",
    gamePath: "/games/light-lantern",
    thumbnail: "/game-thumbnails/light-lantern.png",
    durationMinutes: 8,
    benefits: [
      "Provides symbolic release of worries",
      "Visual metaphor for letting go",
      "Combines creative expression with stress management",
      "Can be part of an evening wind-down routine"
    ]
  }
];

/**
 * Get recommended digital games based on stress level
 */
export function getRecommendedGames(stressLevel: 'low' | 'medium' | 'high', targetIssue?: string): DigitalGame[] {
  // Filter games based on stress level match
  const matchingGames = digitalGames.filter(game => 
    game.recommendedFor.includes(stressLevel)
  );
  
  // If a specific target issue is provided, prioritize those games
  if (targetIssue) {
    const targetGames = matchingGames.filter(game => 
      game.target.toLowerCase().includes(targetIssue.toLowerCase())
    );
    
    if (targetGames.length > 0) {
      return targetGames;
    }
  }
  
  // Special recommendation logic based on stress level
  if (stressLevel === 'high') {
    // For high stress, prioritize relaxation and breathing games
    const priorityGames = matchingGames.filter(game => 
      game.category === 'relaxation' || game.category === 'breathing' || game.category === 'mindfulness'
    );
    
    if (priorityGames.length > 0) {
      return priorityGames;
    }
  } else if (stressLevel === 'low') {
    // For low stress, prioritize cognitive and creative games
    const priorityGames = matchingGames.filter(game => 
      game.category === 'cognitive' || game.category === 'creativity' || game.category === 'puzzle'
    );
    
    if (priorityGames.length > 0) {
      return priorityGames;
    }
  }
  
  return matchingGames;
}

/**
 * Get a primary game recommendation based on stress level
 */
export function getPrimaryGameRecommendation(stressLevel: 'low' | 'medium' | 'high'): DigitalGame {
  const recommendations = getRecommendedGames(stressLevel);
  
  // Just return a random game from the recommendations
  return recommendations[Math.floor(Math.random() * recommendations.length)];
}