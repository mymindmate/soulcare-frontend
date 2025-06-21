import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { digitalGames, type DigitalGame } from '@/lib/digitalGames';
import { useAssessment } from '@/context/AssessmentContext';
import { Gamepad2 } from 'lucide-react';
import BreathingLotus from './games/BreathingLotus';
import TranquilWaters from './games/TranquilWaters';

/**
 * GameBar component for displaying interactive game recommendations
 */
const GameBar = () => {
  const { stressLevel } = useAssessment();
  const [selectedGame, setSelectedGame] = useState<DigitalGame | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  
  // Filter games based on the current stress level
  const recommendedGames = digitalGames.filter(game => 
    game.recommendedFor.includes(stressLevel as 'low' | 'medium' | 'high')
  ).slice(0, 3); // Show only top 3 recommendations
  
  // Handle launching a game
  const handlePlayGame = (game: DigitalGame) => {
    setSelectedGame(game);
    setActiveGame(game.id);
  };
  
  // Render the correct game component based on ID
  const renderGameComponent = (gameId: string) => {
    switch(gameId) {
      case 'breathing-lotus':
        return <BreathingLotus onComplete={() => setActiveGame(null)} />;
      case 'tranquil-waters':
        return <TranquilWaters onComplete={() => setActiveGame(null)} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-6xl mb-6">{selectedGame?.iconEmoji}</div>
            <h3 className="text-xl font-bold mb-2">{selectedGame?.title}</h3>
            <p className="text-gray-600 mb-6 max-w-md">{selectedGame?.description}</p>
            <p>This game will be available soon!</p>
            <Button onClick={() => setActiveGame(null)} className="mt-4">Back to Games</Button>
          </div>
        );
    }
  };
  
  return (
    <div>
      {/* Game Dialog */}
      {activeGame && selectedGame && (
        <Dialog open={!!activeGame} onOpenChange={(open) => !open && setActiveGame(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedGame.title}</DialogTitle>
              <DialogDescription>
                {selectedGame.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {renderGameComponent(activeGame)}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setActiveGame(null)}>
                Exit Game
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Game Bar */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Stress Relief Games
          </CardTitle>
          <CardDescription>
            Interactive games designed for your current stress level: {stressLevel.charAt(0).toUpperCase() + stressLevel.slice(1)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedGames.map(game => (
              <Card key={game.id} className="overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-50 flex items-center justify-center text-5xl min-h-[100px]">
                  {game.iconEmoji}
                </div>
                <CardContent className="py-4 flex-grow">
                  <h3 className="font-medium text-lg">{game.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-1">{game.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {game.category}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {game.durationMinutes} min
                    </span>
                  </div>
                </CardContent>
                <div className="px-4 pb-4">
                  <Button 
                    onClick={() => handlePlayGame(game)} 
                    className="w-full"
                    variant={game.id === 'breathing-lotus' || game.id === 'tranquil-waters' ? "default" : "outline"}
                  >
                    {game.id === 'breathing-lotus' || game.id === 'tranquil-waters' ? "Play Now" : "Coming Soon"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => {}}>
              View All Games
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameBar;