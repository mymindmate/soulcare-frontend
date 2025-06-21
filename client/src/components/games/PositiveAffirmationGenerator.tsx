import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface PositiveAffirmationGeneratorProps {
  onComplete: () => void;
}

interface SavedAffirmation {
  id: number;
  text: string;
  background: string;
  font: string;
  saved: boolean;
}

const backgroundOptions = [
  { name: 'Sunrise', value: 'bg-gradient-to-r from-orange-100 to-rose-100' },
  { name: 'Ocean', value: 'bg-gradient-to-r from-blue-100 to-cyan-100' },
  { name: 'Forest', value: 'bg-gradient-to-r from-green-100 to-emerald-100' },
  { name: 'Lavender', value: 'bg-gradient-to-r from-purple-100 to-violet-100' },
  { name: 'Clouds', value: 'bg-gradient-to-r from-gray-100 to-slate-100' },
  { name: 'Soft Gold', value: 'bg-gradient-to-r from-amber-100 to-yellow-100' },
];

const fontOptions = [
  { name: 'Elegant', value: 'font-serif' },
  { name: 'Modern', value: 'font-sans' },
  { name: 'Playful', value: 'font-mono' },
];

const presetAffirmations = [
  "I am capable of achieving my goals and dreams.",
  "I deserve love, happiness, and success.",
  "I am growing stronger and more confident every day.",
  "I trust my intuition and listen to my inner wisdom.",
  "I am grateful for all that I have in my life.",
  "I forgive myself for my mistakes and learn from them.",
  "I am enough exactly as I am right now.",
  "I attract positive energy and release what no longer serves me.",
  "I choose to focus on what I can control.",
  "My potential is limitless, and I can accomplish anything I set my mind to.",
];

const themeCategories = [
  { name: 'self-love', emoji: '❤️', title: 'Self-Love' },
  { name: 'confidence', emoji: '💪', title: 'Confidence' },
  { name: 'gratitude', emoji: '🙏', title: 'Gratitude' },
  { name: 'success', emoji: '🏆', title: 'Success' },
  { name: 'peace', emoji: '☮️', title: 'Peace' },
  { name: 'healing', emoji: '🌱', title: 'Healing' },
];

const PositiveAffirmationGenerator = ({ onComplete }: PositiveAffirmationGeneratorProps) => {
  const [customAffirmation, setCustomAffirmation] = useState('');
  const [currentAffirmation, setCurrentAffirmation] = useState('');
  const [background, setBackground] = useState(backgroundOptions[0].value);
  const [font, setFont] = useState(fontOptions[0].value);
  const [view, setView] = useState<'start' | 'create' | 'display' | 'saved'>('start');
  const [savedAffirmations, setSavedAffirmations] = useState<SavedAffirmation[]>([]);
  const [currentAffirmationObj, setCurrentAffirmationObj] = useState<SavedAffirmation | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  // Load saved affirmations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedAffirmations');
    if (saved) {
      setSavedAffirmations(JSON.parse(saved));
    }
  }, []);
  
  // Save affirmations to localStorage when they change
  useEffect(() => {
    if (savedAffirmations.length > 0) {
      localStorage.setItem('savedAffirmations', JSON.stringify(savedAffirmations));
    }
  }, [savedAffirmations]);
  
  // Handle saving a new affirmation
  const handleSaveAffirmation = () => {
    if (!currentAffirmation.trim()) {
      toast({
        title: "Empty affirmation",
        description: "Please enter an affirmation before saving.",
      });
      return;
    }
    
    const newAffirmation: SavedAffirmation = {
      id: Date.now(),
      text: currentAffirmation,
      background,
      font,
      saved: true,
    };
    
    setSavedAffirmations([...savedAffirmations, newAffirmation]);
    setCurrentAffirmationObj(newAffirmation);
    
    toast({
      title: "Affirmation saved!",
      description: "Your affirmation has been saved to your collection.",
      duration: 3000,
    });
  };
  
  // Handle creating a new custom affirmation
  const handleCreateAffirmation = () => {
    if (!customAffirmation.trim()) {
      toast({
        title: "Empty affirmation",
        description: "Please enter your affirmation before proceeding.",
        duration: 3000,
      });
      return;
    }
    
    setCurrentAffirmation(customAffirmation);
    setCurrentAffirmationObj({
      id: Date.now(),
      text: customAffirmation,
      background,
      font,
      saved: false,
    });
    setCustomAffirmation('');
    setView('display');
  };
  
  // Handle selecting a preset affirmation
  const handleSelectPreset = (affirmation: string) => {
    setCurrentAffirmation(affirmation);
    setCurrentAffirmationObj({
      id: Date.now(),
      text: affirmation,
      background,
      font,
      saved: false,
    });
    setView('display');
  };
  
  // Filter preset affirmations by category if one is selected
  const getCategoryAffirmations = (category: string) => {
    switch(category) {
      case 'self-love':
        return presetAffirmations.slice(0, 2);
      case 'confidence':
        return presetAffirmations.slice(2, 4);
      case 'gratitude':
        return presetAffirmations.slice(4, 6);
      case 'success':
        return presetAffirmations.slice(6, 8);
      case 'peace':
      case 'healing':
        return presetAffirmations.slice(8, 10);
      default:
        return presetAffirmations;
    }
  };
  
  // Get a random affirmation
  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * presetAffirmations.length);
    return presetAffirmations[randomIndex];
  };
  
  // Start view
  if (view === 'start') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 fade-in">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Positive Affirmations</h2>
            <p className="text-muted-foreground mb-3">
              Create, visualize, and practice personalized affirmations to boost self-esteem
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button onClick={() => setView('create')} className="h-24 flex flex-col items-center justify-center btn-pulse">
              <span className="text-2xl mb-1">🖋️</span>
              <span>Create New</span>
            </Button>
            <Button 
              onClick={() => {
                const random = getRandomAffirmation();
                handleSelectPreset(random);
              }} 
              variant="outline" 
              className="h-24 flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">🎲</span>
              <span>Random Affirmation</span>
            </Button>
            <Button onClick={() => setView('saved')} variant="outline" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📚</span>
              <span>My Collection</span>
              <span className="text-xs">{savedAffirmations.length} saved</span>
            </Button>
            <Button onClick={onComplete} variant="outline" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🏠</span>
              <span>Exit Game</span>
            </Button>
          </div>
          
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Why Affirmations Help</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Positive affirmations can help rewire your brain by challenging negative thought patterns. Regular practice can:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Reduce negative self-talk</li>
                <li>Increase self-confidence</li>
                <li>Help visualize positive outcomes</li>
                <li>Promote a growth mindset</li>
                <li>Build resilience during challenges</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Create view
  if (view === 'create') {
    return (
      <div className="flex flex-col h-full p-4 max-w-lg mx-auto fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Your Affirmation</h2>
          <Button onClick={() => setView('start')} variant="outline" size="sm">
            Back
          </Button>
        </div>
        
        <Tabs defaultValue="custom" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="custom">Write Your Own</TabsTrigger>
            <TabsTrigger value="preset">Choose Preset</TabsTrigger>
          </TabsList>
          
          <TabsContent value="custom" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="affirmation">Your Affirmation</Label>
              <Textarea 
                id="affirmation"
                placeholder="I am capable, confident, and worthy..."
                className="min-h-[100px] mt-2"
                value={customAffirmation}
                onChange={(e) => setCustomAffirmation(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Use present tense and positive language. Start with "I am" or "I can"
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="preset" className="space-y-4 pt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {themeCategories.map((category) => (
                <Button 
                  key={category.name}
                  variant={activeCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category.name === activeCategory ? null : category.name)}
                  className="flex items-center gap-1"
                >
                  <span>{category.emoji}</span>
                  <span>{category.title}</span>
                </Button>
              ))}
            </div>
            
            <div className="space-y-2">
              {(activeCategory ? getCategoryAffirmations(activeCategory) : presetAffirmations).map((affirmation, index) => (
                <Card key={index} className="cursor-pointer hover:bg-accent/5 transition-colors" onClick={() => handleSelectPreset(affirmation)}>
                  <CardContent className="p-3">
                    <p>"{affirmation}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4 mb-6">
          <div>
            <Label>Background Style</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {backgroundOptions.map((option) => (
                <button
                  key={option.name}
                  className={`h-12 rounded-md ${option.value} border ${background === option.value ? 'border-primary ring-2 ring-primary/30' : 'border-muted'}`}
                  onClick={() => setBackground(option.value)}
                ></button>
              ))}
            </div>
          </div>
          
          <div>
            <Label>Font Style</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {fontOptions.map((option) => (
                <button
                  key={option.name}
                  className={`h-12 rounded-md bg-muted/30 flex items-center justify-center ${option.value} ${font === option.value ? 'border-2 border-primary' : 'border border-muted'}`}
                  onClick={() => setFont(option.value)}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <Button 
          onClick={customAffirmation ? handleCreateAffirmation : () => setView('start')} 
          className="w-full btn-pulse"
        >
          {customAffirmation ? "Preview Affirmation" : "Cancel"}
        </Button>
      </div>
    );
  }
  
  // Display view
  if (view === 'display' && currentAffirmationObj) {
    return (
      <div className="flex flex-col h-full p-4 max-w-lg mx-auto fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Visualize & Practice</h2>
          <Button onClick={() => setView('start')} variant="outline" size="sm">
            Back
          </Button>
        </div>
        
        <Card className={`${currentAffirmationObj.background} border-0 shadow-md mb-6`}>
          <CardContent className="p-8 flex items-center justify-center min-h-[200px]">
            <p className={`text-center text-xl ${currentAffirmationObj.font}`}>
              "{currentAffirmationObj.text}"
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium">Practice With This Affirmation</h3>
            <div className="space-y-2">
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Say it aloud</h4>
                <p className="text-sm text-muted-foreground">Speak your affirmation with conviction. Saying it out loud increases its impact.</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Deep breathing</h4>
                <p className="text-sm text-muted-foreground">Take 3 deep breaths while focusing on your affirmation.</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">Visualization</h4>
                <p className="text-sm text-muted-foreground">Close your eyes and imagine this affirmation as true in your life right now.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-3">
          {!currentAffirmationObj.saved && (
            <Button onClick={handleSaveAffirmation} className="flex-1">
              Save to Collection
            </Button>
          )}
          <Button 
            onClick={() => {
              const random = getRandomAffirmation();
              handleSelectPreset(random);
            }} 
            variant="outline" 
            className="flex-1"
          >
            Next Affirmation
          </Button>
        </div>
      </div>
    );
  }
  
  // Saved affirmations view
  if (view === 'saved') {
    return (
      <div className="flex flex-col h-full p-4 max-w-lg mx-auto fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Affirmation Collection</h2>
          <Button onClick={() => setView('start')} variant="outline" size="sm">
            Back
          </Button>
        </div>
        
        {savedAffirmations.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">No saved affirmations</h3>
            <p className="text-muted-foreground mb-4">Create your first affirmation to add it to your collection</p>
            <Button onClick={() => setView('create')} className="btn-pulse">
              Create First Affirmation
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 overflow-y-auto flex-grow">
              {savedAffirmations.map((affirmation) => (
                <Card 
                  key={affirmation.id} 
                  className={`${affirmation.background} border-0 shadow-sm cursor-pointer hover:shadow transition-shadow`}
                  onClick={() => {
                    setCurrentAffirmationObj(affirmation);
                    setCurrentAffirmation(affirmation.text);
                    setBackground(affirmation.background);
                    setFont(affirmation.font);
                    setView('display');
                  }}
                >
                  <CardContent className="p-4 flex items-center justify-center min-h-[100px]">
                    <p className={`text-center ${affirmation.font}`}>
                      "{affirmation.text}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button onClick={() => setView('create')} className="mt-4 btn-pulse">
              Create New Affirmation
            </Button>
          </>
        )}
      </div>
    );
  }
  
  return null; // Fallback
};

export default PositiveAffirmationGenerator;