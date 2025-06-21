import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAssessment } from '@/context/AssessmentContext';
import { useToast } from '@/hooks/use-toast';

// Import games
import BoxBreathingGame from './games/BoxBreathingGame';
import ColoringBookGame from './games/ColoringBookGame';
import ZenGardenSimulator from './games/ZenGardenSimulator';
import GuidedMeditationAdventure from './games/GuidedMeditationAdventure';
import BubblePopGame from './games/BubblePopGame';
import PositiveAffirmationGenerator from './games/PositiveAffirmationGenerator';
import VirtualPetCompanion from './games/VirtualPetCompanion';
import GratitudeJournalGame from './games/GratitudeJournalGame';
import SoundscapeBuilder from './games/SoundscapeBuilder';
import LightJourneyPuzzle from './games/LightJourneyPuzzle';

// Using the imported game components from respective files

// Define wellness game interface
interface WellnessGame {
  id: string;
  title: string;
  description: string;
  emotionalFocus: 'stress' | 'sadness' | 'overwhelm' | 'anxiety' | 'self-esteem' | 'anger' | 'loneliness' | 'negativity' | 'tension' | 'fear';
  howItHelps: string;
  durationMinutes: number;
  iconEmoji: string;
  benefits: string[];
  implemented: boolean; // Flag to indicate if the game is fully implemented
  color: string; // Color theme for the game
}

// List of wellness games
const wellnessGames: WellnessGame[] = [
  {
    id: 'box-breathing',
    title: 'Box Breathing Game',
    description: 'A guided breathing exercise that helps you follow the 4-4-4-4 pattern to reduce stress and increase calmness.',
    emotionalFocus: 'stress',
    howItHelps: 'Paced breathing stimulates the parasympathetic nervous system, reducing physiological stress responses.',
    durationMinutes: 5,
    iconEmoji: '🧘',
    benefits: [
      'Reduces heart rate',
      'Lowers blood pressure',
      'Improves focus and concentration',
      'Can be used anywhere, anytime'
    ],
    implemented: true,
    color: 'bg-blue-50 border-blue-200'
  },
  {
    id: 'coloring-book',
    title: 'Coloring Book Game',
    description: 'Express your emotions through color with beautiful templates designed to lift your mood.',
    emotionalFocus: 'sadness',
    howItHelps: 'Color therapy engages creative expression, providing a healthy outlet for emotions while stimulating positive neural pathways.',
    durationMinutes: 10,
    iconEmoji: '🎨',
    benefits: [
      'Provides creative expression',
      'Shifts focus from negative thoughts',
      'Promotes mindfulness',
      'Creates a sense of accomplishment'
    ],
    implemented: true,
    color: 'bg-indigo-50 border-indigo-200'
  },
  {
    id: 'zen-garden',
    title: 'Zen Garden Simulator',
    description: 'Create patterns in sand, arrange stones, and design your own peaceful Zen garden.',
    emotionalFocus: 'overwhelm',
    howItHelps: 'The repetitive, meditative nature of raking patterns helps calm racing thoughts and restore cognitive resources.',
    durationMinutes: 7,
    iconEmoji: '🪨',
    benefits: [
      'Reduces mental clutter',
      'Improves focus on the present moment',
      'Provides a sense of control',
      'Encourages mindful creativity'
    ],
    implemented: true,
    color: 'bg-stone-50 border-stone-200'
  },
  {
    id: 'guided-meditation',
    title: 'Guided Meditation Adventure',
    description: 'Journey through peaceful landscapes with guided narration and breathing exercises.',
    emotionalFocus: 'anxiety',
    howItHelps: 'Guided imagery combined with breathing techniques helps redirect anxious thoughts and activate relaxation responses.',
    durationMinutes: 8,
    iconEmoji: '🌄',
    benefits: [
      'Reduces anxiety symptoms',
      'Improves emotional regulation',
      'Enhances mind-body connection',
      'Builds mental resilience'
    ],
    implemented: true,
    color: 'bg-purple-50 border-purple-200'
  },
  {
    id: 'positive-affirmations',
    title: 'Positive Affirmation Generator',
    description: 'Create and visualize personalized affirmations with calming backgrounds and gentle sounds.',
    emotionalFocus: 'self-esteem',
    howItHelps: 'Positive affirmations help rewire negative thought patterns and strengthen neural pathways associated with self-confidence.',
    durationMinutes: 5,
    iconEmoji: '✨',
    benefits: [
      'Counters negative self-talk',
      'Builds positive neural connections',
      'Improves mood and outlook',
      'Strengthens emotional resilience'
    ],
    implemented: true,
    color: 'bg-yellow-50 border-yellow-200'
  },
  {
    id: 'bubble-pop',
    title: 'Bubble Pop Game',
    description: 'Release anger by popping bubbles containing negative emotions, with satisfying sounds and visuals.',
    emotionalFocus: 'anger',
    howItHelps: 'Provides a safe outlet for frustration while the rhythmic popping action helps regulate emotional intensity.',
    durationMinutes: 5,
    iconEmoji: '💥',
    benefits: [
      'Safely channels frustration',
      'Provides emotional release',
      'Reduces physiological arousal',
      'Improves emotional awareness'
    ],
    implemented: true,
    color: 'bg-red-50 border-red-200'
  },
  {
    id: 'virtual-pet',
    title: 'Virtual Pet Companion',
    description: 'Care for an adorable virtual pet that encourages your own self-care and emotional well-being.',
    emotionalFocus: 'loneliness',
    howItHelps: 'Caring for a virtual pet activates nurturing behaviors and provides a sense of companionship, reducing feelings of isolation.',
    durationMinutes: 7,
    iconEmoji: '🐱',
    benefits: [
      'Provides a sense of connection',
      'Encourages routine and self-care',
      'Develops empathy',
      'Creates positive emotional investment'
    ],
    implemented: true,
    color: 'bg-pink-50 border-pink-200'
  },
  {
    id: 'gratitude-journal',
    title: 'Gratitude Journal Game',
    description: 'Write gratitude entries to unlock beautiful visual rewards and track your positivity growth.',
    emotionalFocus: 'negativity',
    howItHelps: 'Gratitude practice redirects attention from negative bias to positive experiences, retraining mental focus patterns.',
    durationMinutes: 6,
    iconEmoji: '📔',
    benefits: [
      'Counters negativity bias',
      'Improves overall mood',
      'Builds positive thinking habits',
      'Enhances resilience to stress'
    ],
    implemented: true,
    color: 'bg-green-50 border-green-200'
  },
  {
    id: 'soundscape-builder',
    title: 'Soundscape Builder',
    description: 'Create your personal calm space by mixing nature sounds, ambient music, and soothing tones.',
    emotionalFocus: 'tension',
    howItHelps: 'Audio therapy helps reduce muscle tension and activates relaxation responses through personalized sound curation.',
    durationMinutes: 8,
    iconEmoji: '🎵',
    benefits: [
      'Reduces physical tension',
      'Masks distracting noise',
      'Creates personalized relaxation tool',
      'Improves sleep quality'
    ],
    implemented: true,
    color: 'bg-teal-50 border-teal-200'
  },
  {
    id: 'light-journey',
    title: 'Light Journey Puzzle Game',
    description: 'Guide light through darkness in this peaceful puzzle game that symbolizes finding courage.',
    emotionalFocus: 'fear',
    howItHelps: 'The metaphor of guiding light through darkness provides cognitive reframing of fears while building confidence through accomplishment.',
    durationMinutes: 7,
    iconEmoji: '💫',
    benefits: [
      'Builds emotional courage',
      'Provides symbolic reframing of fears',
      'Improves problem-solving skills',
      'Creates sense of accomplishment'
    ],
    implemented: true,
    color: 'bg-amber-50 border-amber-200'
  }
];

// Emotion focus categories with descriptions
const emotionalFocusCategories = [
  { value: 'all', label: 'All Games', description: 'View all wellness games' },
  { value: 'stress', label: 'Stress Relief', description: 'Games to reduce tension and promote relaxation' },
  { value: 'anxiety', label: 'Anxiety Calm', description: 'Activities to ease anxious feelings and racing thoughts' },
  { value: 'sadness', label: 'Mood Lifting', description: 'Games to elevate your mood and bring comfort' },
  { value: 'anger', label: 'Anger Release', description: 'Tools to express and manage anger safely' },
  { value: 'overwhelm', label: 'Overwhelm Relief', description: 'Activities to restore focus and reduce feeling overwhelmed' },
  { value: 'self-esteem', label: 'Confidence Building', description: 'Games to strengthen self-worth and positive self-image' },
  { value: 'loneliness', label: 'Connection', description: 'Experiences to reduce feelings of isolation' },
  { value: 'negativity', label: 'Positive Thinking', description: 'Tools to shift from negative to positive thinking patterns' },
  { value: 'tension', label: 'Relaxation', description: 'Activities to release physical and mental tension' },
  { value: 'fear', label: 'Courage Building', description: 'Games to face fears and build emotional strength' },
];

const WellnessArcade = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<WellnessGame | null>(null);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const { stressLevel } = useAssessment();
  const { toast } = useToast();
  
  // Filter games based on selected category and implementation status
  const filteredGames = selectedCategory === 'all' 
    ? wellnessGames.filter(game => game.implemented === true) 
    : wellnessGames.filter(game => game.emotionalFocus === selectedCategory && game.implemented === true);
  
  // Get games recommended for the user's current stress level
  const getRecommendedGames = () => {
    // Map stress levels to emotional focuses
    const focusMap = {
      'high': ['stress', 'anxiety', 'overwhelm', 'tension'],
      'medium': ['anger', 'fear', 'negativity'],
      'low': ['sadness', 'self-esteem', 'loneliness']
    };
    
    const relevantFocuses = focusMap[stressLevel as keyof typeof focusMap] || ['stress', 'anxiety'];
    
    // Filter by both relevant focus and implementation status
    return wellnessGames.filter(game => 
      relevantFocuses.includes(game.emotionalFocus) && game.implemented === true
    );
  };
  
  // Get recommended games
  const recommendedGames = getRecommendedGames();
  
  // Handle launching a game
  const handlePlayGame = (game: WellnessGame) => {
    setSelectedGame(game);
    setActiveGameId(game.id);
    
    toast({
      title: `Starting ${game.title}`,
      description: "Loading your wellness experience...",
      duration: 2000,
    });
  };
  
  // Get a random recommended game
  const getRandomRecommendedGame = () => {
    if (recommendedGames.length === 0) return null;
    return recommendedGames[Math.floor(Math.random() * recommendedGames.length)];
  };
  
  // Render the appropriate game component
  const renderGameComponent = () => {
    if (!selectedGame || !activeGameId) return null;
    
    const handleGameComplete = () => {
      setActiveGameId(null);
      toast({
        title: "Well done!",
        description: `You've completed ${selectedGame.title}. How do you feel now?`,
        duration: 5000,
      });
    };
    
    // Render the appropriate game component based on ID
    switch(activeGameId) {
      case 'box-breathing':
        return <BoxBreathingGame onComplete={handleGameComplete} />;
      case 'coloring-book':
        return <ColoringBookGame onComplete={handleGameComplete} />;
      case 'zen-garden':
        return <ZenGardenSimulator onComplete={handleGameComplete} />;
      case 'guided-meditation':
        return <GuidedMeditationAdventure onComplete={handleGameComplete} />;
      case 'positive-affirmations':
        return <PositiveAffirmationGenerator onComplete={handleGameComplete} />;
      case 'bubble-pop':
        return <BubblePopGame onComplete={handleGameComplete} />;
      case 'virtual-pet':
        return <VirtualPetCompanion onComplete={handleGameComplete} />;
      case 'gratitude-journal':
        return <GratitudeJournalGame onComplete={handleGameComplete} />;
      case 'soundscape-builder':
        return <SoundscapeBuilder onComplete={handleGameComplete} />;
      case 'light-journey':
        return <LightJourneyPuzzle onComplete={handleGameComplete} />;
      default:
        // Placeholder for games not yet fully implemented
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center fade-in">
            <div className="text-6xl mb-6 bounce">{selectedGame.iconEmoji}</div>
            <h3 className="text-xl font-bold mb-3">{selectedGame.title}</h3>
            <p className="text-muted-foreground mb-5 max-w-md">{selectedGame.description}</p>
            
            <div className="bg-muted/30 p-5 rounded-lg mb-6 max-w-md">
              <h4 className="font-medium mb-3">How it helps with {selectedGame.emotionalFocus}:</h4>
              <p className="text-sm">{selectedGame.howItHelps}</p>
            </div>
            
            <div className="bg-muted/30 p-5 rounded-lg mb-6 max-w-md">
              <h4 className="font-medium mb-2">Benefits:</h4>
              <ul className="text-sm list-disc list-inside space-y-1">
                {selectedGame.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            <Button onClick={() => setActiveGameId(null)} className="btn-pulse">Return to Arcade</Button>
          </div>
        );
    }
  };
  
  // Render game card
  const GameCard = ({ game }: { game: WellnessGame }) => {
    const emotionCategory = emotionalFocusCategories.find(cat => cat.value === game.emotionalFocus);
    
    return (
      <Card className={`overflow-hidden flex flex-col h-full card-hover-effect ${game.color}`}>
        <div className="p-4 bg-accent/5 flex items-center justify-center text-5xl min-h-[100px]">
          {game.iconEmoji}
        </div>
        <CardContent className="flex-grow p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{game.title}</h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary">
              {emotionCategory?.label || game.emotionalFocus}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{game.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="px-2 py-0.5 bg-secondary/20 text-secondary-foreground rounded-full text-xs font-medium">
              {game.durationMinutes} min
            </span>
          </div>
          
          <Button 
            onClick={() => handlePlayGame(game)} 
            className="w-full btn-pulse"
          >
            Play Now
          </Button>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div>
      {/* Fullscreen Game View */}
      {activeGameId && selectedGame ? (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="h-full w-full overflow-y-auto p-4">
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                className="shadow-sm" 
                onClick={() => setActiveGameId(null)}
                size="sm"
              >
                ✕ Close
              </Button>
            </div>
            <div className="max-h-[calc(100vh-80px)] overflow-y-auto max-w-4xl mx-auto">
              {renderGameComponent()}
            </div>
          </div>
        </div>
      ) : null}
      
      {/* Main Content */}
      <div className="fade-in">
        <div className="mb-2">
          <h2 className="text-2xl font-bold mb-1">Mental Wellness Arcade</h2>
          <p className="text-muted-foreground">Interactive games designed to support your emotional wellbeing</p>
        </div>
        
        {/* Recommended Game Feature */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Recommended for You</h3>
          <Card className="overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
              <div className="text-7xl">{getRandomRecommendedGame()?.iconEmoji || '🧘'}</div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold mb-1">{getRandomRecommendedGame()?.title || 'Personalized Wellness Game'}</h3>
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
            <h3 className="text-lg font-medium">Browse by Emotion</h3>
            <TabsList className="grid grid-cols-3 overflow-auto">
              <TabsTrigger value="all" onClick={() => setSelectedCategory('all')}>All Games</TabsTrigger>
              <TabsTrigger value="emotions" onClick={() => setSelectedCategory('all')}>By Emotion</TabsTrigger>
              <TabsTrigger value="recommended" onClick={() => setSelectedCategory('all')}>Recommended</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="space-y-6">
            {/* Filter by emotion tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2">
              {emotionalFocusCategories.map((category) => (
                <Button 
                  key={category.value} 
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="whitespace-nowrap"
                >
                  {category.label}
                </Button>
              ))}
            </div>
            
            {/* Description of selected category */}
            <div className="text-sm text-muted-foreground mb-4">
              {emotionalFocusCategories.find(cat => cat.value === selectedCategory)?.description}
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
              {emotionalFocusCategories.filter(cat => cat.value !== 'all').map((category) => (
                <Card key={category.value} className="card-hover-effect">
                  <CardHeader>
                    <CardTitle>{category.label}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {wellnessGames
                        .filter(game => game.emotionalFocus === category.value && game.implemented === true)
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
        
        {/* Weekly Wellness Plan Feature */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Weekly Wellness Plan</CardTitle>
            <CardDescription>A personalized schedule based on your assessment results</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Based on your recent stress assessments, we recommend incorporating these games into your weekly routine:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Morning Practice</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{recommendedGames[0]?.iconEmoji || '🧘'}</span>
                    <span>{recommendedGames[0]?.title || 'Box Breathing Game'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendedGames[0]?.description || 'Start your day with a calming breathing practice'}</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Evening Wind-down</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{recommendedGames[1]?.iconEmoji || '🎵'}</span>
                    <span>{recommendedGames[1]?.title || 'Soundscape Builder'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendedGames[1]?.description || 'End your day with soothing sounds to help you relax'}</p>
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

export default WellnessArcade;