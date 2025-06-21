import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ColoringBookGameProps {
  onComplete: () => void;
}

// Define colors for the palette
const COLORS = [
  '#FF6B6B', // Red
  '#FFD93D', // Yellow
  '#6BCB77', // Green
  '#4D96FF', // Blue
  '#9B72AA', // Purple
  '#FF9A8B', // Coral
  '#FFC75F', // Orange
  '#F8F9FA', // White/Eraser
];

// Define simple coloring templates
const TEMPLATES = [
  {
    name: 'Flower Garden',
    paths: [
      { d: 'M150,150 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0', fill: '#F8F9FA', stroke: '#000', id: 'center' },
      { d: 'M150,150 m30,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', fill: '#F8F9FA', stroke: '#000', id: 'petal1' },
      { d: 'M150,150 m-50,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0', fill: '#F8F9FA', stroke: '#000', id: 'petal2' },
      { d: 'M150,150 m0,30 a10,10 0 1,0 0,20 a10,10 0 1,0 0,-20', fill: '#F8F9FA', stroke: '#000', id: 'petal3' },
      { d: 'M150,150 m0,-50 a10,10 0 1,0 0,20 a10,10 0 1,0 0,-20', fill: '#F8F9FA', stroke: '#000', id: 'petal4' },
      { d: 'M150,185 L150,250 M140,200 L160,210 M160,200 L140,210', fill: 'none', stroke: '#000', id: 'stem' },
      { d: 'M90,90 Q115,60 150,90 Q185,60 210,90 Q240,110 210,150 Q240,190 210,210 Q185,240 150,210 Q115,240 90,210 Q60,190 90,150 Q60,110 90,90', fill: '#F8F9FA', stroke: '#000', id: 'big-flower' },
    ]
  },
  {
    name: 'Peaceful Mandala',
    paths: [
      { d: 'M150,150 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0', fill: '#F8F9FA', stroke: '#000', id: 'inner-circle' },
      { d: 'M150,150 m-60,0 a60,60 0 1,0 120,0 a60,60 0 1,0 -120,0', fill: '#F8F9FA', stroke: '#000', id: 'middle-circle' },
      { d: 'M150,150 m-80,0 a80,80 0 1,0 160,0 a80,80 0 1,0 -160,0', fill: '#F8F9FA', stroke: '#000', id: 'outer-circle' },
      // Petals
      { d: 'M150,150 L150,70 L130,50 L150,30 L170,50 L150,70 Z', fill: '#F8F9FA', stroke: '#000', id: 'petal-n' },
      { d: 'M150,150 L230,150 L250,130 L270,150 L250,170 L230,150 Z', fill: '#F8F9FA', stroke: '#000', id: 'petal-e' },
      { d: 'M150,150 L150,230 L170,250 L150,270 L130,250 L150,230 Z', fill: '#F8F9FA', stroke: '#000', id: 'petal-s' },
      { d: 'M150,150 L70,150 L50,170 L30,150 L50,130 L70,150 Z', fill: '#F8F9FA', stroke: '#000', id: 'petal-w' },
    ]
  },
  {
    name: 'Mountain Scene',
    paths: [
      { d: 'M0,300 L100,100 L150,150 L200,80 L300,300 Z', fill: '#F8F9FA', stroke: '#000', id: 'mountain' },
      { d: 'M0,300 L300,300 L300,250 L0,250 Z', fill: '#F8F9FA', stroke: '#000', id: 'ground' },
      { d: 'M50,250 L50,200 L70,200 L70,250 Z', fill: '#F8F9FA', stroke: '#000', id: 'tree-trunk1' },
      { d: 'M60,200 L40,170 L60,170 L80,170 L60,140 L40,170 L80,170 Z', fill: '#F8F9FA', stroke: '#000', id: 'tree-top1' },
      { d: 'M230,250 L230,220 L245,220 L245,250 Z', fill: '#F8F9FA', stroke: '#000', id: 'tree-trunk2' },
      { d: 'M237,220 L220,190 L237,190 L255,190 L237,160 L220,190 L255,190 Z', fill: '#F8F9FA', stroke: '#000', id: 'tree-top2' },
      { d: 'M120,260 C140,245 160,245 180,260', fill: 'none', stroke: '#000', id: 'river' },
      { d: 'M80,80 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0', fill: '#F8F9FA', stroke: '#000', id: 'sun' },
    ]
  },
];

const ColoringBookGame = ({ onComplete }: ColoringBookGameProps) => {
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [coloredPaths, setColoredPaths] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const { toast } = useToast();
  
  // Update progress whenever coloredPaths changes
  useEffect(() => {
    if (TEMPLATES[currentTemplate]) {
      const totalPaths = TEMPLATES[currentTemplate].paths.length;
      const coloredCount = Object.keys(coloredPaths).length;
      const newProgress = Math.round((coloredCount / totalPaths) * 100);
      setProgress(newProgress);
      
      // Check if coloring is complete (all paths colored)
      if (newProgress === 100 && !isCompleted) {
        setIsCompleted(true);
        toast({
          title: "Masterpiece Complete!",
          description: "You've created a beautiful work of art!",
          duration: 3000,
        });
      }
    }
  }, [coloredPaths, currentTemplate, isCompleted, toast]);
  
  // Handle coloring a path
  const handlePathClick = (id: string) => {
    setColoredPaths(prev => ({
      ...prev,
      [id]: currentColor
    }));
  };
  
  // Switch to next template
  const nextTemplate = () => {
    setCurrentTemplate((prev) => (prev + 1) % TEMPLATES.length);
    setColoredPaths({});
    setIsCompleted(false);
  };
  
  // Switch to previous template
  const prevTemplate = () => {
    setCurrentTemplate((prev) => (prev - 1 + TEMPLATES.length) % TEMPLATES.length);
    setColoredPaths({});
    setIsCompleted(false);
  };
  
  // Clear all colors
  const clearColors = () => {
    setColoredPaths({});
    setIsCompleted(false);
  };
  
  // Render SVG paths with current colors
  const renderPaths = () => {
    return TEMPLATES[currentTemplate].paths.map((path) => {
      return (
        <path
          key={path.id}
          d={path.d}
          fill={coloredPaths[path.id] || path.fill}
          stroke={path.stroke}
          strokeWidth="2"
          onClick={() => handlePathClick(path.id)}
          className="cursor-pointer transition-colors duration-300"
        />
      );
    });
  };
  
  return (
    <div className="h-full fade-in">
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{TEMPLATES[currentTemplate].name}</h2>
            <Button variant="outline" size="sm" onClick={onComplete}>
              Exit
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <svg
              width="300"
              height="300"
              viewBox="0 0 300 300"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-full max-h-full mx-auto border rounded-lg"
            >
              {renderPaths()}
            </svg>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full transition-transform ${color === currentColor ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCurrentColor(color)}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
              
              <Button variant="outline" size="sm" onClick={clearColors}>
                Clear All
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={prevTemplate}>
              Previous Template
            </Button>
            <Button variant="outline" onClick={nextTemplate}>
              Next Template
            </Button>
          </div>
          
          {isCompleted && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg fade-in">
              <h4 className="font-medium text-green-800 mb-2">Beautiful work!</h4>
              <p className="text-sm text-green-700">
                Creating art can be a wonderful way to express emotions and find calm.
                How do you feel after completing this coloring activity?
              </p>
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={nextTemplate} 
                  size="sm" 
                  className="btn-pulse"
                >
                  Try Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColoringBookGame;