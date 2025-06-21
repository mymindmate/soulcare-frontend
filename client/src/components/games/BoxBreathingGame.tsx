import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface BoxBreathingGameProps {
  onComplete: () => void;
}

const BoxBreathingGame = ({ onComplete }: BoxBreathingGameProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2' | 'rest'>('rest');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [totalCycles, setTotalCycles] = useState(3);
  const [boxScale, setBoxScale] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [breathingRate, setBreathingRate] = useState(4); // seconds for each phase
  
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Start the breathing exercise
  const startExercise = () => {
    setIsStarted(true);
    setCurrentCycle(1);
    setCurrentPhase('inhale');
    setSecondsLeft(breathingRate);
    setBoxScale(1);
    setCompleted(false);
  };
  
  // Stop the breathing exercise
  const stopExercise = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsStarted(false);
    setCurrentPhase('rest');
    setBoxScale(1);
  };
  
  // Handle completion of exercise
  const handleComplete = () => {
    stopExercise();
    setCompleted(true);
    toast({
      title: "Box Breathing complete!",
      description: "Great job! Notice how your body feels more relaxed now.",
      duration: 5000,
    });
  };
  
  // Effect to handle the breathing timer
  useEffect(() => {
    if (isStarted && !timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            // Move to next phase or cycle
            if (currentPhase === 'inhale') {
              setCurrentPhase('hold1');
              setBoxScale(1.5); // Expanded for first hold
              return breathingRate;
            } else if (currentPhase === 'hold1') {
              setCurrentPhase('exhale');
              return breathingRate;
            } else if (currentPhase === 'exhale') {
              setCurrentPhase('hold2');
              setBoxScale(1); // Contracted for second hold
              return breathingRate;
            } else if (currentPhase === 'hold2') {
              // Check if we need to move to the next cycle
              if (currentCycle >= totalCycles) {
                handleComplete();
                return 0;
              }
              
              setCurrentCycle(prev => prev + 1);
              setCurrentPhase('inhale');
              return breathingRate;
            }
            return 0;
          }
          
          // Update box scale based on current phase
          if (currentPhase === 'inhale') {
            // Gradually expand from 1 to 1.5
            const progress = 1 - (prev - 1) / breathingRate;
            const newScale = 1 + (0.5 * progress);
            setBoxScale(newScale);
          } else if (currentPhase === 'exhale') {
            // Gradually contract from 1.5 to 1
            const progress = 1 - (prev - 1) / breathingRate;
            const newScale = 1.5 - (0.5 * progress);
            setBoxScale(newScale);
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
  }, [isStarted, currentPhase, currentCycle, breathingRate, totalCycles]);
  
  // Get instruction text based on current phase
  const getInstructionText = () => {
    if (!isStarted) return "Press Start to begin";
    switch (currentPhase) {
      case 'inhale': return "Breathe In...";
      case 'hold1': return "Hold...";
      case 'exhale': return "Breathe Out...";
      case 'hold2': return "Hold...";
      default: return "Relax...";
    }
  };
  
  // Get progress percentage for current phase
  const getPhaseProgress = () => {
    if (!isStarted) return 0;
    return ((breathingRate - secondsLeft) / breathingRate) * 100;
  };
  
  // Calculate overall progress of the exercise
  const getOverallProgress = () => {
    if (!isStarted) return 0;
    if (completed) return 100;
    
    const totalPhases = 4; // inhale, hold1, exhale, hold2
    const totalTime = totalCycles * totalPhases * breathingRate;
    const completedCycles = currentCycle - 1;
    const completedTime = completedCycles * totalPhases * breathingRate;
    
    let currentPhaseIndex;
    switch (currentPhase) {
      case 'inhale': currentPhaseIndex = 0; break;
      case 'hold1': currentPhaseIndex = 1; break;
      case 'exhale': currentPhaseIndex = 2; break;
      case 'hold2': currentPhaseIndex = 3; break;
      default: return 0;
    }
    
    const currentPhaseTime = (currentPhaseIndex * breathingRate) + (breathingRate - secondsLeft);
    return ((completedTime + currentPhaseTime) / totalTime) * 100;
  };
  
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center p-4 max-h-[calc(100vh-120px)] fade-in">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Exercise Complete!</CardTitle>
            <CardDescription className="text-center">
              You've completed {totalCycles} cycles of box breathing.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-32 h-32 flex items-center justify-center mb-6 bg-primary/10 rounded-xl">
              <div className="text-5xl">🧘</div>
            </div>
            <p className="text-center mb-4">
              Notice how your breathing has slowed down and your body feels more relaxed.
              Box breathing helps activate your parasympathetic nervous system, reducing stress.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setCompleted(false)}>
              Try Again
            </Button>
            <Button onClick={onComplete} className="btn-pulse">
              Exit
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="fade-in max-h-[80vh] overflow-y-auto">
      {!isStarted ? (
        <div className="p-4 flex flex-col items-center justify-center max-h-[calc(100vh-120px)]">
          <div className="max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🧘</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">Box Breathing Technique</h2>
              <p className="text-muted-foreground mb-6">
                A simple yet powerful breathing method to reduce stress and increase focus
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">How it works:</h3>
                <p className="text-sm mb-3">Box breathing follows a simple square pattern:</p>
                <ol className="text-sm list-decimal list-inside space-y-1">
                  <li>Inhale slowly for {breathingRate} seconds</li>
                  <li>Hold your breath for {breathingRate} seconds</li>
                  <li>Exhale slowly for {breathingRate} seconds</li>
                  <li>Hold your breath for {breathingRate} seconds</li>
                </ol>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Breathing pace:</h3>
                  <p className="text-xs text-muted-foreground">{breathingRate} seconds per phase</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setBreathingRate(Math.max(2, breathingRate - 1))}
                    disabled={breathingRate <= 2}
                  >
                    Faster
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setBreathingRate(Math.min(8, breathingRate + 1))}
                    disabled={breathingRate >= 8}
                  >
                    Slower
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium">Number of cycles:</h3>
                  <p className="text-xs text-muted-foreground">Total duration: {totalCycles * 4 * breathingRate} seconds</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setTotalCycles(Math.max(1, totalCycles - 1))}
                    disabled={totalCycles <= 1}
                  >
                    Fewer
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setTotalCycles(Math.min(10, totalCycles + 1))}
                    disabled={totalCycles >= 10}
                  >
                    More
                  </Button>
                </div>
              </div>
              
              <Button onClick={startExercise} className="w-full btn-pulse">
                Start Breathing Exercise
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 max-h-[calc(100vh-120px)]">
          <div className="flex flex-col items-center max-w-md w-full space-y-8 fade-in">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-1">{getInstructionText()}</h2>
              <p className="text-muted-foreground">
                Cycle {currentCycle} of {totalCycles}
              </p>
            </div>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Box animation */}
              <div 
                className="w-40 h-40 border-4 border-primary transition-transform duration-1000 ease-in-out rounded-xl bg-primary/10"
                style={{ transform: `scale(${boxScale})` }}
              />
              
              {/* Timer overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{secondsLeft}</span>
              </div>
            </div>
            
            <div className="w-full space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Phase Progress</span>
                  <span>{Math.round(getPhaseProgress())}%</span>
                </div>
                <Progress value={getPhaseProgress()} className="h-2" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round(getOverallProgress())}%</span>
                </div>
                <Progress value={getOverallProgress()} className="h-2" />
              </div>
              
              <Button variant="outline" onClick={stopExercise} className="w-full">
                Stop Exercise
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoxBreathingGame;