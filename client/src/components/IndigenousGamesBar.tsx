import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { indigenousGames, type IndigenousGame } from '@/lib/indigenousGames';
import { useToast } from '@/hooks/use-toast';

const IndigenousGamesBar = () => {
  const [selectedGame, setSelectedGame] = useState<IndigenousGame | null>(null);
  const { toast } = useToast();
  
  // Group games by mood type for organization
  const groupedGames = indigenousGames.reduce((acc, game) => {
    if (!acc[game.mood]) {
      acc[game.mood] = [];
    }
    acc[game.mood].push(game);
    return acc;
  }, {} as Record<string, IndigenousGame[]>);

  const handlePlayGame = (game: IndigenousGame) => {
    toast({
      title: `Started: ${game.title}`,
      description: "Track time spent on this activity for best results",
      duration: 3000,
    });
  };
  
  return (
    <div className="w-full">
      <Card className="border shadow-sm mb-8">
        <CardHeader>
          <CardTitle>Indigenous Games Collection</CardTitle>
          <CardDescription>
            Explore traditional games adapted for stress management and emotional well-being
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 flex w-full overflow-x-auto">
              <TabsTrigger value="all">All Games</TabsTrigger>
              <TabsTrigger value="calming">Calming</TabsTrigger>
              <TabsTrigger value="energizing">Energizing</TabsTrigger>
              <TabsTrigger value="focusing">Focusing</TabsTrigger>
              <TabsTrigger value="grounding">Grounding</TabsTrigger>
              <TabsTrigger value="creative">Creative</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indigenousGames.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onClick={() => setSelectedGame(game)}
                    onPlay={() => handlePlayGame(game)}
                  />
                ))}
              </div>
            </TabsContent>
            
            {Object.entries(groupedGames).map(([mood, games]) => (
              <TabsContent key={mood} value={mood} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {games.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      onClick={() => setSelectedGame(game)}
                      onPlay={() => handlePlayGame(game)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Game Detail Dialog */}
      {selectedGame && (
        <Dialog open={!!selectedGame} onOpenChange={(open) => !open && setSelectedGame(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">{selectedGame.emojiIcon}</span>
                {selectedGame.title}
              </DialogTitle>
              <DialogDescription>
                {selectedGame.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Tabs defaultValue="instructions">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="instructions">How to Play</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="instructions" className="mt-4 space-y-4">
                  <h4 className="font-medium">Instructions:</h4>
                  <ol className="space-y-2 list-decimal pl-5">
                    {selectedGame.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </TabsContent>
                
                <TabsContent value="benefits" className="mt-4 space-y-4">
                  <h4 className="font-medium">Benefits:</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    {selectedGame.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </TabsContent>
                
                <TabsContent value="details" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{selectedGame.durationMinutes} minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Mood Type:</span>
                      <span className="capitalize">{selectedGame.mood}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Target Stress:</span>
                      <span className="capitalize">{selectedGame.targetStressType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Recommended For:</span>
                      <span>{selectedGame.recommendedFor.map(level => 
                        level.charAt(0).toUpperCase() + level.slice(1)
                      ).join(', ')} stress</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter>
              <Button onClick={() => handlePlayGame(selectedGame)}>
                Start Playing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface GameCardProps {
  game: IndigenousGame;
  onClick: () => void;
  onPlay: () => void;
}

const GameCard = ({ game, onClick, onPlay }: GameCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{game.emojiIcon}</span>
          <span className="truncate">{game.title}</span>
        </CardTitle>
        <CardDescription className="line-clamp-2 h-10">
          {game.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {game.mood}
          </span>
          <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            {game.targetStressType}
          </span>
          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {game.durationMinutes} min
          </span>
        </div>
        <div className="text-sm text-gray-500">
          <span className="font-medium">Best for: </span>
          {game.recommendedFor.map(level => 
            level.charAt(0).toUpperCase() + level.slice(1)
          ).join(', ')} stress
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" onClick={onClick}>
          Details
        </Button>
        <Button size="sm" onClick={onPlay}>
          Play
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IndigenousGamesBar;