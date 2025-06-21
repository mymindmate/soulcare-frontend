import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface BreathingLotusProps {
  onComplete: () => void;
}

// Breathing patterns for different stress levels
const BREATHING_PATTERNS = {
  high: { inhale: 4, hold: 7, exhale: 8, cycles: 3 }, // 4-7-8 technique for high stress
  medium: { inhale: 4, hold: 4, exhale: 4, cycles: 5 }, // Box breathing for medium stress
  low: { inhale: 6, hold: 0, exhale: 6, cycles: 7 }, // Deep breathing for low stress
};

const BreathingLotus = ({ onComplete }: BreathingLotusProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [selectedPattern, setSelectedPattern] = useState<'high' | 'medium' | 'low'>('medium');
  const [customPattern, setCustomPattern] = useState({ inhale: 4, hold: 4, exhale: 4, cycles: 5 });
  const [isCustom, setIsCustom] = useState(false);
  const [lotusScale, setLotusScale] = useState(1);
  const [completed, setCompleted] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  const pattern = isCustom ? customPattern : BREATHING_PATTERNS[selectedPattern];
  const totalCycles = pattern.cycles;
  
  // Calculate total exercise time
  const calculateTotalTime = () => {
    return pattern.cycles * (pattern.inhale + pattern.hold + pattern.exhale);
  };
  
  // Start the breathing exercise
  const startExercise = () => {
    setIsStarted(true);
    setCurrentCycle(1);
    setCurrentPhase('inhale');
    setSecondsLeft(pattern.inhale);
    setLotusScale(1);
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
    setLotusScale(1);
  };
  
  // Handle completion of exercise
  const handleComplete = () => {
    stopExercise();
    setCompleted(true);
    toast({
      title: "Breathing exercise completed!",
      description: "Great job! How do you feel?",
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
              setCurrentPhase(pattern.hold > 0 ? 'hold' : 'exhale');
              setLotusScale(1.5); // Expanded for hold
              return pattern.hold > 0 ? pattern.hold : pattern.exhale;
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
              return pattern.exhale;
            } else if (currentPhase === 'exhale') {
              // Check if we need to move to the next cycle
              if (currentCycle >= totalCycles) {
                handleComplete();
                return 0;
              }
              
              setCurrentCycle(prev => prev + 1);
              setCurrentPhase('inhale');
              setLotusScale(1); // Reset for inhale
              return pattern.inhale;
            }
            return 0;
          }
          
          // Update lotus scale based on current phase
          if (currentPhase === 'inhale') {
            // Gradually expand from 1 to 1.5
            const progress = 1 - (prev - 1) / pattern.inhale;
            const newScale = 1 + (0.5 * progress);
            setLotusScale(newScale);
          } else if (currentPhase === 'exhale') {
            // Gradually contract from 1.5 to 1
            const progress = 1 - (prev - 1) / pattern.exhale;
            const newScale = 1.5 - (0.5 * progress);
            setLotusScale(newScale);
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
  }, [isStarted, currentPhase, currentCycle, pattern, totalCycles]);
  
  // Get instruction text based on current phase
  const getInstructionText = () => {
    if (!isStarted) return "Press Start to begin";
    switch (currentPhase) {
      case 'inhale': return "Breathe In...";
      case 'hold': return "Hold...";
      case 'exhale': return "Breathe Out...";
      default: return "Relax...";
    }
  };
  
  // Get progress percentage
  const getPhaseProgress = () => {
    if (!isStarted) return 0;
    
    let totalPhaseTime;
    switch (currentPhase) {
      case 'inhale': totalPhaseTime = pattern.inhale; break;
      case 'hold': totalPhaseTime = pattern.hold; break;
      case 'exhale': totalPhaseTime = pattern.exhale; break;
      default: return 0;
    }
    
    return ((totalPhaseTime - secondsLeft) / totalPhaseTime) * 100;
  };
  
  // Calculate overall progress of the exercise
  const getOverallProgress = () => {
    if (!isStarted) return 0;
    if (completed) return 100;
    
    const totalTime = calculateTotalTime();
    const timePerCycle = pattern.inhale + pattern.hold + pattern.exhale;
    const completedCycles = currentCycle - 1;
    const completedTime = completedCycles * timePerCycle;
    
    let currentPhaseTime;
    switch (currentPhase) {
      case 'inhale': 
        currentPhaseTime = pattern.inhale - secondsLeft;
        break;
      case 'hold': 
        currentPhaseTime = pattern.inhale + (pattern.hold - secondsLeft);
        break;
      case 'exhale': 
        currentPhaseTime = pattern.inhale + pattern.hold + (pattern.exhale - secondsLeft);
        break;
      default:
        currentPhaseTime = 0;
    }
    
    return ((completedTime + currentPhaseTime) / totalTime) * 100;
  };
  
  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center p-4 max-h-[80vh] overflow-y-auto">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Exercise Complete!</CardTitle>
            <CardDescription className="text-center">
              You've completed {totalCycles} cycles of breathing exercises.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <div className="text-6xl">🙏</div>
            </div>
            <p className="text-center mb-4">
              Take a moment to notice how you feel. Your breathing has now slowed down, 
              and your body may feel more relaxed.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setCompleted(false)}>
              Try Again
            </Button>
            <Button onClick={onComplete}>
              Exit
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-4 max-h-[80vh] overflow-y-auto">
      {!isStarted ? (
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Breathing Lotus</CardTitle>
            <CardDescription className="text-center">
              Follow the expanding and contracting lotus flower to guide your breathing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Select a breathing pattern:</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={selectedPattern === 'high' && !isCustom ? "default" : "outline"} 
                    onClick={() => { setSelectedPattern('high'); setIsCustom(false); }}
                    className="w-full"
                    size="sm"
                  >
                    High Stress
                  </Button>
                  <Button 
                    variant={selectedPattern === 'medium' && !isCustom ? "default" : "outline"} 
                    onClick={() => { setSelectedPattern('medium'); setIsCustom(false); }}
                    className="w-full"
                    size="sm"
                  >
                    Medium Stress
                  </Button>
                  <Button 
                    variant={selectedPattern === 'low' && !isCustom ? "default" : "outline"} 
                    onClick={() => { setSelectedPattern('low'); setIsCustom(false); }}
                    className="w-full"
                    size="sm"
                  >
                    Low Stress
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Custom breathing pattern:</h3>
                  <Button 
                    variant={isCustom ? "default" : "outline"} 
                    onClick={() => setIsCustom(!isCustom)}
                    size="sm"
                  >
                    {isCustom ? "Using Custom" : "Use Custom"}
                  </Button>
                </div>
                
                {isCustom && (
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Inhale: {customPattern.inhale}s</span>
                      </div>
                      <Slider 
                        min={2} 
                        max={8} 
                        step={1} 
                        value={[customPattern.inhale]} 
                        onValueChange={(value) => setCustomPattern(prev => ({...prev, inhale: value[0]}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Hold: {customPattern.hold}s</span>
                      </div>
                      <Slider 
                        min={0} 
                        max={10} 
                        step={1} 
                        value={[customPattern.hold]} 
                        onValueChange={(value) => setCustomPattern(prev => ({...prev, hold: value[0]}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Exhale: {customPattern.exhale}s</span>
                      </div>
                      <Slider 
                        min={2} 
                        max={10} 
                        step={1} 
                        value={[customPattern.exhale]} 
                        onValueChange={(value) => setCustomPattern(prev => ({...prev, exhale: value[0]}))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Cycles: {customPattern.cycles}</span>
                      </div>
                      <Slider 
                        min={1} 
                        max={10} 
                        step={1} 
                        value={[customPattern.cycles]} 
                        onValueChange={(value) => setCustomPattern(prev => ({...prev, cycles: value[0]}))}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  Total exercise time: {calculateTotalTime()} seconds
                </p>
                <Button onClick={startExercise} className="w-full btn-pulse">
                  Start Exercise
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-1">{getInstructionText()}</h2>
            <p className="text-muted-foreground">
              Cycle {currentCycle} of {totalCycles}
            </p>
          </div>
          
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Lotus flower animation */}
            <div 
              className="absolute w-full h-full transition-transform duration-1000 ease-in-out"
              style={{ transform: `scale(${lotusScale})` }}
            >
              <div className="w-full h-full relative">
                {/* Lotus petals */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 bg-primary/20 rounded-full"></div>
                </div>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute w-24 h-24 left-1/2 top-1/2" 
                    style={{ 
                      transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-36px)`,
                      animation: `floatPetal ${1 + (i % 3)}s ease-in-out infinite alternate`,
                    }}
                  >
                    <div className="w-full h-full bg-primary/40 rounded-full rounded-t-3xl transform origin-bottom" 
                         style={{ boxShadow: '0 2px 15px rgba(0,0,0,0.1)' }}></div>
                  </div>
                ))}
                {/* Lotus center */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 bg-secondary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Timer overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <span className="text-4xl font-bold">{secondsLeft}</span>
            </div>
          </div>
          
          <div className="w-full space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Phase Progress</span>
                <span>{Math.round(getPhaseProgress())}%</span>
              </div>
              <Progress value={getPhaseProgress()} />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(getOverallProgress())}%</span>
              </div>
              <Progress value={getOverallProgress()} />
            </div>
            
            <Button variant="outline" onClick={stopExercise} className="w-full">
              Stop Exercise
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingLotus;