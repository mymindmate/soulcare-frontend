import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAssessment } from '@/context/AssessmentContext';
import { useToast } from '@/hooks/use-toast';
import BreathingLotus from './games/BreathingLotus';
import TranquilWaters from './games/TranquilWaters';
import MindfulStoneBalancing from './games/MindfulStoneBalancing';

// Define the structure of an emotional game
interface EmotionalGame {
  id: string;
  title: string;
  description: string;
  emotionType: 'anxiety' | 'stress' | 'sadness' | 'anger' | 'frustration' | 'overwhelm' | 'depression' | 'fear' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  durationMinutes: number;
  iconEmoji: string;
  benefits: string[];
  effectivenessScore: number; // 1-10 rating
  recommendedFor: ('low' | 'medium' | 'high')[];
  implemented: boolean; // Flag to indicate if the game is implemented
}

// List of emotional games
const emotionalGames: EmotionalGame[] = [
  {
    id: 'breathing-lotus',
    title: 'Breathing Lotus',
    description: 'A guided breathing exercise with an animated lotus flower that expands and contracts with your breath.',
    emotionType: 'anxiety',
    difficulty: 'easy',
    durationMinutes: 5,
    iconEmoji: '🧘',
    benefits: [
      'Reduces anxiety',
      'Lowers heart rate',
      'Improves focus',
      'Can be used anywhere'
    ],
    effectivenessScore: 9,
    recommendedFor: ['medium', 'high'],
    implemented: true
  },
  {
    id: 'tranquil-waters',
    title: 'Tranquil Waters',
    description: 'Create ripples in a pond by touching the water surface, with soothing sounds and visuals.',
    emotionType: 'stress',
    difficulty: 'easy',
    durationMinutes: 4,
    iconEmoji: '💧',
    benefits: [
      'Induces relaxation',
      'Provides sensory grounding',
      'Breaks anxious thought patterns',
      'Meditative experience'
    ],
    effectivenessScore: 8,
    recommendedFor: ['medium', 'high'],
    implemented: true
  },
  {
    id: 'mindful-stone-balancing',
    title: 'Mindful Stone Balancing',
    description: 'Stack and balance virtual stones with careful movements while practicing mindful breathing.',
    emotionType: 'stress',
    difficulty: 'medium',
    durationMinutes: 7,
    iconEmoji: '🪨',
    benefits: [
      'Enhances focus',
      'Promotes patience',
      'Develops mindfulness',
      'Provides accomplishment'
    ],
    effectivenessScore: 7,
    recommendedFor: ['low', 'medium', 'high'],
    implemented: true
  },
  {
    id: 'emotion-bubbles',
    title: 'Emotion Bubbles',
    description: 'Pop bubbles containing negative emotions while collecting positive emotion bubbles.',
    emotionType: 'sadness',
    difficulty: 'easy',
    durationMinutes: 5,
    iconEmoji: '🫧',
    benefits: [
      'Shifts focus from negative emotions',
      'Visual release of negative feelings',
      'Reinforces positive emotions',
      'Improves mood'
    ],
    effectivenessScore: 8,
    recommendedFor: ['medium', 'high'],
    implemented: false
  },
  {
    id: 'anger-drum',
    title: 'Anger Drum',
    description: 'Express and release anger by tapping on a virtual drum with varying intensity.',
    emotionType: 'anger',
    difficulty: 'easy',
    durationMinutes: 6,
    iconEmoji: '🥁',
    benefits: [
      'Safe outlet for anger',
      'Physical release through tapping',
      'Reduces muscle tension',
      'Transforms anger into rhythm'
    ],
    effectivenessScore: 7,
    recommendedFor: ['medium', 'high'],
    implemented: false
  },
  {
    id: 'gratitude-garden',
    title: 'Gratitude Garden',
    description: 'Grow a beautiful garden by planting seeds of gratitude — things you appreciate in your life.',
    emotionType: 'depression',
    difficulty: 'easy',
    durationMinutes: 8,
    iconEmoji: '🌱',
    benefits: [
      'Shifts perspective to positive',
      'Builds gratitude practice',
      'Creates visual positive reinforcement',
      'Encourages reflection'
    ],
    effectivenessScore: 9,
    recommendedFor: ['low', 'medium', 'high'],
    implemented: false
  },
  {
    id: 'worry-release',
    title: 'Worry Release',
    description: 'Write your worries on virtual paper lanterns and watch them float away into the night sky.',
    emotionType: 'anxiety',
    difficulty: 'easy',
    durationMinutes: 5,
    iconEmoji: '🏮',
    benefits: [
      'Externalizes worries',
      'Provides symbolic release',
      'Reduces rumination',
      'Calming visualization'
    ],
    effectivenessScore: 8,
    recommendedFor: ['medium', 'high'],
    implemented: false
  },
  {
    id: 'focus-forest',
    title: 'Focus Forest',
    description: 'Navigate through a peaceful forest path, stopping at stations for brief mindfulness exercises.',
    emotionType: 'overwhelm',
    difficulty: 'medium',
    durationMinutes: 10,
    iconEmoji: '🌳',
    benefits: [
      'Reduces overwhelm',
      'Improves attention',
      'Combines nature and mindfulness',
      'Structured mental breaks'
    ],
    effectivenessScore: 8,
    recommendedFor: ['medium', 'high'],
    implemented: false
  },
  {
    id: 'expression-canvas',
    title: 'Expression Canvas',
    description: 'Express your emotions through color, shape, and movement on an interactive canvas.',
    emotionType: 'general',
    difficulty: 'easy',
    durationMinutes: 7,
    iconEmoji: '🎨',
    benefits: [
      'Creative emotional expression',
      'Non-verbal processing',
      'Color therapy',
      'Sensory engagement'
    ],
    effectivenessScore: 7,
    recommendedFor: ['low', 'medium', 'high'],
    implemented: false
  },
  {
    id: 'confidence-builder',
    title: 'Confidence Builder',
    description: 'Build a virtual structure by adding blocks representing personal strengths and achievements.',
    emotionType: 'fear',
    difficulty: 'medium',
    durationMinutes: 8,
    iconEmoji: '🧱',
    benefits: [
      'Increases self-awareness',
      'Reinforces personal strengths',
      'Builds confidence',
      'Visual representation of progress'
    ],
    effectivenessScore: 8,
    recommendedFor: ['low', 'medium'],
    implemented: false
  }
];

// Emotion types with their corresponding colors and descriptions
const emotionTypes = [
  { value: 'all', label: 'All Games', color: 'bg-primary/10 text-primary', description: 'Browse all wellness games' },
  { value: 'anxiety', label: 'Anxiety', color: 'bg-purple-100 text-purple-800', description: 'Games to ease anxious feelings and racing thoughts' },
  { value: 'stress', label: 'Stress', color: 'bg-blue-100 text-blue-800', description: 'Activities to reduce stress and promote relaxation' },
  { value: 'sadness', label: 'Sadness', color: 'bg-indigo-100 text-indigo-800', description: 'Games to lift mood and bring comfort' },
  { value: 'anger', label: 'Anger', color: 'bg-red-100 text-red-800', description: 'Tools to express and manage anger safely' },
  { value: 'frustration', label: 'Frustration', color: 'bg-orange-100 text-orange-800', description: 'Activities to channel frustration productively' },
  { value: 'overwhelm', label: 'Overwhelm', color: 'bg-amber-100 text-amber-800', description: 'Games to reduce feeling overwhelmed and restore focus' },
  { value: 'fear', label: 'Fear', color: 'bg-emerald-100 text-emerald-800', description: 'Tools to face fears and build courage' },
  { value: 'depression', label: 'Depression', color: 'bg-teal-100 text-teal-800', description: 'Activities to boost mood and energy' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800', description: 'Universal games for overall emotional wellness' },
];

const EmotionalGames = () => {
  const [selectedEmotionType, setSelectedEmotionType] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<EmotionalGame | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { stressLevel } = useAssessment();
  const { toast } = useToast();
  
  // Filter games based on selected emotion type
  const filteredGames = selectedEmotionType === 'all' 
    ? emotionalGames 
    : emotionalGames.filter(game => game.emotionType === selectedEmotionType);
  
  // Get games recommended for the user's current stress level
  const recommendedGames = emotionalGames.filter(game => 
    game.recommendedFor.includes(stressLevel as 'low' | 'medium' | 'high')
  );
  
  // Handle launching a game
  const handlePlayGame = (game: EmotionalGame) => {
    setSelectedGame(game);
    setActiveGame(game.id);
  };
  
  // Get random recommended game
  const getRandomRecommendedGame = () => {
    if (recommendedGames.length === 0) return null;
    return recommendedGames[Math.floor(Math.random() * recommendedGames.length)];
  };
  
  // Render the appropriate game component
  const renderGameComponent = () => {
    if (!selectedGame || !activeGame) return null;
    
    const handleGameComplete = () => {
      setActiveGame(null);
      toast({
        title: "Great job!",
        description: `You've completed ${selectedGame.title}. How do you feel now?`,
        duration: 5000,
      });
    };
    
    switch(activeGame) {
      case 'breathing-lotus':
        return <BreathingLotus onComplete={handleGameComplete} />;
      case 'tranquil-waters':
        return <TranquilWaters onComplete={handleGameComplete} />;
      case 'mindful-stone-balancing':
        return <MindfulStoneBalancing onComplete={handleGameComplete} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center fade-in">
            <div className="text-6xl mb-6 bounce">{selectedGame.iconEmoji}</div>
            <h3 className="text-xl font-bold mb-2">{selectedGame.title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md">{selectedGame.description}</p>
            <div className="bg-muted p-4 rounded-lg mb-6 max-w-md">
              <h4 className="font-medium mb-2">Benefits:</h4>
              <ul className="text-sm list-disc list-inside">
                {selectedGame.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-muted-foreground mb-6">This game is coming soon!</p>
            <Button onClick={() => setActiveGame(null)} className="btn-pulse">Back to Games</Button>
          </div>
        );
    }
  };
  
  // Render game card
  const GameCard = ({ game }: { game: EmotionalGame }) => {
    const emotionType = emotionTypes.find(type => type.value === game.emotionType);
    
    return (
      <Card className="overflow-hidden flex flex-col h-full card-hover-effect">
        <div className="p-4 bg-accent/5 flex items-center justify-center text-5xl min-h-[100px]">
          {game.iconEmoji}
        </div>
        <CardContent className="flex-grow p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{game.title}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${emotionType?.color || 'bg-gray-100'}`}>
              {emotionType?.label || game.emotionType}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{game.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="px-2 py-0.5 bg-secondary/20 text-secondary-foreground rounded-full text-xs font-medium">
              {game.difficulty}
            </span>
            <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-xs font-medium">
              {game.durationMinutes} min
            </span>
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {game.effectivenessScore}/10
            </span>
          </div>
          
          <Button 
            onClick={() => handlePlayGame(game)} 
            className="w-full"
            variant={game.implemented ? "default" : "outline"}
          >
            {game.implemented ? "Play Now" : "Coming Soon"}
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div>
      {/* Game Dialog */}
      {activeGame && selectedGame && (
        <Dialog open={!!activeGame} onOpenChange={(open) => !open && setActiveGame(null)}>  
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedGame.title}</DialogTitle>
              <DialogDescription>
                {selectedGame.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {renderGameComponent()}
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Main Content */}
      <div className="fade-in">
        {/* Recommended Game Feature */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
          <Card className="overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="text-7xl">{getRandomRecommendedGame()?.iconEmoji || '🧘'}</div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold mb-1">{getRandomRecommendedGame()?.title || 'Personalized Game'}</h3>
                <p className="text-muted-foreground mb-3">
                  Based on your stress level: <span className="font-medium">{stressLevel.toUpperCase()}</span>
                </p>
                <p className="mb-4">{getRandomRecommendedGame()?.description || 'Try a game tailored to your current emotional state'}</p>
                <Button 
                  onClick={() => {
                    const game = getRandomRecommendedGame();
                    if (game) handlePlayGame(game);
                  }}
                  className="btn-pulse"
                >
                  Try This Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Game Categories */}
        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Wellness Games</h2>
            <TabsList className="grid grid-cols-3 overflow-auto">
              <TabsTrigger value="all" onClick={() => setSelectedEmotionType('all')}>All Games</TabsTrigger>
              <TabsTrigger value="emotions" onClick={() => setSelectedEmotionType('all')}>By Emotion</TabsTrigger>
              <TabsTrigger value="recommended" onClick={() => setSelectedEmotionType('all')}>Recommended</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-6">
            {/* Filter by emotion tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2">
              {emotionTypes.map((type) => (
                <Button 
                  key={type.value} 
                  variant={selectedEmotionType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEmotionType(type.value)}
                  className="whitespace-nowrap"
                >
                  {type.label}
                </Button>
              ))}
            </div>
            
            {/* Description of selected category */}
            <div className="text-sm text-muted-foreground mb-4">
              {emotionTypes.find(type => type.value === selectedEmotionType)?.description}
            </div>
            
            {/* Game grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="emotions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emotionTypes.filter(type => type.value !== 'all').map((type) => (
                <Card key={type.value} className="card-hover-effect">
                  <CardHeader>
                    <CardTitle>{type.label}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {emotionalGames
                        .filter(game => game.emotionType === type.value)
                        .map(game => (
                          <Button 
                            key={game.id} 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => handlePlayGame(game)}
                          >
                            <span>{game.iconEmoji}</span>
                            <span>{game.title}</span>
                          </Button>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recommended" className="space-y-6">
            <div className="text-sm text-muted-foreground mb-4">
              Games recommended based on your current stress level: <span className="font-medium">{stressLevel.toUpperCase()}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Weekly Report Feature */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Weekly Wellness Plan</CardTitle>
            <CardDescription>A personalized schedule based on your assessment results</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Based on your recent stress assessments, we recommend the following daily practice:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Morning Practice</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{recommendedGames[0]?.iconEmoji || '🧘'}</span>
                    <span>{recommendedGames[0]?.title || 'Breathing Exercise'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendedGames[0]?.description || 'Start your day with a calming practice'}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Evening Wind-down</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{recommendedGames[1]?.iconEmoji || '💧'}</span>
                    <span>{recommendedGames[1]?.title || 'Relaxation Activity'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendedGames[1]?.description || 'End your day with a peaceful practice'}</p>
                </div>
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                View Full Wellness Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmotionalGames;