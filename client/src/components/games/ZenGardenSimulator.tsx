import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';

interface ZenGardenSimulatorProps {
  onComplete: () => void;
}

// Define rocks for the zen garden
const ROCKS = [
  { id: 'rock1', size: 30, shape: 'circle' },
  { id: 'rock2', size: 40, shape: 'oval' },
  { id: 'rock3', size: 25, shape: 'triangle' },
  { id: 'rock4', size: 35, shape: 'rectangle' },
  { id: 'rock5', size: 20, shape: 'square' },
];

interface Rock {
  id: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  shape: string;
  selected: boolean;
}

interface Pattern {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  type: 'circle' | 'wave' | 'straight';
  size: number;
}

const ZenGardenSimulator = ({ onComplete }: ZenGardenSimulatorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rocks, setRocks] = useState<Rock[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [selectedRock, setSelectedRock] = useState<Rock | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [patternType, setPatternType] = useState<'circle' | 'wave' | 'straight'>('wave');
  const [patternSize, setPatternSize] = useState(20);
  const [rakeMode, setRakeMode] = useState(false);
  const [rakeStartPos, setRakeStartPos] = useState({ x: 0, y: 0 });
  const [rakeHistory, setRakeHistory] = useState<{startX: number; startY: number; endX: number; endY: number; type: string; size: number}[]>([]);
  
  const { toast } = useToast();
  
  // Initialize the garden
  useEffect(() => {
    if (isPlaying && rocks.length === 0) {
      // Create initial rocks positioned off to the side
      const initialRocks = ROCKS.map((rock, index) => ({
        ...rock,
        x: 50,
        y: 70 + index * 50,
        rotation: Math.random() * 360,
        selected: false,
      }));
      
      setRocks(initialRocks);
    }
  }, [isPlaying, rocks.length]);
  
  // Draw the canvas
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
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
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw sand background
      ctx.fillStyle = '#f5edd7'; // Sandy color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw rake patterns
      rakeHistory.forEach(pattern => {
        ctx.strokeStyle = '#e6d2a8'; // Slightly darker than sand
        ctx.lineWidth = pattern.size;
        ctx.lineCap = 'round';
        
        switch(pattern.type) {
          case 'straight':
            // Draw straight line
            ctx.beginPath();
            ctx.moveTo(pattern.startX, pattern.startY);
            ctx.lineTo(pattern.endX, pattern.endY);
            ctx.stroke();
            break;
          case 'wave':
            // Draw wavy line
            ctx.beginPath();
            ctx.moveTo(pattern.startX, pattern.startY);
            
            const dx = pattern.endX - pattern.startX;
            const dy = pattern.endY - pattern.startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const steps = Math.max(10, Math.floor(distance / 10));
            
            for (let i = 1; i <= steps; i++) {
              const t = i / steps;
              const x = pattern.startX + dx * t;
              const y = pattern.startY + dy * t + Math.sin(t * Math.PI * 3) * 10;
              ctx.lineTo(x, y);
            }
            ctx.stroke();
            break;
          case 'circle':
            // Draw circular pattern
            ctx.beginPath();
            const centerX = (pattern.startX + pattern.endX) / 2;
            const centerY = (pattern.startY + pattern.endY) / 2;
            const radius = Math.hypot(pattern.endX - pattern.startX, pattern.endY - pattern.startY) / 2;
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
            break;
        }
      });
      
      // Draw rocks
      rocks.forEach(rock => {
        ctx.save();
        
        // Translate to rock center for rotation
        ctx.translate(rock.x, rock.y);
        ctx.rotate(rock.rotation * Math.PI / 180);
        
        // Draw rock
        ctx.fillStyle = rock.selected ? '#aaa' : '#888';
        ctx.strokeStyle = rock.selected ? '#555' : '#666';
        ctx.lineWidth = 2;
        
        switch(rock.shape) {
          case 'circle':
            ctx.beginPath();
            ctx.ellipse(0, 0, rock.size / 2, rock.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
          case 'oval':
            ctx.beginPath();
            ctx.ellipse(0, 0, rock.size / 2, rock.size / 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -rock.size / 2);
            ctx.lineTo(-rock.size / 2, rock.size / 2);
            ctx.lineTo(rock.size / 2, rock.size / 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
          case 'rectangle':
            ctx.fillRect(-rock.size / 2, -rock.size / 4, rock.size, rock.size / 2);
            ctx.strokeRect(-rock.size / 2, -rock.size / 4, rock.size, rock.size / 2);
            break;
          case 'square':
            ctx.fillRect(-rock.size / 2, -rock.size / 2, rock.size, rock.size);
            ctx.strokeRect(-rock.size / 2, -rock.size / 2, rock.size, rock.size);
            break;
        }
        
        ctx.restore();
      });
      
      // Draw rake preview if in rake mode
      if (rakeMode && rakeStartPos.x !== 0) {
        const mouseX = rakeStartPos.x;
        const mouseY = rakeStartPos.y;
        
        ctx.strokeStyle = 'rgba(180, 160, 120, 0.5)';
        ctx.lineWidth = patternSize;
        ctx.lineCap = 'round';
        ctx.beginPath();
        
        switch(patternType) {
          case 'straight':
            ctx.moveTo(rakeStartPos.x, rakeStartPos.y);
            // Draw a preview line in the direction of mouse movement
            ctx.lineTo(mouseX + 20, mouseY + 20);
            break;
          case 'wave':
            ctx.moveTo(rakeStartPos.x, rakeStartPos.y);
            // Preview of a wavy line
            const previewLength = 60;
            for (let i = 1; i <= 10; i++) {
              const t = i / 10;
              const x = rakeStartPos.x + previewLength * t;
              const y = rakeStartPos.y + Math.sin(t * Math.PI * 3) * 10;
              ctx.lineTo(x, y);
            }
            break;
          case 'circle':
            // Preview circle
            const radius = 30;
            ctx.arc(rakeStartPos.x, rakeStartPos.y, radius, 0, Math.PI * 2);
            break;
        }
        
        ctx.stroke();
      }
    };
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, rocks, selectedRock, patterns, patternType, patternSize, rakeMode, rakeStartPos, rakeHistory]);
  
  // Handle mouse down on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (rakeMode) {
      // Start drawing a pattern
      setRakeStartPos({ x, y });
      return;
    }
    
    // Check if clicked on a rock
    for (let i = rocks.length - 1; i >= 0; i--) {
      const rock = rocks[i];
      const dx = x - rock.x;
      const dy = y - rock.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < rock.size / 2) {
        // Select rock and set drag offset
        setSelectedRock(rock);
        setDragOffset({ x: dx, y: dy });
        setIsDragging(true);
        
        // Update rock selection state
        const updatedRocks = rocks.map(r => ({
          ...r,
          selected: r.id === rock.id
        }));
        setRocks(updatedRocks);
        return;
      }
    }
    
    // Deselect if clicked elsewhere
    setSelectedRock(null);
    setRocks(rocks.map(r => ({ ...r, selected: false })));
  };
  
  // Handle mouse move on canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (rakeMode && rakeStartPos.x !== 0) {
      // In rake mode, we'll update the canvas in the draw function
      // This allows for live preview as user moves the mouse
      return;
    }
    
    if (isDragging && selectedRock) {
      // Move the selected rock
      const updatedRocks = rocks.map(rock => {
        if (rock.id === selectedRock.id) {
          return {
            ...rock,
            x: x - dragOffset.x,
            y: y - dragOffset.y
          };
        }
        return rock;
      });
      setRocks(updatedRocks);
    }
  };
  
  // Handle mouse up on canvas
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (rakeMode && rakeStartPos.x !== 0) {
      // Finish drawing a pattern
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      
      // Add the pattern to history
      setRakeHistory([...rakeHistory, {
        startX: rakeStartPos.x,
        startY: rakeStartPos.y,
        endX,
        endY,
        type: patternType,
        size: patternSize
      }]);
      
      // Reset the start position
      setRakeStartPos({ x: 0, y: 0 });
    }
    
    setIsDragging(false);
  };
  
  // Handle rock rotation
  const rotateSelectedRock = () => {
    if (selectedRock) {
      const updatedRocks = rocks.map(rock => {
        if (rock.id === selectedRock.id) {
          return {
            ...rock,
            rotation: (rock.rotation + 15) % 360
          };
        }
        return rock;
      });
      setRocks(updatedRocks);
    }
  };
  
  // Clear all patterns
  const clearPatterns = () => {
    setRakeHistory([]);
  };
  
  // Reset all rocks
  const resetRocks = () => {
    // Position rocks along the side
    const updatedRocks = ROCKS.map((rock, index) => ({
      ...rock,
      x: 50,
      y: 70 + index * 50,
      rotation: Math.random() * 360,
      selected: false,
    }));
    
    setRocks(updatedRocks);
    setSelectedRock(null);
  };
  
  return (
    <div className="h-full fade-in">
      {!isPlaying ? (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🪨</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Zen Garden Simulator</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create your own peaceful Zen garden. Arrange stones and rake patterns in the sand to find tranquility and focus.
            </p>
            <Button onClick={() => setIsPlaying(true)} className="btn-pulse">
              Begin Experience
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Zen Garden</h2>
            <Button variant="outline" size="sm" onClick={onComplete}>
              Exit
            </Button>
          </div>
          
          <div className="relative flex-grow mb-4 bg-[#f5edd7] rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full h-full cursor-pointer"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-card rounded-lg p-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Stone Tools</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant={!rakeMode ? "default" : "outline"}
                  onClick={() => setRakeMode(false)}
                >
                  Arrange Stones
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={rotateSelectedRock}
                  disabled={!selectedRock}
                >
                  Rotate Stone
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={resetRocks}
                >
                  Reset Stones
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Sand Raking</h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant={rakeMode ? "default" : "outline"}
                  onClick={() => setRakeMode(true)}
                >
                  Rake Sand
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={clearPatterns}
                >
                  Clear Patterns
                </Button>
              </div>
              
              {rakeMode && (
                <div className="mt-2 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Pattern Style</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant={patternType === 'straight' ? "default" : "outline"}
                        onClick={() => setPatternType('straight')}
                        className="flex-1"
                      >
                        Straight
                      </Button>
                      <Button 
                        size="sm" 
                        variant={patternType === 'wave' ? "default" : "outline"}
                        onClick={() => setPatternType('wave')}
                        className="flex-1"
                      >
                        Wave
                      </Button>
                      <Button 
                        size="sm" 
                        variant={patternType === 'circle' ? "default" : "outline"}
                        onClick={() => setPatternType('circle')}
                        className="flex-1"
                      >
                        Circle
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Pattern Size</span>
                      <span>{patternSize}px</span>
                    </div>
                    <Slider
                      min={5}
                      max={30}
                      step={1}
                      value={[patternSize]}
                      onValueChange={(value) => setPatternSize(value[0])}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZenGardenSimulator;