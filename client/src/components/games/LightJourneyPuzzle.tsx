import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface LightJourneyPuzzleProps {
  onComplete: () => void;
}

type CellType = 'empty' | 'wall' | 'light' | 'crystal' | 'path' | 'portal' | 'start' | 'end';

interface Cell {
  type: CellType;
  illuminated: boolean;
}

interface Level {
  grid: Cell[][];
  startPosition: [number, number];
  endPosition: [number, number];
  message: string;
  targetMoves: number;
}

const LightJourneyPuzzle = ({ onComplete }: LightJourneyPuzzleProps) => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelComplete' | 'gameComplete'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [lightPosition, setLightPosition] = useState<[number, number]>([0, 0]);
  const [moveCount, setMoveCount] = useState(0);
  const [pathHistory, setPathHistory] = useState<[number, number][]>([]);
  const [message, setMessage] = useState('');
  
  const { toast } = useToast();
  
  // Define the game levels
  const levels: Level[] = [
    // Level 1 - Simple introduction
    {
      grid: [
        [{ type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }],
      ],
      startPosition: [0, 2],
      endPosition: [4, 2],
      message: "Begin your journey. Move the light from start to end to symbolize hope overcoming darkness.",
      targetMoves: 8,
    },
    // Level 2 - Adding crystals that reflect light
    {
      grid: [
        [{ type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'crystal', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'wall', illuminated: false }, { type: 'crystal', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'crystal', illuminated: false }, { type: 'wall', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'crystal', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }],
      ],
      startPosition: [0, 0],
      endPosition: [4, 4],
      message: "Crystals reflect and amplify your light. Use them to navigate around obstacles.",
      targetMoves: 12,
    },
    // Level 3 - More complex layout with portals
    {
      grid: [
        [{ type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'crystal', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'crystal', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'portal', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'crystal', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'portal', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }],
        [{ type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'wall', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }, { type: 'empty', illuminated: false }],
      ],
      startPosition: [0, 0],
      endPosition: [5, 5],
      message: "Portals can transport your light to distant areas, helping you overcome seemingly insurmountable obstacles.",
      targetMoves: 15,
    },
  ];
  
  // Initialize the game
  useEffect(() => {
    if (gameState === 'playing' && currentLevel < levels.length) {
      const level = levels[currentLevel];
      initializeLevel(level);
    }
  }, [gameState, currentLevel]);
  
  // Initialize a level
  const initializeLevel = (level: Level) => {
    // Create a deep copy of the level grid
    const newGrid = JSON.parse(JSON.stringify(level.grid));
    
    // Set start and end positions
    const [startRow, startCol] = level.startPosition;
    const [endRow, endCol] = level.endPosition;
    
    newGrid[startRow][startCol].type = 'start';
    newGrid[endRow][endCol].type = 'end';
    
    // Place light at start position
    setLightPosition(level.startPosition);
    
    // Initialize path history with start position
    setPathHistory([level.startPosition]);
    
    // Set the grid and message
    setGrid(newGrid);
    setMessage(level.message);
    setMoveCount(0);
    
    // Illuminate around the light
    illuminateGrid(newGrid, level.startPosition);
  };
  
  // Start the game
  const startGame = () => {
    setGameState('playing');
    setCurrentLevel(0);
  };
  
  // Move the light in a direction
  const moveLight = (direction: 'up' | 'down' | 'left' | 'right') => {
    const [currentRow, currentCol] = lightPosition;
    let newRow = currentRow;
    let newCol = currentCol;
    
    // Calculate new position based on direction
    switch (direction) {
      case 'up':
        newRow = Math.max(0, currentRow - 1);
        break;
      case 'down':
        newRow = Math.min(grid.length - 1, currentRow + 1);
        break;
      case 'left':
        newCol = Math.max(0, currentCol - 1);
        break;
      case 'right':
        newCol = Math.min(grid[0].length - 1, currentCol + 1);
        break;
    }
    
    // Check if the move is valid
    if (grid[newRow][newCol].type === 'wall') {
      // Can't move into walls
      return;
    }
    
    // Handle special cell types
    if (grid[newRow][newCol].type === 'portal') {
      // Find the other portal
      let portalFound = false;
      
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
          if (grid[r][c].type === 'portal' && (r !== newRow || c !== newCol)) {
            newRow = r;
            newCol = c;
            portalFound = true;
            break;
          }
        }
        if (portalFound) break;
      }
    }
    
    // Update light position
    setLightPosition([newRow, newCol]);
    
    // Update the grid - mark the path
    const newGrid = JSON.parse(JSON.stringify(grid));
    if (newGrid[currentRow][currentCol].type === 'empty' || newGrid[currentRow][currentCol].type === 'path') {
      newGrid[currentRow][currentCol].type = 'path';
    }
    
    // Update path history
    setPathHistory([...pathHistory, [newRow, newCol]]);
    
    // Illuminate the grid from the new position
    illuminateGrid(newGrid, [newRow, newCol]);
    
    // Increment move count
    setMoveCount(moveCount + 1);
    
    // Check if the light reached the end
    const [endRow, endCol] = levels[currentLevel].endPosition;
    if (newRow === endRow && newCol === endCol) {
      // Level complete
      setGameState('levelComplete');
      
      const efficiency = calculateEfficiency();
      
      toast({
        title: "Level Complete!",
        description: `You completed the level in ${moveCount + 1} moves. Efficiency: ${efficiency}%`,
        duration: 5000,
      });
    }
  };
  
  // Calculate move efficiency based on target moves
  const calculateEfficiency = () => {
    const targetMoves = levels[currentLevel].targetMoves;
    const efficiency = Math.max(0, Math.min(100, Math.round((targetMoves / (moveCount + 1)) * 100)));
    return efficiency;
  };
  
  // Illuminate the grid from a position
  const illuminateGrid = (grid: Cell[][], position: [number, number]) => {
    const [row, col] = position;
    
    // Reset illumination
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        grid[r][c].illuminated = false;
      }
    }
    
    // Illuminate the current position and adjacent cells
    grid[row][col].illuminated = true;
    
    // Illuminate in all directions
    illuminateDirection(grid, row, col, 'up');
    illuminateDirection(grid, row, col, 'down');
    illuminateDirection(grid, row, col, 'left');
    illuminateDirection(grid, row, col, 'right');
    
    setGrid(grid);
  };
  
  // Illuminate in a specific direction
  const illuminateDirection = (grid: Cell[][], row: number, col: number, direction: 'up' | 'down' | 'left' | 'right') => {
    let newRow = row;
    let newCol = col;
    
    const maxRows = grid.length;
    const maxCols = grid[0].length;
    
    while (true) {
      // Move in the direction
      switch (direction) {
        case 'up':
          newRow--;
          break;
        case 'down':
          newRow++;
          break;
        case 'left':
          newCol--;
          break;
        case 'right':
          newCol++;
          break;
      }
      
      // Check boundaries
      if (newRow < 0 || newRow >= maxRows || newCol < 0 || newCol >= maxCols) {
        break;
      }
      
      // Check if we hit a wall
      if (grid[newRow][newCol].type === 'wall') {
        break;
      }
      
      // Illuminate the cell
      grid[newRow][newCol].illuminated = true;
      
      // If we hit a crystal, change direction or split light
      if (grid[newRow][newCol].type === 'crystal') {
        // Simple reflection for now - reverse direction
        switch (direction) {
          case 'up':
            illuminateDirection(grid, newRow, newCol, 'right');
            break;
          case 'down':
            illuminateDirection(grid, newRow, newCol, 'left');
            break;
          case 'left':
            illuminateDirection(grid, newRow, newCol, 'down');
            break;
          case 'right':
            illuminateDirection(grid, newRow, newCol, 'up');
            break;
        }
        break;
      }
    }
  };
  
  // Handle continuing to next level
  const continueToNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setGameState('playing');
    } else {
      setGameState('gameComplete');
    }
  };
  
  // Restart the current level
  const restartLevel = () => {
    initializeLevel(levels[currentLevel]);
  };
  
  // Cell rendering function
  const renderCell = (cell: Cell, row: number, col: number) => {
    let content = '';
    let bgClass = cell.illuminated ? 'bg-yellow-100' : 'bg-gray-900';
    let textClass = cell.illuminated ? 'text-black' : 'text-white';
    
    // Determine content based on cell type
    switch (cell.type) {
      case 'wall':
        bgClass = 'bg-gray-700';
        content = '';
        break;
      case 'crystal':
        content = '💎';
        break;
      case 'portal':
        content = '🌀';
        break;
      case 'start':
        content = '🏠';
        break;
      case 'end':
        content = '✨';
        break;
      case 'path':
        if (cell.illuminated) {
          content = '•';
        }
        break;
      default:
        content = '';
    }
    
    // Highlight the current position of the light
    if (lightPosition[0] === row && lightPosition[1] === col) {
      content = '🔆';
      bgClass = 'bg-yellow-300';
      textClass = 'text-black';
    }
    
    return (
      <div 
        key={`${row}-${col}`} 
        className={`w-12 h-12 ${bgClass} ${textClass} flex items-center justify-center rounded-md text-2xl shadow-md transition-colors duration-300`}
      >
        {content}
      </div>
    );
  };
  
  // Render intro screen
  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 fade-in">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💫</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Light Journey</h2>
          <p className="text-muted-foreground mb-6">
            Guide the light through darkness, navigating obstacles and finding your path to illuminate the world around you.
          </p>
          
          <Card className="mb-6">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-medium">How to Play:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">1</span>
                  <span>Use arrow buttons to move the light (🔆) through the maze</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">2</span>
                  <span>Light can't pass through walls, but it can interact with crystals and portals</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center">3</span>
                  <span>Reach the goal (✨) in as few moves as possible</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <p className="text-sm text-muted-foreground mb-4">
            As you guide the light, reflect on how even in our darkest moments, we can find a path forward.
          </p>
          
          <div className="flex gap-3">
            <Button onClick={startGame} className="flex-1 btn-pulse">
              Start Journey
            </Button>
            <Button onClick={onComplete} variant="outline" className="flex-1">
              Return to Arcade
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Render level complete screen
  if (gameState === 'levelComplete') {
    const efficiency = calculateEfficiency();
    
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 fade-in">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Level {currentLevel + 1} Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">🎉</span>
            </div>
            
            <p>You guided the light to its destination!</p>
            
            <div className="space-y-2">
              <p className="text-sm">Moves: {moveCount}</p>
              <p className="text-sm">Target: {levels[currentLevel].targetMoves}</p>
              <p className="text-sm font-medium">Efficiency: {efficiency}%</p>
              <Progress value={efficiency} className="h-2" />
            </div>
            
            <p className="text-sm italic border-l-4 border-primary/30 pl-3 py-2 bg-primary/5">
              "Just as your light found its way through darkness, remember that hope can guide you through difficult moments."
            </p>
          </CardContent>
          
          <CardFooter className="flex gap-3">
            <Button onClick={restartLevel} variant="outline" className="flex-1">
              Replay Level
            </Button>
            <Button onClick={continueToNextLevel} className="flex-1 btn-pulse">
              {currentLevel < levels.length - 1 ? 'Next Level' : 'Complete Journey'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render game complete screen
  if (gameState === 'gameComplete') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 fade-in">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Journey Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✨</span>
            </div>
            
            <p>You've completed all levels of the Light Journey!</p>
            
            <p className="text-sm italic border-l-4 border-primary/30 pl-3 py-2 bg-primary/5">
              "This journey represents our capacity to move through fear and uncertainty, finding our inner light even in the darkest places. Carry this light with you."
            </p>
          </CardContent>
          
          <CardFooter className="flex gap-3">
            <Button onClick={() => { setGameState('intro'); }} variant="outline" className="flex-1">
              Play Again
            </Button>
            <Button onClick={onComplete} className="flex-1 btn-pulse">
              Return to Arcade
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render the game board
  return (
    <div className="flex flex-col h-full p-4 max-w-2xl mx-auto fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Level {currentLevel + 1}: Light Journey</h2>
        <div className="text-sm">
          <span className="font-medium">Moves: {moveCount}</span>
        </div>
      </div>
      
      <Card className="mb-4">
        <CardContent className="p-4">
          <p className="text-sm italic">{message}</p>
        </CardContent>
      </Card>
      
      <div className="flex-grow flex flex-col items-center justify-center mb-4">
        <div className="grid gap-1 mb-4" style={{ gridTemplateRows: `repeat(${grid.length}, minmax(0, 1fr))`, gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))` }}>
          {grid.map((row, rowIndex) => 
            row.map((cell, colIndex) => 
              renderCell(cell, rowIndex, colIndex)
            )
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div></div>
        <Button onClick={() => moveLight('up')} className="h-14">
          ⬆️
        </Button>
        <div></div>
        <Button onClick={() => moveLight('left')} className="h-14">
          ⬅️
        </Button>
        <Button onClick={restartLevel} className="h-14" variant="outline">
          🔄
        </Button>
        <Button onClick={() => moveLight('right')} className="h-14">
          ➡️
        </Button>
        <div></div>
        <Button onClick={() => moveLight('down')} className="h-14">
          ⬇️
        </Button>
        <div></div>
      </div>
      
      <div className="text-center">
        <Button onClick={onComplete} variant="outline" size="sm">
          Exit Game
        </Button>
      </div>
    </div>
  );
};

export default LightJourneyPuzzle;