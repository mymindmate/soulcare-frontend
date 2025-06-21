import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TranquilWatersProps {
  onComplete: () => void;
}

const TranquilWaters = ({ onComplete }: TranquilWatersProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ripples, setRipples] = useState<{x: number, y: number, radius: number, opacity: number}[]>([]);
  
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
  
  // Animation loop
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw water background with dynamic gradient based on HSL values
      const computedStyle = getComputedStyle(document.documentElement);
      const secondaryHue = computedStyle.getPropertyValue('--secondary').split(' ')[0].trim() || '180';
      const secondaryHueNum = parseInt(secondaryHue, 10);
      
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `hsl(${secondaryHueNum}, 70%, 85%)`);
      gradient.addColorStop(1, `hsl(${secondaryHueNum}, 80%, 50%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle wave pattern
      const time = Date.now() * 0.001;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 10) {
          const y = Math.sin(x * 0.01 + time + i) * 5 + (i * 20) + 50;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      // Update and draw ripples
      setRipples(prevRipples => {
        const updatedRipples = prevRipples.map(ripple => ({
          ...ripple,
          radius: ripple.radius + 2,
          opacity: ripple.opacity - 0.01
        })).filter(ripple => ripple.opacity > 0);
        
        updatedRipples.forEach(ripple => {
          // Draw multiple concentric circles for each ripple for more detail
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius - (i * 3), 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * (1 - i * 0.2)})`;
            ctx.lineWidth = 2 - (i * 0.5);
            ctx.stroke();
          }
          
          // Add ripple highlights
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.7})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
        
        return updatedRipples;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, ripples]);
  
  // Add ripple on click with multiple ripples for more visual effect
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add multiple ripples with slight offsets for a more natural effect
    const newRipples = [
      { x, y, radius: 5, opacity: 0.8 },
      { x: x + Math.random() * 20 - 10, y: y + Math.random() * 20 - 10, radius: 3, opacity: 0.6 },
      { x: x + Math.random() * 30 - 15, y: y + Math.random() * 30 - 15, radius: 2, opacity: 0.4 }
    ];
    
    setRipples(prev => [...prev, ...newRipples]);
    
    // Try to play water sound
    try {
      // Create oscillator for water drop sound effect
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      // Silent fail if audio can't play
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Tranquil Waters</h3>
        <Button variant="outline" size="sm" onClick={onComplete}>
          Exit Game
        </Button>
      </div>
      
      <Card className="flex-grow">
        <CardContent className="p-0 relative h-full min-h-[400px]">
          {!isPlaying ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-secondary/10 text-center fade-in">
              <div className="text-6xl mb-6">💧</div>
              <h3 className="text-xl font-bold mb-2">Tranquil Waters</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Touch the water surface to create ripples. Watch as they interact and fade away. 
                Focus on the calming effect of water to reduce stress and anxiety.
              </p>
              <Button onClick={() => setIsPlaying(true)} className="btn-pulse">Begin Experience</Button>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-full cursor-pointer"
            />
          )}
        </CardContent>
      </Card>
      
      {isPlaying && (
        <div className="mt-4 text-center text-sm text-muted-foreground slide-in-right">
          Click or tap anywhere on the water to create ripples
        </div>
      )}
    </div>
  );
};

export default TranquilWaters;