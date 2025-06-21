import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface MindfulStoneBalancingProps {
  onComplete: () => void;
}

interface Stone {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  angle: number;
  placed: boolean;
  selected: boolean;
}

const STONE_COLORS = [
  '#8A6642', // Brown
  '#A67C52', // Light brown
  '#705A45', // Dark brown
  '#9C9C9C', // Grey
  '#7C7C7C', // Dark grey
  '#B1A296', // Light grey
];

const STONE_SIZES = [
  { width: 140, height: 30 },
  { width: 120, height: 28 },
  { width: 100, height: 26 },
  { width: 90, height: 24 },
  { width: 80, height: 22 },
  { width: 70, height: 20 },
  { width: 60, height: 18 },
];

const MindfulStoneBalancing = ({ onComplete }: MindfulStoneBalancingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stones, setStones] = useState<Stone[]>([]);
  const [availableStones, setAvailableStones] = useState<Stone[]>([]);
  const [selectedStone, setSelectedStone] = useState<Stone | null>(null);
  const [stackHeight, setStackHeight] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [success, setSuccess] = useState(false);
  const [breathPrompt, setBreathPrompt] = useState('');
  const [breathTimer, setBreathTimer] = useState(0);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const { toast } = useToast();
  
  // Initialize the game
  useEffect(() => {
    if (isPlaying && !stones.length) {
      // Create base stone
      const baseStone: Stone = {
        id: 0,
        x: 0,
        y: 0,
        width: 160,
        height: 35,
        color: '#5D4534',
        angle: 0,
        placed: true,
        selected: false,
      };
      
      // Create available stones
      const newAvailableStones = Array.from({ length: 7 }).map((_, index) => {
        const size = STONE_SIZES[index % STONE_SIZES.length];
        return {
          id: index + 1,
          x: -200, // Off canvas initially
          y: -200,
          width: size.width,
          height: size.height,
          color: STONE_COLORS[Math.floor(Math.random() * STONE_COLORS.length)],
          angle: 0,
          placed: false,
          selected: false,
        };
      });
      
      setStones([baseStone]);
      setAvailableStones(newAvailableStones);
      setStackHeight(35); // Height of base stone
      
      // Set initial breathing prompt
      startBreathingPrompt();
    }
  }, [isPlaying]);
  
  // Start a breathing prompt
  const startBreathingPrompt = () => {
    const prompts = [
      'Take a deep breath in...',
      'Exhale slowly...',
      'Feel your breath...',
      'Breathe in calm...',
      'Release tension...',
    ];
    
    setBreathPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    setBreathTimer(5);
  };
  
  // Breathing prompt timer
  useEffect(() => {
    if (breathTimer > 0 && isPlaying) {
      const timer = setTimeout(() => {
        setBreathTimer(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (breathTimer === 0 && isPlaying) {
      startBreathingPrompt();
    }
  }, [breathTimer, isPlaying]);
  
  // Setup canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Make canvas responsive
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      };
      
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      
      return () => {
        window.removeEventListener('resize', resizeCanvas);
      };
    }
  }, []);
  
  // Animation and game loop
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    
    const animate = () => {
      if (!canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw sky gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#87CEEB'); // Sky blue
      gradient.addColorStop(1, '#E0F7FA'); // Light blue
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw ground
      ctx.fillStyle = '#8B4513'; // Brown
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
      
      // Calculate center of canvas for stone positioning
      const centerX = canvas.width / 2;
      const groundY = canvas.height - 50;
      
      // Draw placed stones
      let currentY = groundY;
      stones.forEach((stone, index) => {
        if (stone.placed) {
          ctx.save();
          ctx.translate(centerX + stone.x, currentY - stone.y - (stone.height / 2));
          ctx.rotate(stone.angle * Math.PI / 180);
          
          // Stone shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(-stone.width / 2 + 3, -stone.height / 2 + 3, stone.width, stone.height);
          
          // Stone
          ctx.fillStyle = stone.color;
          ctx.fillRect(-stone.width / 2, -stone.height / 2, stone.width, stone.height);
          
          // Stone details (texture)
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.beginPath();
          for (let i = 0; i < 3; i++) {
            ctx.moveTo(-stone.width / 2 + Math.random() * stone.width, -stone.height / 2);
            ctx.lineTo(-stone.width / 2 + Math.random() * stone.width, stone.height / 2);
          }
          ctx.stroke();
          
          ctx.restore();
          
          if (index === 0) {
            currentY -= stone.height;
          } else {
            currentY -= stone.height + 2; // Small gap between stones
          }
        }
      });
      
      // Draw available stones on the side
      const sideX = 80;
      let sideY = 100;
      
      availableStones.forEach((stone) => {
        if (!stone.placed) {
          ctx.save();
          ctx.translate(sideX, sideY);
          
          // Stone shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(-stone.width / 2 + 3, -stone.height / 2 + 3, stone.width, stone.height);
          
          // Stone
          ctx.fillStyle = stone.color;
          ctx.fillRect(-stone.width / 2, -stone.height / 2, stone.width, stone.height);
          
          // Selection indication
          if (stone.selected) {
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.strokeRect(-stone.width / 2 - 2, -stone.height / 2 - 2, stone.width + 4, stone.height + 4);
          }
          
          // Update stone position (for hit testing)
          stone.x = sideX;
          stone.y = sideY;
          
          ctx.restore();
          sideY += stone.height + 20;
        }
      });
      
      // Draw selected stone at hover position
      if (selectedStone && !selectedStone.placed) {
        ctx.save();
        ctx.translate(hoverPos.x, hoverPos.y);
        ctx.rotate(selectedStone.angle * Math.PI / 180);
        
        // Stone shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(-selectedStone.width / 2 + 3, -selectedStone.height / 2 + 3, selectedStone.width, selectedStone.height);
        
        // Stone
        ctx.fillStyle = selectedStone.color;
        ctx.fillRect(-selectedStone.width / 2, -selectedStone.height / 2, selectedStone.width, selectedStone.height);
        ctx.restore();
      }
      
      // Draw breathing prompt
      if (breathPrompt && !gameOver) {
        ctx.font = '18px Arial';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText(breathPrompt, canvas.width / 2, 40);
        ctx.fillText(`${breathTimer}`, canvas.width / 2, 70);
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, stones, availableStones, selectedStone, hoverPos, breathPrompt, breathTimer, gameOver]);
  
  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !isPlaying || gameOver) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setHoverPos({ x, y });
  };
  
  // Handle stone selection and placement
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !isPlaying || gameOver) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // If a stone is selected, place it
    if (selectedStone) {
      // Calculate placement position (center of canvas horizontally)
      const centerX = canvas.width / 2;
      const groundY = canvas.height - 50;
      const placementY = groundY - stackHeight - selectedStone.height / 2 - 5; // 5px above current stack
      
      // Update stone position
      const placedStone = {
        ...selectedStone,
        x: x - centerX, // Offset from center
        y: stackHeight,
        placed: true,
        selected: false,
      };
      
      // Add stone to stack
      setStones([...stones, placedStone]);
      
      // Update available stones
      setAvailableStones(availableStones.filter(stone => stone.id !== selectedStone.id));
      
      // Update stack height
      setStackHeight(prev => prev + selectedStone.height + 2); // 2px gap
      
      // Clear selection
      setSelectedStone(null);
      
      // Check for win condition
      if (stones.length + 1 >= 7) { // Base stone + 6 balanced stones
        setSuccess(true);
        setGameOver(true);
        toast({
          title: "Amazing Balance!",
          description: "You've created a beautiful stone arrangement!",
          duration: 5000,
        });
      }
      
      return;
    }
    
    // Check if clicked on an available stone
    for (const stone of availableStones) {
      if (!stone.placed && Math.abs(x - stone.x) <= stone.width / 2 && Math.abs(y - stone.y) <= stone.height / 2) {
        // Select this stone
        setSelectedStone({...stone, selected: true});
        
        // Update available stones
        setAvailableStones(availableStones.map(s => 
          s.id === stone.id ? {...s, selected: true} : {...s, selected: false}
        ));
        
        return;
      }
    }
  };
  
  // Handle keyboard for stone rotation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedStone || !isPlaying) return;
      
      if (e.key === 'r') {
        // Rotate stone
        setSelectedStone({
          ...selectedStone,
          angle: (selectedStone.angle + 5) % 360
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedStone, isPlaying]);
  
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 fade-in">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <div className="text-6xl bounce">🗿</div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Perfect Balance!</h2>
            <p className="mb-6">
              You've successfully balanced the stones in perfect harmony. This mindful practice
              helps develop patience, focus, and presence.
            </p>
            <p className="text-muted-foreground mb-6">
              Remember that finding balance in life, just like with these stones, 
              requires patience, adjustment, and careful attention.
            </p>
            <Button onClick={onComplete} className="btn-pulse">
              Return to Calm
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Mindful Stone Balancing</h3>
        <Button variant="outline" size="sm" onClick={onComplete}>
          Exit Game
        </Button>
      </div>
      
      <Card className="flex-grow">
        <CardContent className="p-0 relative h-full min-h-[400px]">
          {!isPlaying ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-100 text-center fade-in">
              <div className="text-6xl mb-6 bounce">🗿</div>
              <h3 className="text-xl font-bold mb-2">Mindful Stone Balancing</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Create a peaceful tower of balanced stones. Click stones to select them, 
                then click again to place. Follow the breathing prompts as you work.
                Press 'r' to rotate stones slightly.
              </p>
              <Button onClick={() => setIsPlaying(true)} className="btn-pulse">
                Begin Experience
              </Button>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              className="w-full h-full cursor-pointer"
            />
          )}
        </CardContent>
      </Card>
      
      {isPlaying && !gameOver && (
        <div className="mt-4 text-center text-sm text-muted-foreground slide-in-right">
          {selectedStone ? (
            <p>Click to place your stone. Focus on your breathing as you find balance.</p>
          ) : (
            <p>Select a stone from the left side. Breathe deeply as you consider each choice.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MindfulStoneBalancing;