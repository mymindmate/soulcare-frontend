export interface IndigenousGame {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  durationMinutes: number;
  targetStressType: 'anxiety' | 'depression' | 'worry' | 'overwhelm' | 'fatigue' | 'irritability' | 'focus' | 'sleep' | 'general';
  mood: 'calming' | 'energizing' | 'focusing' | 'grounding' | 'creative';
  benefits: string[];
  emojiIcon: string;
  recommendedFor: ('low' | 'medium' | 'high')[];
}

export const indigenousGames: IndigenousGame[] = [
  {
    id: 'pallanguzhi',
    title: 'Pallanguzhi',
    description: 'A traditional South Indian board game that helps with focus and mathematical thinking while reducing anxiety',
    instructions: [
      'Find 14 small objects (seeds, beads, or small stones)',
      'Create 2 rows of 7 small cups or depressions',
      'Place 2 seeds in each cup',
      'Pick up all seeds from any cup on your side',
      'Moving counter-clockwise, drop one seed in each cup',
      'If your last seed lands in a cup with seeds, pick up all seeds and continue dropping',
      'If it lands in an empty cup, your turn ends',
      'The goal is to collect as many seeds as possible'
    ],
    durationMinutes: 15,
    targetStressType: 'anxiety',
    mood: 'focusing',
    benefits: [
      'Improves concentration and focus',
      'Engages mathematical thinking',
      'Provides distraction from anxious thoughts',
      'Encourages social connection when played with others'
    ],
    emojiIcon: '🧠',
    recommendedFor: ['medium', 'high']
  },
  {
    id: 'kabaddi',
    title: 'Mini Kabaddi',
    description: 'A modified version of the traditional Indian contact sport that helps release physical tension and stress',
    instructions: [
      'Find a small open space indoors or outdoors',
      'Draw or imagine a center line',
      'Take a deep breath and hold it',
      'While holding breath, try to touch an object across the line and return',
      'Gradually increase distance and challenge',
      'Focus on the breath control aspect rather than competition'
    ],
    durationMinutes: 10,
    targetStressType: 'irritability',
    mood: 'energizing',
    benefits: [
      'Releases physical tension',
      'Improves breath control and awareness',
      'Provides an outlet for pent-up energy',
      'Enhances mind-body connection'
    ],
    emojiIcon: '🏃',
    recommendedFor: ['medium', 'high']
  },
  {
    id: 'lagori',
    title: 'Mindful Lagori',
    description: 'A calming adaptation of the traditional Indian stone stacking game that promotes patience and focus',
    instructions: [
      'Collect 7-9 flat stones of different sizes',
      'Stack them from largest (bottom) to smallest (top)',
      'Focus on breathing while carefully stacking',
      'If the tower falls, practice acceptance and begin again',
      'Try to build the tallest stable tower you can'
    ],
    durationMinutes: 15,
    targetStressType: 'overwhelm',
    mood: 'calming',
    benefits: [
      'Cultivates patience and persistence',
      'Promotes mindfulness and present-moment awareness',
      'Develops fine motor skills',
      'Creates a sense of accomplishment'
    ],
    emojiIcon: '🗿',
    recommendedFor: ['low', 'medium', 'high']
  },
  {
    id: 'gilli-danda',
    title: 'Breath Gilli-Danda',
    description: 'A mindful adaptation of the traditional stick game that combines coordination with breath awareness',
    instructions: [
      'Find a small stick (gilli) and a larger stick (danda)',
      'With each breath, tap the gilli gently to practice coordination',
      'Focus on synchronizing your breathing with the tapping',
      'Gradually increase complexity as you become more comfortable'
    ],
    durationMinutes: 10,
    targetStressType: 'focus',
    mood: 'grounding',
    benefits: [
      'Improves hand-eye coordination',
      'Develops breath awareness',
      'Enhances focus and concentration',
      'Creates a mindful physical activity'
    ],
    emojiIcon: '🥢',
    recommendedFor: ['low', 'medium']
  },
  {
    id: 'moksha-patam',
    title: 'Reflection Moksha Patam',
    description: 'A modern adaptation of the ancient Snakes and Ladders game (originally called Moksha Patam) focused on personal reflection',
    instructions: [
      'Create or print a simplified Snakes and Ladders board',
      'Add reflection questions on specific squares',
      'Roll a dice and move your token',
      'When landing on a reflection square, pause and contemplate the question',
      'Snakes represent unhelpful thought patterns, ladders represent positive mental shifts'
    ],
    durationMinutes: 20,
    targetStressType: 'worry',
    mood: 'creative',
    benefits: [
      'Encourages personal reflection',
      'Provides structured way to examine thought patterns',
      'Offers perspective on life challenges',
      'Makes cognitive therapy concepts accessible'
    ],
    emojiIcon: '🎲',
    recommendedFor: ['low', 'medium', 'high']
  },
  {
    id: 'kho-kho',
    title: 'Solo Kho-Kho',
    description: 'A single-player adaptation of the traditional tag game focusing on rhythmic movement and tension release',
    instructions: [
      'Set up 8-10 objects in a straight line (like traditional kho-kho poles)',
      'Move rhythmically from object to object, touching each one',
      'Maintain a consistent pace, focusing on your breathing',
      'Gradually increase speed then return to slow movement',
      'End with a few deep breaths and stillness'
    ],
    durationMinutes: 15,
    targetStressType: 'fatigue',
    mood: 'energizing',
    benefits: [
      'Increases heart rate safely',
      'Creates rhythmic, meditative movement',
      'Combats mental fatigue through physical activity',
      'Improves circulation and energy levels'
    ],
    emojiIcon: '⚡',
    recommendedFor: ['low', 'medium']
  },
  {
    id: 'pachisi',
    title: 'Thought Pachisi',
    description: 'A simplified version of the ancient Indian board game (predecessor to Ludo) with a focus on thought analysis',
    instructions: [
      'Use a simplified Pachisi/Ludo board or create your own',
      'Assign different thought categories to different colored tokens',
      'Roll dice to move tokens, narrating a relevant thought for each move',
      'Practice identifying helpful vs unhelpful thoughts',
      'Focus on the process rather than winning'
    ],
    durationMinutes: 20,
    targetStressType: 'depression',
    mood: 'creative',
    benefits: [
      'Encourages thought categorization',
      'Develops metacognitive awareness',
      'Provides distance from negative thought patterns',
      'Creates playful approach to cognitive restructuring'
    ],
    emojiIcon: '🎭',
    recommendedFor: ['low', 'medium']
  },
  {
    id: 'chaturanga',
    title: 'Simplified Chaturanga',
    description: 'An adaptated version of the ancient Indian precursor to chess, focusing on strategic thinking and patience',
    instructions: [
      'Use a simplified 4x4 grid instead of standard chess board',
      'Use reduced pieces: 1 raja (king), 2 pawns, 1 elephant (bishop) per side',
      'Follow basic chess movement rules',
      'Focus on deep thinking and planning before each move',
      'Practice acceptance of outcomes without judgment'
    ],
    durationMinutes: 25,
    targetStressType: 'worry',
    mood: 'focusing',
    benefits: [
      'Develops strategic thinking',
      'Builds patience and deliberation',
      'Improves cognitive flexibility',
      'Diverts attention from rumination'
    ],
    emojiIcon: '♟️',
    recommendedFor: ['low', 'medium']
  },
  {
    id: 'surya-namaskar',
    title: 'Playful Surya Namaskar',
    description: 'A gamified version of the traditional sun salutation yoga sequence designed for stress relief',
    instructions: [
      'Create 12 cards with simple illustrations of sun salutation poses',
      'Shuffle the cards and place them face down',
      'Reveal one card at a time, performing the pose shown',
      'Focus on connecting breath with movement',
      'After completing the sequence, sit and notice how you feel'
    ],
    durationMinutes: 15,
    targetStressType: 'general',
    mood: 'grounding',
    benefits: [
      'Combines physical activity with mindfulness',
      'Improves flexibility and strength',
      'Enhances breath awareness',
      'Creates mind-body connection'
    ],
    emojiIcon: '🧘',
    recommendedFor: ['low', 'medium', 'high']
  },
  {
    id: 'antakshari',
    title: 'Solo Antakshari',
    description: 'A self-paced version of the popular Indian singing game that uses music for mood elevation',
    instructions: [
      'Begin by singing or humming a favorite song',
      'Identify the last sound or syllable of the song',
      'Find another song that begins with that sound',
      'Continue creating a chain of songs',
      'Focus on positive, uplifting songs that resonate with you'
    ],
    durationMinutes: 15,
    targetStressType: 'depression',
    mood: 'energizing',
    benefits: [
      'Uses music therapy principles for mood enhancement',
      'Activates memory and cognitive associations',
      'Encourages creative expression',
      'Provides emotional release through singing'
    ],
    emojiIcon: '🎵',
    recommendedFor: ['low', 'medium', 'high']
  }
];

/**
 * Get recommended games based on stress level and specific stress type
 */
export function getRecommendedGames(stressLevel: 'low' | 'medium' | 'high', stressType?: string): IndigenousGame[] {
  // Filter games that match the stress level
  const matchingGames = indigenousGames.filter(game => 
    game.recommendedFor.includes(stressLevel)
  );
  
  // If a specific stress type is provided, prioritize games targeting that type
  if (stressType) {
    const targetTypeGames = matchingGames.filter(game => game.targetStressType === stressType);
    
    // If we found games for that specific type, return those
    if (targetTypeGames.length > 0) {
      return targetTypeGames;
    }
  }
  
  // Otherwise, return games recommended for the general stress level
  return matchingGames;
}

/**
 * Get a primary game recommendation based on stress level
 */
export function getPrimaryGameRecommendation(stressLevel: 'low' | 'medium' | 'high'): IndigenousGame {
  const recommendations = getRecommendedGames(stressLevel);
  
  // Select an appropriate game based on stress level
  if (stressLevel === 'high') {
    // For high stress, prioritize calming games
    const calmingGames = recommendations.filter(game => game.mood === 'calming' || game.mood === 'grounding');
    if (calmingGames.length > 0) {
      return calmingGames[Math.floor(Math.random() * calmingGames.length)];
    }
  } else if (stressLevel === 'low') {
    // For low stress, prioritize focusing or creative games
    const engagingGames = recommendations.filter(game => 
      game.mood === 'focusing' || game.mood === 'creative'
    );
    if (engagingGames.length > 0) {
      return engagingGames[Math.floor(Math.random() * engagingGames.length)];
    }
  }
  
  // Default: return a random game from the recommendations
  return recommendations[Math.floor(Math.random() * recommendations.length)];
}