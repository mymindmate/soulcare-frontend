import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface GratitudeJournalGameProps {
  onComplete: () => void;
}

interface GratitudeEntry {
  id: number;
  text: string;
  date: string;
  category: string;
}

const rewardImages = [
  { name: 'Sunrise', description: 'A beautiful dawn signifying new beginnings', color: 'bg-orange-100' },
  { name: 'Garden', description: 'A flourishing garden showing progress', color: 'bg-emerald-100' },
  { name: 'Mountain', description: 'A majestic peak representing accomplishment', color: 'bg-blue-100' },
  { name: 'Rainbow', description: 'A rainbow symbolizing hope after challenges', color: 'bg-purple-100' },
  { name: 'Stars', description: 'Stars representing your growing gratitude practice', color: 'bg-indigo-100' },
];

const promptCategories = [
  { name: 'people', emoji: '👥', prompts: ["Someone who helped you recently", "A friend who makes you laugh", "A mentor who inspires you", "A family member you appreciate"] },
  { name: 'experiences', emoji: '✨', prompts: ["Something beautiful you saw today", "A skill you're grateful to have", "A pleasant surprise you experienced", "A moment of joy"] },
  { name: 'health', emoji: '💪', prompts: ["A part of your body you're thankful for", "A healthy habit you maintain", "A recovery you've experienced", "A meal that nourished you"] },
  { name: 'growth', emoji: '🌱', prompts: ["Something you learned recently", "A challenge you overcame", "A mistake that taught you something", "Progress you've made towards a goal"] },
  { name: 'simple joys', emoji: '☕', prompts: ["A simple pleasure you enjoyed today", "A comfort that makes your life better", "A favorite spot in your home", "A moment of peace"] },
];

const GratitudeJournalGame = ({ onComplete }: GratitudeJournalGameProps) => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activePrompt, setActivePrompt] = useState('');
  const [unlockedRewards, setUnlockedRewards] = useState<number[]>([]);
  const [view, setView] = useState<'start' | 'write' | 'journal' | 'rewards'>('start');
  const [journalStreak, setJournalStreak] = useState(0);
  
  const { toast } = useToast();
  
  // Load entries from local storage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('gratitudeEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    
    const savedRewards = localStorage.getItem('gratitudeRewards');
    if (savedRewards) {
      setUnlockedRewards(JSON.parse(savedRewards));
    } else {
      setUnlockedRewards([0]); // Unlock the first reward by default
    }
    
    const savedStreak = localStorage.getItem('gratitudeStreak');
    if (savedStreak) {
      setJournalStreak(parseInt(savedStreak, 10));
    }
  }, []);
  
  // Save entries to local storage when they change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('gratitudeEntries', JSON.stringify(entries));
    }
  }, [entries]);
  
  // Save rewards to local storage when they change
  useEffect(() => {
    localStorage.setItem('gratitudeRewards', JSON.stringify(unlockedRewards));
  }, [unlockedRewards]);
  
  // Save streak to local storage when it changes
  useEffect(() => {
    localStorage.setItem('gratitudeStreak', journalStreak.toString());
  }, [journalStreak]);
  
  // Handle saving a new entry
  const handleSaveEntry = () => {
    if (currentEntry.trim().length < 3) {
      toast({
        title: "Entry too short",
        description: "Please write at least a few words about what you're grateful for.",
      });
      return;
    }
    
    const newEntry: GratitudeEntry = {
      id: Date.now(),
      text: currentEntry,
      date: new Date().toISOString(),
      category: selectedCategory,
    };
    
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    setCurrentEntry('');
    setActivePrompt('');
    
    // Update streak and potentially unlock rewards
    const newStreak = journalStreak + 1;
    setJournalStreak(newStreak);
    
    // Check if a new reward should be unlocked
    if (newStreak % 3 === 0 && unlockedRewards.length < rewardImages.length) {
      const newRewardIndex = unlockedRewards.length;
      setUnlockedRewards([...unlockedRewards, newRewardIndex]);
      
      toast({
        title: "New reward unlocked!",
        description: `You've unlocked the ${rewardImages[newRewardIndex].name} image! Keep going with your gratitude practice.`,
        duration: 5000,
      });
    } else {
      toast({
        title: "Entry saved!",
        description: `That's entry #${updatedEntries.length}. ${newStreak % 3 === 0 ? 'You\'re making great progress!' : `${3 - (newStreak % 3)} more until your next reward!`}`,
        duration: 3000,
      });
    }
    
    setView('journal');
  };
  
  // Get random prompt from selected category
  const getRandomPrompt = (category: string) => {
    const categoryData = promptCategories.find(c => c.name === category);
    if (!categoryData) return '';
    
    const randomIndex = Math.floor(Math.random() * categoryData.prompts.length);
    return categoryData.prompts[randomIndex];
  };
  
  // Handle selecting a category
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setActivePrompt(getRandomPrompt(category));
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Start screen
  if (view === 'start') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 fade-in">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📔</span>
            </div>
            <h2 className="text-2xl font-bold mb-1">Gratitude Journal</h2>
            <p className="text-muted-foreground mb-3">
              Practice gratitude to cultivate positivity and unlock visual rewards
            </p>
          </div>
          
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Your Progress</p>
                  <p className="text-sm text-muted-foreground">Streak: {journalStreak} {journalStreak === 1 ? 'day' : 'days'}</p>
                </div>
                <div className="bg-primary/10 px-3 py-2 rounded-full text-sm font-medium">
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </div>
              </div>
              
              <Progress value={(journalStreak % 3) * 33.33} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground text-center">
                {3 - (journalStreak % 3)} more {3 - (journalStreak % 3) === 1 ? 'entry' : 'entries'} until your next reward
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button onClick={() => setView('write')} className="h-24 flex flex-col items-center justify-center btn-pulse">
              <span className="text-2xl mb-1">✏️</span>
              <span>New Entry</span>
            </Button>
            <Button onClick={() => setView('journal')} variant="outline" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">📚</span>
              <span>View Journal</span>
            </Button>
            <Button onClick={() => setView('rewards')} variant="outline" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🎁</span>
              <span>Rewards</span>
              {unlockedRewards.length < rewardImages.length && (
                <span className="text-xs">{unlockedRewards.length}/{rewardImages.length}</span>
              )}
            </Button>
            <Button onClick={onComplete} variant="outline" className="h-24 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🏠</span>
              <span>Exit Game</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Write view
  if (view === 'write') {
    return (
      <div className="flex flex-col h-full p-4 max-w-lg mx-auto fade-in">
        <h2 className="text-xl font-bold mb-4">What are you grateful for today?</h2>
        
        {!selectedCategory ? (
          <>
            <p className="text-muted-foreground mb-4">Choose a category to get started:</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {promptCategories.map((category) => (
                <Button 
                  key={category.name} 
                  onClick={() => handleSelectCategory(category.name)}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <span className="text-2xl mb-1">{category.emoji}</span>
                  <span className="capitalize">{category.name}</span>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            {activePrompt && (
              <div className="bg-muted/30 p-3 rounded-lg mb-4">
                <p className="text-sm italic">Prompt: {activePrompt}</p>
              </div>
            )}
            
            <Textarea 
              placeholder="Write your gratitude entry here..."
              className="flex-grow min-h-[200px] mb-4"
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
            />
            
            <div className="flex gap-3 mb-4">
              <Button onClick={() => setActivePrompt(getRandomPrompt(selectedCategory))} variant="outline">
                New Prompt
              </Button>
              <Button onClick={() => { setSelectedCategory(''); setActivePrompt(''); }} variant="outline">
                Change Category
              </Button>
            </div>
          </>
        )}
        
        <div className="flex gap-3 mt-auto">
          <Button onClick={() => setView('start')} variant="outline" className="flex-1">
            Cancel
          </Button>
          {selectedCategory && (
            <Button onClick={handleSaveEntry} className="flex-1 btn-pulse">
              Save Entry
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // Journal view
  if (view === 'journal') {
    return (
      <div className="flex flex-col h-full p-4 max-w-lg mx-auto fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Gratitude Journal</h2>
          <Button onClick={() => setView('start')} variant="outline" size="sm">
            Back
          </Button>
        </div>
        
        {entries.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">No entries yet</h3>
            <p className="text-muted-foreground mb-4">Start your gratitude practice by writing your first entry</p>
            <Button onClick={() => setView('write')} className="btn-pulse">
              Write First Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto flex-grow">
            {entries.map((entry) => {
              const category = promptCategories.find(c => c.name === entry.category);
              return (
                <Card key={entry.id} className="border border-muted">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <span className="text-xl mr-2">{category?.emoji || '✨'}</span>
                        <span className="text-sm text-muted-foreground capitalize">{entry.category || 'general'}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{entry.text}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {entries.length > 0 && (
          <Button onClick={() => setView('write')} className="mt-4 btn-pulse">
            Write New Entry
          </Button>
        )}
      </div>
    );
  }
  
  // Rewards view
  if (view === 'rewards') {
    return (
      <div className="flex flex-col h-full p-4 max-w-lg mx-auto fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Rewards</h2>
          <Button onClick={() => setView('start')} variant="outline" size="sm">
            Back
          </Button>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Keep writing in your gratitude journal to unlock all rewards. Each 3 entries unlocks a new reward.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-y-auto">
          {rewardImages.map((reward, index) => {
            const isUnlocked = unlockedRewards.includes(index);
            return (
              <Card key={index} className={`${isUnlocked ? reward.color : 'bg-muted/10'} border-0`}>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[180px] text-center">
                  {isUnlocked ? (
                    <>
                      <div className="text-4xl mb-3">{['🌅', '🌻', '⛰️', '🌈', '✨'][index]}</div>
                      <h3 className="font-bold mb-1">{reward.name}</h3>
                      <p className="text-sm">{reward.description}</p>
                    </>
                  ) : (
                    <>
                      <div className="text-4xl mb-3">🔒</div>
                      <h3 className="font-bold mb-1">Locked Reward</h3>
                      <p className="text-sm">Continue your gratitude practice to unlock</p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <Button onClick={() => setView('write')} className="mt-4 btn-pulse">
          Write New Entry
        </Button>
      </div>
    );
  }
  
  return null; // Fallback
};

export default GratitudeJournalGame;