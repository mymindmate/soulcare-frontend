import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAssessment } from "@/context/AssessmentContext";
import { MessageSquare, BookOpen, RotateCcw, BarChart2, Gamepad2 } from "lucide-react";
import { useLocation } from "wouter";
import MoodEmojiScale from "./MoodEmojiScale";
import { getPrimaryGameRecommendation, type DigitalGame } from "@/lib/digitalGames";

interface StressResultsProps {
  onTabChange: (tab: "assessment" | "chatbot" | "resources") => void;
}

const StressResults = ({ onTabChange }: StressResultsProps) => {
  const { stressLevel, stressScore, resetAssessment } = useAssessment();
  const [, navigate] = useLocation();
  const [showMoodScale, setShowMoodScale] = useState(true);
  const [recommendedGame, setRecommendedGame] = useState<DigitalGame>(
    getPrimaryGameRecommendation(stressLevel)
  );
  
  // Calculate percentage for visualization
  const scorePercentage = (stressScore / 50) * 100; // 10 questions, max 5 points each
  
  // Determine color based on stress level
  const getMeterColor = () => {
    switch (stressLevel) {
      case 'low':
        return 'bg-[#6ECB63]';
      case 'medium':
        return 'bg-[#FFD166]';
      case 'high':
        return 'bg-[#FF7A5A]';
      default:
        return 'bg-[#6ECB63]';
    }
  };

  // Determine summary text based on stress level
  const getSummaryText = () => {
    switch (stressLevel) {
      case 'low':
        return "Your assessment indicates a low level of stress. Great job managing your academic and personal life! Keep using the strategies that are working for you.";
      case 'medium':
        return "Your assessment indicates a medium level of stress. While you are managing day-to-day tasks, you may be experiencing some challenges with academic pressure and life balance.";
      case 'high':
        return "Your assessment indicates a high level of stress. You might be feeling overwhelmed with your current workload and responsibilities. It is important to address these stress levels soon.";
      default:
        return "";
    }
  };

  const handleResetAssessment = () => {
    resetAssessment();
  };

  return (
    <div className="max-w-2xl mx-auto">
      {showMoodScale ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <MoodEmojiScale 
            stressLevel={stressLevel} 
            stressScore={stressScore} 
            onClose={() => setShowMoodScale(false)} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-heading font-bold text-2xl mb-4 text-center">Your Stress Assessment Results</h2>
          
          {/* Stress Meter */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600">Stress Level</span>
              <span className={`text-sm font-medium ${
                stressLevel === 'low' ? 'text-[#6ECB63]' : 
                stressLevel === 'medium' ? 'text-[#FFD166]' : 
                'text-[#FF7A5A]'
              }`}>
                {stressLevel.charAt(0).toUpperCase() + stressLevel.slice(1)} ({Math.round(scorePercentage)}%)
              </span>
            </div>
            <div className="h-5 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getMeterColor()} rounded-full transition-all duration-500 ease-in-out`}
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-neutral-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          {/* Stress Summary */}
          <div className="p-4 bg-neutral-100 rounded-lg mb-6">
            <h3 className="font-heading font-medium text-lg mb-2">Summary</h3>
            <p className="text-neutral-700">{getSummaryText()}</p>
          </div>

          {/* Game Recommendation Button */}
          <Button 
            variant="default" 
            onClick={() => setShowMoodScale(true)}
            className="w-full mb-4 px-4 py-3 flex items-center justify-center"
          >
            <Gamepad2 className="mr-2 h-5 w-5" />
            View Mood Scale & Game Recommendation
          </Button>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => onTabChange("chatbot")}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Talk to AI Advisor
            </Button>
            <Button 
              variant="outline"
              onClick={() => onTabChange("resources")}
              className="flex-1 px-4 py-3 border border-primary text-primary bg-white rounded-lg font-medium"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              View Resources
            </Button>
          </div>

          {/* Dashboard Button */}
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="w-full mt-4 px-4 py-3 bg-white border border-primary text-primary rounded-lg font-medium"
          >
            <BarChart2 className="mr-2 h-5 w-5" />
            View Stress Report Dashboard
          </Button>

          {/* Retake Assessment Button */}
          <Button 
            variant="ghost" 
            onClick={handleResetAssessment}
            className="w-full mt-2 text-neutral-600"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retake Assessment
          </Button>
        </div>
      )}
    </div>
  );
};

export default StressResults;
