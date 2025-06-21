import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface BubblePopGameProps {
  onComplete: () => void;
}

// Negative emotions for the bubbles
const NEGATIVE_EMOTIONS = [
  'Anger', 'Frustration', 'Irritation', 'Rage',
  'Annoyance', 'Resentment', 'Bitterness', 'Hostility',
  'Fury', 'Stress', 'Tension', 'Overwhelm',
  'Impatience', 'Agitation', 'Exasperation', 'Displeasure'
];

// Positive feedback messages
const POSITIVE_MESSAGES = [
  'Great release!',
  'Let it go!',
  'Feel lighter!',
  "That's it!",
  'Release that tension!',
  'Freedom!',
];

// Bubble interface
interface Bubble {
  id: number;
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  emotion: string;
  color: string;
  popped: boolean;
  poppedTime: number;
  opacity: number;
}

const BubblePopGame = ({ onComplete }: BubblePopGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds game duration
  const [gameOver, setGameOver] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(2); // 1-5 scale
  const [bubbleDensity, setBubbleDensity] = useState(10); // How many bubbles
  const [message, setMessage] = useState(''); // Feedback message
  const [messagePos, setMessagePos] = useState({ x: 0, y: 0 }); // Message position
  const [messageTimer, setMessageTimer] = useState(0); // Message display timer
  
  const timerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Initialize the game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setBubbles([]);
    setMessage('');
    setMessageTimer(0);
    
    // Generate initial bubbles
    generateBubbles();
  };
  
  // Generate bubbles based on difficulty and density
  const generateBubbles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const maxRadius = 50 - (difficultyLevel * 5); // Smaller bubbles at higher difficulty
    const minRadius = 20;
    
    const newBubbles: Bubble[] = [];
    
    for (let i = 0; i < bubbleDensity; i++) {
      // Random properties
      const radius = Math.random() * (maxRadius - minRadius) + minRadius;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = Math.random() * (canvas.height - radius * 2) + radius;
      
      // Random speed based on difficulty
      const maxSpeed = 0.5 + (difficultyLevel * 0.3);
      const speedX = (Math.random() - 0.5) * maxSpeed;
      const speedY = (Math.random() - 0.5) * maxSpeed;
      
      // Random emotion
      const emotion = NEGATIVE_EMOTIONS[Math.floor(Math.random() * NEGATIVE_EMOTIONS.length)];
      
      // Random color (reddish tones for anger)
      const hue = Math.floor(Math.random() * 30) + 350; // 350-20 degrees (reds to oranges)
      const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
      const lightness = Math.floor(Math.random() * 20) + 50; // 50-70%
      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      newBubbles.push({
        id: Date.now() + i,
        x,
        y,
        radius,
        speedX,
        speedY,
        emotion,
        color,
        popped: false,
        poppedTime: 0,
        opacity: 1
      });
    }
    
    setBubbles(prev => [...prev, ...newBubbles]);
  };
  
  // Timer countdown effect
  useEffect(() => {
    if (isPlaying && !gameOver) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Game over
            clearInterval(timerRef.current!);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, gameOver]);
  
  // Animation and game loop
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Make canvas responsive
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Ensure the canvas takes the full size of its container
        canvas.width = parent.clientWidth || window.innerWidth;
        // Use either the parent height or at least 75% of the viewport height
        canvas.height = Math.max(parent.clientHeight, window.innerHeight * 0.75);
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Variables for time-based animation
    let lastTime = 0;
    
    // Animation loop with proper timestamp for smooth animation
    const animate = (currentTime: number) => {
      // Calculate time difference for smoother animations
      const deltaTime = lastTime ? (currentTime - lastTime) / 1000 : 0.016; // Default to 60fps if first frame
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update bubbles with time-based movement for consistent speed
      const updatedBubbles = bubbles.map(bubble => {
        // Skip popped bubbles after they've faded
        if (bubble.popped && Date.now() - bubble.poppedTime > 1000) {
          return bubble;
        }
        
        // Update popped bubble opacity
        if (bubble.popped) {
          return {
            ...bubble,
            opacity: Math.max(0, bubble.opacity - 0.05)
          };
        }
        
        // Move the bubble with deltaTime for consistent speed across different devices/framerates
        let newX = bubble.x + bubble.speedX * (deltaTime * 60); // Normalized to 60fps
        let newY = bubble.y + bubble.speedY * (deltaTime * 60);
        
        // Bounce off walls
        if (newX - bubble.radius < 0 || newX + bubble.radius > canvas.width) {
          newX = bubble.x;
          // Add a small additional velocity when bouncing to keep the game active
          const newSpeed = -bubble.speedX * 1.05;
          return { ...bubble, speedX: newSpeed, x: newX };
        }
        
        if (newY - bubble.radius < 0 || newY + bubble.radius > canvas.height) {
          newY = bubble.y;
          // Add a small additional velocity when bouncing to keep the game active
          const newSpeed = -bubble.speedY * 1.05;
          return { ...bubble, speedY: newSpeed, y: newY };
        }
        
        return { ...bubble, x: newX, y: newY };
      }).filter(bubble => !(bubble.popped && bubble.opacity <= 0)); // Remove completely faded bubbles
      
      // Only update state if bubbles have changed
      if (JSON.stringify(updatedBubbles) !== JSON.stringify(bubbles)) {
        setBubbles(updatedBubbles);
      }
      
      // Draw bubbles
      bubbles.forEach(bubble => {
        ctx.save();
        
        if (bubble.popped) {
          // Draw popping animation
          ctx.globalAlpha = bubble.opacity;
          ctx.strokeStyle = bubble.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius * (1 + (1 - bubble.opacity)), 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Draw bubble
          ctx.fillStyle = bubble.color;
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
          ctx.fill();
          
          // Draw emotion text
          ctx.fillStyle = 'white';
          ctx.font = `${Math.max(12, bubble.radius / 3)}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(bubble.emotion, bubble.x, bubble.y);
        }
        
        ctx.restore();
      });
      
      // Draw score and time
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 20, 30);
      ctx.fillText(`Time: ${timeLeft}s`, 20, 60);
      
      // Draw feedback message if active
      if (message && messageTimer > 0) {
        ctx.save();
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 120, 50, ' + Math.min(1, messageTimer / 30) + ')';
        ctx.fillText(message, messagePos.x, messagePos.y);
        ctx.restore();
        
        setMessageTimer(prev => prev - 1);
      }
      
      // Generate new bubbles if needed
      if (bubbles.filter(b => !b.popped).length < bubbleDensity / 2) {
        generateBubbles();
      }
      
      // Continue animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation with initial call
    animationRef.current = requestAnimationFrame(time => animate(time));
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, bubbles, score, timeLeft, message, messageTimer, messagePos, bubbleDensity, difficultyLevel]);
  
  // Handle bubble popping
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || gameOver) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Check if clicked on a bubble
    let popped = false;
    
    setBubbles(prevBubbles => 
      prevBubbles.map(bubble => {
        if (bubble.popped) return bubble;
        
        const distance = Math.sqrt((clickX - bubble.x) ** 2 + (clickY - bubble.y) ** 2);
        
        // Increase the hit area slightly to make it easier to pop
        if (distance <= bubble.radius * 1.2) {
          popped = true;
          return { ...bubble, popped: true, poppedTime: Date.now() };
        }
        
        return bubble;
      })
    );
    
    if (popped) {
      // Update score
      setScore(prev => prev + 1);
      
      // Play bubble pop sound
      try {
        // Create oscillator for pop sound effect
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400 + Math.random() * 200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
      } catch (error) {
        // Silent fail if audio can't play
      }
      
      // Show random positive message
      const randomMessage = POSITIVE_MESSAGES[Math.floor(Math.random() * POSITIVE_MESSAGES.length)];
      setMessage(randomMessage);
      setMessagePos({ x: clickX, y: clickY - 30 }); // Position above click
      setMessageTimer(60); // Show for 60 frames (about 1 second)
    }
  };
  
  // Game over effect
  useEffect(() => {
    if (gameOver && isPlaying) {
      toast({
        title: "Time's Up!",
        description: `You popped ${score} bubbles! How do you feel now?`,
        duration: 5000,
      });
      
      // Stop the game
      setIsPlaying(false);
    }
  }, [gameOver, isPlaying, score, toast]);
  
  return (
    <div className="fade-in max-h-[80vh] overflow-y-auto">
      {!isPlaying && !gameOver ? (
        <div className="flex flex-col items-center justify-center p-6 text-center max-h-[calc(100vh-120px)]">
          <div className="max-w-md">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">💥</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Bubble Pop: Release Your Anger</h2>
            <p className="text-muted-foreground mb-6">
              Pop the bubbles filled with negative emotions to release tension and anger in a healthy way.
            </p>
            
            <div className="bg-muted/30 p-4 rounded-lg mb-6 w-full">
              <h4 className="font-medium mb-4">Game Settings:</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Difficulty Level</span>
                    <span>
                      {difficultyLevel === 1 ? 'Easy' : 
                       difficultyLevel === 2 ? 'Medium' : 
                       difficultyLevel === 3 ? 'Hard' : 
                       difficultyLevel === 4 ? 'Very Hard' : 'Extreme'}
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[difficultyLevel]}
                    onValueChange={(value) => setDifficultyLevel(value[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Bubble Density</span>
                    <span>{bubbleDensity}</span>
                  </div>
                  <Slider
                    min={5}
                    max={20}
                    step={1}
                    value={[bubbleDensity]}
                    onValueChange={(value) => setBubbleDensity(value[0])}
                  />
                </div>
              </div>
            </div>
            
            <Button onClick={startGame} className="btn-pulse w-full">
              Start Popping!
            </Button>
          </div>
        </div>
      ) : gameOver ? (
        <div className="flex flex-col items-center justify-center p-6 max-h-[calc(100vh-120px)]">
          <div className="max-w-md text-center">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">😊</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Game Complete!</h2>
            <p className="text-muted-foreground mb-3">
              You popped {score} bubbles of negative emotions!
            </p>
            
            <div className="bg-primary/10 p-5 rounded-lg mb-6">
              <h4 className="font-medium mb-2">Reflection:</h4>
              <p className="text-sm mb-3">
                How do you feel now? Notice if there's any change in your feelings of anger or frustration.
              </p>
              <p className="text-sm italic">
                Physical activities like popping these bubbles can help release tension and transform anger into productive energy.
              </p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={startGame}>
                Play Again
              </Button>
              <Button onClick={onComplete} className="btn-pulse">
                Return to Arcade
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Bubble Pop</h2>
            <Button variant="outline" size="sm" onClick={onComplete}>
              Exit
            </Button>
          </div>
          
          <div className="relative flex-grow mb-2 bg-red-50/30 rounded-lg overflow-hidden" style={{ height: '65vh', maxHeight: '65vh' }}>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onTouchStart={(e) => {
                // Prevent scrolling when touching the canvas
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent('click', {
                  clientX: touch.clientX,
                  clientY: touch.clientY
                });
                canvasRef.current?.dispatchEvent(mouseEvent);
              }}
              onTouchMove={(e) => {
                // Prevent scrolling during touch movement
                e.preventDefault();
              }}
              onTouchEnd={(e) => {
                // Prevent default behavior
                e.preventDefault();
              }}
              className="w-full h-full cursor-pointer"
            />
          </div>
          
          {isPlaying && (
            <div className="text-center text-sm text-muted-foreground">
              Tap or click the bubbles to pop them and release negative emotions
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BubblePopGame;