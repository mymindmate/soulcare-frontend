import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface GuidedMeditationAdventureProps {
  onComplete: () => void;
}

// Define scenes for the guided journey
const SCENES = [
  {
    id: 'intro',
    title: 'Begin Your Journey',
    description: 'Find a comfortable position and take a few deep breaths to prepare for your journey.',
    backgroundDescription: 'A path leading into a peaceful forest, dappled with gentle sunlight.',
    instruction: 'Take 3 deep breaths to begin...',
    backgroundGradient: 'from-green-100 to-blue-100',
    duration: 10, // seconds
  },
  {
    id: 'forest-entry',
    title: 'Entering the Forest',
    description: 'As you walk along the path, notice the tall trees surrounding you. Feel the gentle breeze against your skin.',
    backgroundDescription: 'Ancient trees create a natural canopy, with streams of sunlight breaking through the leaves.',
    instruction: 'Focus on your steps, slow and steady...',
    backgroundGradient: 'from-green-200 to-emerald-100',
    duration: 20,
  },
  {
    id: 'stream',
    title: 'The Calming Stream',
    description: 'You come across a small stream. Listen to the gentle sound of water flowing over smooth stones.',
    backgroundDescription: 'A crystal-clear stream meanders through moss-covered rocks.',
    instruction: 'Breathe in time with the flowing water...',
    backgroundGradient: 'from-blue-100 to-cyan-50',
    duration: 20,
  },
  {
    id: 'clearing',
    title: 'The Peaceful Clearing',
    description: 'The path opens to a sunlit clearing filled with wildflowers. Find a spot to sit and take in the natural beauty around you.',
    backgroundDescription: 'A serene meadow dotted with colorful wildflowers, surrounded by protective trees.',
    instruction: 'Notice three things you can see in this special place...',
    backgroundGradient: 'from-yellow-50 to-green-50',
    duration: 25,
  },
  {
    id: 'sky',
    title: 'Boundless Sky',
    description: 'Looking up, you see the vast open sky. Watch as clouds slowly drift by, changing shape as they go.',
    backgroundDescription: 'The expansive blue sky, with soft white clouds floating peacefully.',
    instruction: 'Let your thoughts drift by like clouds...',
    backgroundGradient: 'from-blue-100 to-sky-50',
    duration: 20,
  },
  {
    id: 'wisdom',
    title: 'Finding Inner Wisdom',
    description: 'In this peaceful space, you can access your inner wisdom. What message does your heart have for you today?',
    backgroundDescription: 'A magical ancient tree with roots that seem to reach to the center of the earth.',
    instruction: 'Listen to what your heart wants to tell you...',
    backgroundGradient: 'from-violet-100 to-purple-50',
    duration: 25,
  },
  {
    id: 'return',
    title: 'Returning With Peace',
    description: "It's time to bring this sense of peace back with you. Take a moment to express gratitude for this journey.",
    backgroundDescription: 'The path leading back, now bathed in golden light.',
    instruction: 'Feel gratitude for this moment of peace...',
    backgroundGradient: 'from-amber-100 to-orange-50',
    duration: 15,
  },
  {
    id: 'completion',
    title: 'Journey Complete',
    description: 'Slowly bring your awareness back to your surroundings. You can revisit this peaceful place whenever you need.',
    backgroundDescription: 'A gentle transition back to the present moment.',
    instruction: 'Take three deep breaths to complete your journey...',
    backgroundGradient: 'from-blue-50 to-indigo-50',
    duration: 15,
  },
];

const GuidedMeditationAdventure = ({ onComplete }: GuidedMeditationAdventureProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isMusical, setIsMusical] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  const currentScene = SCENES[currentSceneIndex];
  
  // Start the meditation journey
  const startJourney = () => {
    setIsPlaying(true);
    setCurrentSceneIndex(0);
    setTimeLeft(SCENES[0].duration);
    setIsCompleted(false);
    
    // Welcome toast
    toast({
      title: "Journey Beginning",
      description: "Find a comfortable position and let's begin...",
      duration: 3000,
    });
  };
  
  // Navigate to the next scene
  const nextScene = () => {
    if (currentSceneIndex < SCENES.length - 1) {
      const nextIndex = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIndex);
      setTimeLeft(SCENES[nextIndex].duration);
    } else {
      // Journey completed
      completeJourney();
    }
  };
  
  // Navigate to the previous scene
  const prevScene = () => {
    if (currentSceneIndex > 0) {
      const prevIndex = currentSceneIndex - 1;
      setCurrentSceneIndex(prevIndex);
      setTimeLeft(SCENES[prevIndex].duration);
    }
  };
  
  // Complete the journey
  const completeJourney = () => {
    setIsPlaying(false);
    setIsCompleted(true);
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    toast({
      title: "Journey Complete",
      description: "You've completed your meditation journey. How do you feel now?",
      duration: 5000,
    });
  };
  
  // Effect to handle the timer
  useEffect(() => {
    if (isPlaying && !timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time is up for this scene
            if (autoAdvance) {
              nextScene();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, autoAdvance]);
  
  // Generate breathing guidance based on the current scene
  const getBreathingInstruction = () => {
    if (currentSceneIndex <= 1) {
      return "Breathe deeply and slowly...";
    } else if (currentSceneIndex === 2) {
      return "Breathe in for 4, out for 6...";
    } else if (currentSceneIndex === 3) {
      return "Allow your breath to find its natural rhythm...";
    } else if (currentSceneIndex >= 4) {
      return "Notice how your breath has become calm and steady...";
    }
    return "Breathe mindfully...";
  };
  
  // Calculate progress percentage
  const calculateProgress = () => {
    if (!isPlaying) return 0;
    if (isCompleted) return 100;
    
    // Total progress through scenes
    const totalDuration = SCENES.reduce((sum, scene) => sum + scene.duration, 0);
    const completedDuration = SCENES.slice(0, currentSceneIndex).reduce((sum, scene) => sum + scene.duration, 0);
    const currentProgress = completedDuration + (currentScene.duration - timeLeft);
    
    return (currentProgress / totalDuration) * 100;
  };
  
  return (
    <div className="h-full fade-in">
      {!isPlaying && !isCompleted ? (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🌄</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Peaceful Journey Meditation</h2>
            
            <p className="text-muted-foreground mb-6">
              A guided meditation through nature's most calming landscapes. This journey will help ease anxiety and bring a sense of peace.
            </p>
            
            <div className="bg-muted/30 p-4 rounded-lg mb-6 w-full">
              <h4 className="font-medium mb-2">Journey Settings:</h4>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm">Auto-advance through scenes</span>
                <Button 
                  size="sm" 
                  variant={autoAdvance ? "default" : "outline"}
                  onClick={() => setAutoAdvance(!autoAdvance)}
                >
                  {autoAdvance ? "On" : "Off"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Ambient nature sounds</span>
                <Button 
                  size="sm" 
                  variant={isMusical ? "default" : "outline"}
                  onClick={() => setIsMusical(!isMusical)}
                >
                  {isMusical ? "On" : "Off"}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-6">
              Duration: approximately {Math.ceil(SCENES.reduce((sum, scene) => sum + scene.duration, 0) / 60)} minutes
            </div>
            
            <Button onClick={startJourney} className="btn-pulse w-full">
              Begin Your Journey
            </Button>
          </div>
        </div>
      ) : isCompleted ? (
        <div className="h-full flex flex-col items-center justify-center p-6">
          <div className="max-w-md text-center">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">😌</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Journey Completed</h2>
            
            <p className="text-muted-foreground mb-6">
              You've completed your meditation journey. Take a moment to notice how you feel now.
            </p>
            
            <div className="bg-primary/10 p-5 rounded-lg mb-6">
              <h4 className="font-medium mb-2">Reflection:</h4>
              <p className="text-sm">
                What insights or feelings arose during your journey? Remember that you can return to any of these peaceful places in your mind whenever you need a moment of calm.
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={startJourney}>
                Journey Again
              </Button>
              <Button onClick={onComplete} className="btn-pulse">
                Return to Arcade
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Guided Meditation</h2>
            <Button variant="outline" size="sm" onClick={onComplete}>
              Exit
            </Button>
          </div>
          
          <div 
            className={`flex-grow mb-4 overflow-hidden rounded-lg transition-colors duration-1000 ease-in-out bg-gradient-to-br ${currentScene.backgroundGradient}`}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{currentScene.title}</h3>
                  <div className="text-sm">
                    Scene {currentSceneIndex + 1} of {SCENES.length}
                  </div>
                </div>
                
                <div className="text-3xl font-bold">{timeLeft}</div>
              </div>
              
              <div className="flex-grow flex flex-col items-center justify-center text-center p-4 my-4 rounded-lg bg-white/20 backdrop-blur-sm transition-opacity duration-1000 fade-in">
                <p className="italic text-sm mb-4 text-muted-foreground">
                  {currentScene.backgroundDescription}
                </p>
                
                <p className="mb-6 max-w-md text-lg">
                  {currentScene.description}
                </p>
                
                <div className="w-16 h-16 rounded-full bg-white/40 flex items-center justify-center text-lg font-medium mb-6 animate-pulse">
                  Breathe
                </div>
                
                <p className="font-medium mb-2">{currentScene.instruction}</p>
                <p className="text-sm text-muted-foreground">{getBreathingInstruction()}</p>
              </div>
              
              <div className="mt-auto">
                <div className="flex justify-between text-sm mb-1">
                  <span>Journey Progress</span>
                  <span>{Math.round(calculateProgress())}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2 mb-4" />
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={prevScene}
                    disabled={currentSceneIndex === 0}
                  >
                    Previous Scene
                  </Button>
                  
                  {!autoAdvance && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={nextScene}
                    >
                      Next Scene
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidedMeditationAdventure;