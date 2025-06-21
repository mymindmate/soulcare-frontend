import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getPrimaryGameRecommendation } from '@/lib/digitalGames';
import { type DigitalGame } from '@/lib/digitalGames';
import { motion } from 'framer-motion';
import BreathingLotus from './games/BreathingLotus';

interface MoodEmojiScaleProps {
  stressLevel: 'low' | 'medium' | 'high';
  stressScore: number;
  onClose: () => void;
}

const MoodEmojiScale = ({ stressLevel, stressScore, onClose }: MoodEmojiScaleProps) => {
  const [selectedGame, setSelectedGame] = useState<DigitalGame | null>(null);
  const [showingGame, setShowingGame] = useState(false);

  // Get a game recommendation based on stress level
  const gameRecommendation = getPrimaryGameRecommendation(stressLevel);

  // Calculate position of the indicator (0-100)
  const indicatorPosition = (stressScore / 50) * 100;
  
  // Get emoji and message based on stress level
  const getEmoji = () => {
    switch(stressLevel) {
      case 'low': return '😊';
      case 'medium': return '😐';
      case 'high': return '😫';
      default: return '🤔';
    }
  };
  
  const getMessage = () => {
    switch(stressLevel) {
      case 'low': 
        return 'Your stress level is low. Great job managing your stress!';
      case 'medium': 
        return 'Your stress level is moderate. Try some mindfulness activities to help reduce it.';
      case 'high': 
        return 'Your stress level is high. It\'s important to take action to reduce your stress.';
      default: 
        return 'Let\'s check how you\'re feeling today.';
    }
  };

  const handlePlayGame = () => {
    setSelectedGame(gameRecommendation);
    setShowingGame(true);
  };

  // If currently showing a game
  if (showingGame && selectedGame) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            Playing: {selectedGame.title}
          </h3>
          <Button variant="outline" size="sm" onClick={() => setShowingGame(false)}>
            Back
          </Button>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          {selectedGame.id === 'breathing-lotus' ? (
            <BreathingLotus onComplete={() => setShowingGame(false)} />
          ) : (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">{selectedGame.iconEmoji}</div>
              <h4 className="text-xl font-bold mb-2">{selectedGame.title}</h4>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">{selectedGame.description}</p>
              <p className="italic text-sm text-gray-500 mt-4">
                This game hasn't been fully implemented yet.
                Try the Breathing Lotus game which is available now!
              </p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  const breathingGame = getPrimaryGameRecommendation('high');
                  setSelectedGame(breathingGame);
                }}
              >
                Try Breathing Lotus Instead
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-medium mb-2 text-center">Your Mood Today</h3>
        <p className="text-gray-600 text-center mb-6">{getMessage()}</p>
        
        {/* Emoji Scale Visualization */}
        <div className="mb-8">
          <div className="flex justify-between mb-1">
            <span>Calm</span>
            <span>Stressed</span>
          </div>
          <div className="h-14 bg-gray-100 rounded-lg relative flex items-center justify-between px-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 rounded-lg"></div>
            
            {/* Emoji markers */}
            <div className="absolute left-[10%] transform -translate-x-1/2 text-2xl z-10">😊</div>
            <div className="absolute left-[50%] transform -translate-x-1/2 text-2xl z-10">😐</div>
            <div className="absolute left-[90%] transform -translate-x-1/2 text-2xl z-10">😫</div>
            
            {/* Current position indicator */}
            <motion.div 
              className="absolute bg-white border-2 border-primary w-12 h-12 rounded-full flex items-center justify-center shadow-md z-20"
              initial={{ left: '50%' }}
              animate={{ left: `${indicatorPosition}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              style={{ top: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <span className="text-2xl">{getEmoji()}</span>
            </motion.div>
          </div>
        </div>
        
        {/* Game Recommendation */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h4 className="text-lg font-medium mb-2">
              Recommended Activity for Your Stress Level
            </h4>
            <div className="flex items-start gap-4 mt-4 p-4 bg-slate-50 rounded-lg">
              <div className="text-4xl">{gameRecommendation.iconEmoji}</div>
              <div className="flex-1">
                <h5 className="text-md font-medium">{gameRecommendation.title}</h5>
                <p className="text-sm text-gray-600 mt-1">{gameRecommendation.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {gameRecommendation.category}
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                    {gameRecommendation.durationMinutes} min
                  </span>
                </div>
                <Button onClick={handlePlayGame} className="mt-3 w-full sm:w-auto">
                  Play Now
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MoodEmojiScale;