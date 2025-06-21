import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface VirtualPetCompanionProps {
  onComplete: () => void;
}

interface Pet {
  name: string;
  type: 'cat' | 'dog' | 'bunny';
  happiness: number;
  energy: number;
  cleanliness: number;
  health: number;
  lastFed: number;
  lastPlayed: number;
  lastCleaned: number;
  lastCared: number;
  moodMessage: string;
  createdAt: number;
  mood: 'happy' | 'content' | 'sad' | 'unwell';
  selfCareReminders: string[];
}

interface Activity {
  type: 'feed' | 'play' | 'clean' | 'care';
  timestamp: number;
  happiness: number;
  energy: number;
  cleanliness: number;
  health: number;
}

const VirtualPetCompanion = ({ onComplete }: VirtualPetCompanionProps) => {
  const [view, setView] = useState<'intro' | 'create' | 'main' | 'activities' | 'advice'>('intro');
  const [pet, setPet] = useState<Pet | null>(null);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<'cat' | 'dog' | 'bunny'>('cat');
  const [activityHistory, setActivityHistory] = useState<Activity[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  
  const { toast } = useToast();
  const timerRef = useRef<number | null>(null);
  
  // Load pet data from localStorage on mount
  useEffect(() => {
    const savedPet = localStorage.getItem('virtualPet');
    if (savedPet) {
      setPet(JSON.parse(savedPet));
      setView('main');
    }
    
    const savedActivities = localStorage.getItem('petActivities');
    if (savedActivities) {
      setActivityHistory(JSON.parse(savedActivities));
    }
  }, []);
  
  // Save pet data to localStorage when it changes
  useEffect(() => {
    if (pet) {
      localStorage.setItem('virtualPet', JSON.stringify(pet));
    }
  }, [pet]);
  
  // Save activity history to localStorage when it changes
  useEffect(() => {
    if (activityHistory.length > 0) {
      localStorage.setItem('petActivities', JSON.stringify(activityHistory));
    }
  }, [activityHistory]);
  
  // Update pet stats over time
  useEffect(() => {
    if (pet && view === 'main') {
      // Check if timer is already running
      if (!timerRef.current) {
        timerRef.current = window.setInterval(() => {
          updatePetStatus();
        }, 10000); // Update every 10 seconds
      }
    } else if (timerRef.current) {
      // Clear timer if not on main view
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pet, view]);
  
  // Create a new pet
  const createPet = () => {
    if (!newPetName.trim()) {
      toast({
        title: "Name required",
        description: "Please give your pet a name.",
        duration: 3000,
      });
      return;
    }
    
    const newPet: Pet = {
      name: newPetName,
      type: newPetType,
      happiness: 70,
      energy: 80,
      cleanliness: 90,
      health: 100,
      lastFed: Date.now(),
      lastPlayed: Date.now(),
      lastCleaned: Date.now(),
      lastCared: Date.now(),
      moodMessage: "I'm happy to meet you!",
      createdAt: Date.now(),
      mood: 'happy',
      selfCareReminders: [
        "Remember to drink water today!",
        "Have you taken a break recently?",
        "Take a moment for deep breathing.",
        "Stretch your body for a few minutes.",
        "Remember to eat regular meals today."
      ]
    };
    
    setPet(newPet);
    setView('main');
    setShowTutorial(true);
    
    toast({
      title: `${newPet.name} has joined you!`,
      description: "Take good care of your new companion.",
      duration: 4000,
    });
  };
  
  // Update pet status based on time passed
  const updatePetStatus = () => {
    if (!pet) return;
    
    const now = Date.now();
    const hoursSinceLastFed = (now - pet.lastFed) / (1000 * 60 * 60);
    const hoursSinceLastPlayed = (now - pet.lastPlayed) / (1000 * 60 * 60);
    const hoursSinceLastCleaned = (now - pet.lastCleaned) / (1000 * 60 * 60);
    
    // For easier testing, increase the decay rate
    // In a real app, these rates would be more reasonable
    const energyDecay = hoursSinceLastFed * 5;
    const happinessDecay = hoursSinceLastPlayed * 3;
    const cleanlinessDecay = hoursSinceLastCleaned * 2;
    
    // Calculate new stats
    const newEnergy = Math.max(0, pet.energy - energyDecay);
    const newHappiness = Math.max(0, pet.happiness - happinessDecay);
    const newCleanliness = Math.max(0, pet.cleanliness - cleanlinessDecay);
    
    // Health is affected by all other stats
    const newHealth = Math.max(0, (
      pet.health - 
      (hoursSinceLastFed > 8 ? 2 : 0) - 
      (hoursSinceLastPlayed > 12 ? 1 : 0) - 
      (hoursSinceLastCleaned > 24 ? 3 : 0)
    ));
    
    // Determine mood based on stats
    let newMood: 'happy' | 'content' | 'sad' | 'unwell' = 'content';
    let newMoodMessage = "I'm doing okay.";
    
    const averageStat = (newEnergy + newHappiness + newCleanliness) / 3;
    
    if (newHealth < 30) {
      newMood = 'unwell';
      newMoodMessage = "I don't feel very well...";
    } else if (averageStat < 30) {
      newMood = 'sad';
      newMoodMessage = "I'm feeling a bit neglected.";
    } else if (averageStat > 70) {
      newMood = 'happy';
      newMoodMessage = "I'm so happy to be with you!";
    }
    
    // Generate self-care reminders based on pet needs
    let selfCareReminders = [...pet.selfCareReminders];
    
    if (newEnergy < 30) {
      selfCareReminders = [
        "Your pet needs food. Have you eaten recently?",
        "Taking time to nourish yourself is important.",
        ...selfCareReminders.slice(2)
      ];
    }
    
    if (newHappiness < 30) {
      selfCareReminders = [
        ...selfCareReminders.slice(0, 2),
        "Your pet needs playtime. Consider taking a fun break yourself!",
        "Doing something you enjoy can boost your mood too.",
        ...selfCareReminders.slice(4)
      ];
    }
    
    if (newCleanliness < 30) {
      selfCareReminders = [
        ...selfCareReminders.slice(0, 4),
        "Your pet needs cleaning. Taking care of your space can help you feel better too."
      ];
    }
    
    // Update pet with new stats
    setPet({
      ...pet,
      energy: newEnergy,
      happiness: newHappiness,
      cleanliness: newCleanliness,
      health: newHealth,
      mood: newMood,
      moodMessage: newMoodMessage,
      selfCareReminders
    });
  };
  
  // Pet care actions
  const feedPet = () => {
    if (!pet) return;
    
    const newEnergy = Math.min(100, pet.energy + 30);
    const newHealth = Math.min(100, pet.health + 5);
    
    setPet({
      ...pet,
      energy: newEnergy,
      health: newHealth,
      lastFed: Date.now(),
      moodMessage: "Yum! Thank you for the food!"
    });
    
    // Add to activity history
    const activity: Activity = {
      type: 'feed',
      timestamp: Date.now(),
      happiness: pet.happiness,
      energy: newEnergy,
      cleanliness: pet.cleanliness,
      health: newHealth
    };
    
    setActivityHistory([activity, ...activityHistory]);
    
    toast({
      title: `${pet.name} has been fed!`,
      description: "Your pet's energy has increased.",
      duration: 3000,
    });
  };
  
  const playWithPet = () => {
    if (!pet) return;
    
    const newHappiness = Math.min(100, pet.happiness + 25);
    const newEnergy = Math.max(0, pet.energy - 10);
    const newHealth = Math.min(100, pet.health + 3);
    
    setPet({
      ...pet,
      happiness: newHappiness,
      energy: newEnergy,
      health: newHealth,
      lastPlayed: Date.now(),
      moodMessage: "That was so fun! Let's play again soon!"
    });
    
    // Add to activity history
    const activity: Activity = {
      type: 'play',
      timestamp: Date.now(),
      happiness: newHappiness,
      energy: newEnergy,
      cleanliness: pet.cleanliness,
      health: newHealth
    };
    
    setActivityHistory([activity, ...activityHistory]);
    
    toast({
      title: `Playtime with ${pet.name}!`,
      description: "Your pet is happier now!",
      duration: 3000,
    });
  };
  
  const cleanPet = () => {
    if (!pet) return;
    
    const newCleanliness = Math.min(100, pet.cleanliness + 40);
    const newHealth = Math.min(100, pet.health + 3);
    
    setPet({
      ...pet,
      cleanliness: newCleanliness,
      health: newHealth,
      lastCleaned: Date.now(),
      moodMessage: "I feel so fresh and clean now!"
    });
    
    // Add to activity history
    const activity: Activity = {
      type: 'clean',
      timestamp: Date.now(),
      happiness: pet.happiness,
      energy: pet.energy,
      cleanliness: newCleanliness,
      health: newHealth
    };
    
    setActivityHistory([activity, ...activityHistory]);
    
    toast({
      title: `${pet.name} is clean!`,
      description: "Your pet feels refreshed.",
      duration: 3000,
    });
  };
  
  const carePet = () => {
    if (!pet) return;
    
    const newHappiness = Math.min(100, pet.happiness + 15);
    const newHealth = Math.min(100, pet.health + 15);
    
    setPet({
      ...pet,
      happiness: newHappiness,
      health: newHealth,
      lastCared: Date.now(),
      moodMessage: "I feel so loved and cared for!"
    });
    
    // Add to activity history
    const activity: Activity = {
      type: 'care',
      timestamp: Date.now(),
      happiness: newHappiness,
      energy: pet.energy,
      cleanliness: pet.cleanliness,
      health: newHealth
    };
    
    setActivityHistory([activity, ...activityHistory]);
    
    toast({
      title: "Special care provided!",
      description: `${pet.name} feels loved and their health has improved.`,
      duration: 3000,
    });
  };
  
  // Reset pet (for debugging or if user wants to start over)
  const resetPet = () => {
    localStorage.removeItem('virtualPet');
    localStorage.removeItem('petActivities');
    setPet(null);
    setActivityHistory([]);
    setNewPetName('');
    setView('intro');
  };
  
  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  // Get pet emoji based on type and mood
  const getPetEmoji = () => {
    if (!pet) return '🐱';
    
    const emojiMap = {
      cat: {
        happy: '😺',
        content: '🐱',
        sad: '😿',
        unwell: '🙀'
      },
      dog: {
        happy: '🐶',
        content: '🐕',
        sad: '🐕‍🦺',
        unwell: '🐩'
      },
      bunny: {
        happy: '🐰',
        content: '🐇',
        sad: '🐇',
        unwell: '🐇'
      }
    };
    
    return emojiMap[pet.type][pet.mood];
  };
  
  // Get activity emoji
  const getActivityEmoji = (type: 'feed' | 'play' | 'clean' | 'care') => {
    const emojiMap = {
      feed: '🍲',
      play: '🎾',
      clean: '🧼',
      care: '❤️'
    };
    
    return emojiMap[type];
  };
  
  // Get status color
  const getStatusColor = (value: number) => {
    if (value >= 70) return 'bg-green-100 text-green-800';
    if (value >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Intro screen
  if (view === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center p-4 fade-in max-h-[80vh] overflow-y-auto">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🐱</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Virtual Pet Companion</h2>
          <p className="text-muted-foreground mb-6">
            Care for a virtual pet to encourage healthy self-care routines and reduce feelings of loneliness.
          </p>
          
          <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium">How It Works:</h3>
              <p className="text-sm text-muted-foreground">
                Your virtual pet requires regular feeding, play, and cleaning—just like real self-care! As you care for your pet, it will remind you to take care of yourself too.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-muted/30 p-2 rounded-lg">
                  <div className="text-2xl mb-1">🍲</div>
                  <p>Feed</p>
                </div>
                <div className="bg-muted/30 p-2 rounded-lg">
                  <div className="text-2xl mb-1">🎾</div>
                  <p>Play</p>
                </div>
                <div className="bg-muted/30 p-2 rounded-lg">
                  <div className="text-2xl mb-1">🧼</div>
                  <p>Clean</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-3">
            <Button onClick={() => setView('create')} className="flex-1 btn-pulse">
              Create Pet
            </Button>
            <Button onClick={onComplete} variant="outline" className="flex-1">
              Return to Arcade
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Create pet screen
  if (view === 'create') {
    return (
      <div className="flex flex-col items-center justify-center p-4 fade-in max-h-[80vh] overflow-y-auto">
        <div className="max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Create Your Pet</h2>
            <Button onClick={() => setView('intro')} variant="outline" size="sm">
              Back
            </Button>
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pet-name">Name Your Pet</Label>
                <Input 
                  id="pet-name" 
                  placeholder="Enter a name..." 
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  className="mb-2"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Choose Pet Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    onClick={() => setNewPetType('cat')}
                    className={`flex flex-col items-center justify-center p-3 rounded-md ${newPetType === 'cat' ? 'bg-primary/20 border-2 border-primary' : 'bg-muted/30 border border-muted'} cursor-pointer transition-all`}
                  >
                    <span className="text-3xl mb-1">🐱</span>
                    <span>Cat</span>
                  </div>
                  
                  <div
                    onClick={() => setNewPetType('dog')}
                    className={`flex flex-col items-center justify-center p-3 rounded-md ${newPetType === 'dog' ? 'bg-primary/20 border-2 border-primary' : 'bg-muted/30 border border-muted'} cursor-pointer transition-all`}
                  >
                    <span className="text-3xl mb-1">🐶</span>
                    <span>Dog</span>
                  </div>
                  
                  <div
                    onClick={() => setNewPetType('bunny')}
                    className={`flex flex-col items-center justify-center p-3 rounded-md ${newPetType === 'bunny' ? 'bg-primary/20 border-2 border-primary' : 'bg-muted/30 border border-muted'} cursor-pointer transition-all`}
                  >
                    <span className="text-3xl mb-1">🐰</span>
                    <span>Bunny</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pb-4">
              <Button onClick={createPet} className="w-full btn-pulse">
                Create My Pet
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  // Main pet view
  if (view === 'main' && pet) {
    return (
      <div className="flex flex-col p-4 max-w-lg mx-auto fade-in max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Virtual Pet Companion</h2>
          <div className="flex gap-2">
            <Button onClick={() => setView('activities')} variant="outline" size="sm">
              History
            </Button>
            <Button onClick={onComplete} variant="outline" size="sm">
              Exit
            </Button>
          </div>
        </div>
        
        {/* Tutorial Dialog */}
        {showTutorial && (
          <Card className="mb-4 border-primary border-2 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Welcome to Your Pet Companion!</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-full" 
                  onClick={() => setShowTutorial(false)}
                >
                  ✕
                </Button>
              </div>
              <p className="text-sm mt-2">
                Your pet needs regular care to stay happy and healthy. Take care of your pet by feeding, playing, and cleaning. As you do, your pet will remind you to take care of yourself too!
              </p>
            </CardContent>
          </Card>
        )}
        
        {/* Pet Display */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-lg">{pet.name}</h3>
                <p className="text-sm text-muted-foreground">{formatDate(pet.createdAt)}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pet.health)}`}>
                {pet.mood === 'happy' ? 'Happy' : pet.mood === 'content' ? 'Content' : pet.mood === 'sad' ? 'Sad' : 'Unwell'}
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-8xl mb-4 pet-bounce">{getPetEmoji()}</div>
              <p className="text-center italic text-sm">"{pet.moodMessage}"</p>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Energy</span>
                  <span>{Math.round(pet.energy)}%</span>
                </div>
                <Progress value={pet.energy} className="h-2" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Happiness</span>
                  <span>{Math.round(pet.happiness)}%</span>
                </div>
                <Progress value={pet.happiness} className="h-2" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Cleanliness</span>
                  <span>{Math.round(pet.cleanliness)}%</span>
                </div>
                <Progress value={pet.cleanliness} className="h-2" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Health</span>
                  <span>{Math.round(pet.health)}%</span>
                </div>
                <Progress value={pet.health} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Self-Care Reminder */}
        <Card className="mb-4 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Self-Care Reminder</h3>
            <p className="text-sm italic">
              {pet.selfCareReminders[Math.floor(Math.random() * pet.selfCareReminders.length)]}
            </p>
          </CardContent>
        </Card>
        
        {/* Pet Care Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button 
            onClick={feedPet} 
            className="flex items-center justify-center h-20 flex-col gap-2 bg-amber-100 text-amber-800 hover:bg-amber-200"
          >
            <span className="text-2xl">🍲</span>
            <span>Feed</span>
          </Button>
          
          <Button 
            onClick={playWithPet} 
            className="flex items-center justify-center h-20 flex-col gap-2 bg-green-100 text-green-800 hover:bg-green-200"
          >
            <span className="text-2xl">🎾</span>
            <span>Play</span>
          </Button>
          
          <Button 
            onClick={cleanPet} 
            className="flex items-center justify-center h-20 flex-col gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            <span className="text-2xl">🧼</span>
            <span>Clean</span>
          </Button>
          
          <Button 
            onClick={carePet} 
            className="flex items-center justify-center h-20 flex-col gap-2 bg-pink-100 text-pink-800 hover:bg-pink-200"
          >
            <span className="text-2xl">❤️</span>
            <span>Special Care</span>
          </Button>
        </div>
        
        <div className="text-center">
          <Button variant="link" size="sm" onClick={() => setView('advice')}>
            View Self-Care Advice
          </Button>
        </div>
        
        <style dangerouslySetInnerHTML={{ __html: `
          .pet-bounce {
            animation: petBounce 2s infinite alternate;
          }
          
          @keyframes petBounce {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
          }
        `}} />
      </div>
    );
  }
  
  // Activity history view
  if (view === 'activities' && pet) {
    return (
      <div className="flex flex-col p-4 max-w-lg mx-auto fade-in max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{pet.name}'s Activity</h2>
          <Button onClick={() => setView('main')} variant="outline" size="sm">
            Back
          </Button>
        </div>
        
        {activityHistory.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">No activities yet</h3>
            <p className="text-muted-foreground mb-4">Take care of your pet to see activities here</p>
            <Button onClick={() => setView('main')} className="btn-pulse">
              Care for {pet.name}
            </Button>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto">
            {activityHistory.map((activity, index) => (
              <Card key={index} className="border-muted">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center">
                        <span className="text-xl">{getActivityEmoji(activity.type)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium capitalize">{activity.type}</h4>
                        <p className="text-xs text-muted-foreground">{formatTime(activity.timestamp)} {formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      {activity.type === 'feed' && <span className="text-amber-600">+30 Energy</span>}
                      {activity.type === 'play' && <span className="text-green-600">+25 Happiness</span>}
                      {activity.type === 'clean' && <span className="text-blue-600">+40 Cleanliness</span>}
                      {activity.type === 'care' && <span className="text-pink-600">+15 Health</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Self-care advice view
  if (view === 'advice' && pet) {
    return (
      <div className="flex flex-col p-4 max-w-lg mx-auto fade-in max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Self-Care Tips</h2>
          <Button onClick={() => setView('main')} variant="outline" size="sm">
            Back
          </Button>
        </div>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Pet Care & Self-Care</CardTitle>
            <CardDescription>
              Just like your pet, you need regular care too!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🍲</span>
                  <h4 className="font-medium">Feeding</h4>
                </div>
                <p className="text-sm">
                  Regular, nourishing meals are important for both you and your pet.
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🎾</span>
                  <h4 className="font-medium">Playing</h4>
                </div>
                <p className="text-sm">
                  Taking breaks for fun activities improves mood and reduces stress.
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🧼</span>
                  <h4 className="font-medium">Cleaning</h4>
                </div>
                <p className="text-sm">
                  A clean environment can help create mental clarity and reduced anxiety.
                </p>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">❤️</span>
                  <h4 className="font-medium">Special Care</h4>
                </div>
                <p className="text-sm">
                  Taking extra care of yourself during difficult times is essential for wellbeing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Reminders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2">
              {pet.selfCareReminders.map((reminder, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm">
                    {index + 1}
                  </div>
                  <span>{reminder}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Fallback
  return (
    <div className="flex flex-col items-center justify-center p-4 fade-in max-h-[80vh] overflow-y-auto">
      <div className="text-6xl mb-6">🐱</div>
      <h3 className="text-xl font-bold mb-3">Loading Pet Companion...</h3>
      <Button onClick={onComplete} className="btn-pulse">
        Return to Arcade
      </Button>
    </div>
  );
};

export default VirtualPetCompanion;
