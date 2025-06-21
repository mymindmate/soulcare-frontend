import { useState, useEffect } from "react";
import { stressQuestions } from "@/lib/stressQuestions";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { useAssessment } from "@/context/AssessmentContext";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const StressAssessment = () => {
  const { 
    currentQuestion, 
    setCurrentQuestion, 
    answers, 
    setAnswer, 
    completeAssessment, 
    todayAssessmentCount,
    canTakeAssessment,
    isLoading
  } = useAssessment();
  const [answered, setAnswered] = useState(false);
  const { toast } = useToast();

  // Effect to check if current question is answered
  useEffect(() => {
    setAnswered(answers[currentQuestion - 1] > 0);
  }, [currentQuestion, answers]);

  const handleOptionSelect = (value: string) => {
    setAnswer(currentQuestion - 1, parseInt(value));
    setAnswered(true);
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (!answered) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option before continuing.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < stressQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeAssessment();
    }
  };

  const currentQuestionData = stressQuestions[currentQuestion - 1];
  const progressPercentage = (currentQuestion / stressQuestions.length) * 100;

  // Loading or blocked state
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <h2 className="font-heading font-bold text-2xl mb-4">Loading assessment...</h2>
            <p>Please wait while we load your assessment data.</p>
          </div>
        </div>
      </div>
    );
  }

  // If user has reached the daily limit, show message
  if (!canTakeAssessment) {
    return (
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-heading font-bold text-2xl mb-2">Daily Limit Reached</h2>
            <p className="text-neutral-600">You've completed 3 assessments today.</p>
          </div>
          
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              You've reached the maximum limit of 3 assessments per day. Please check back tomorrow to take another assessment, or review your previous results in the Dashboard.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="font-heading font-bold text-2xl mb-2">Stress Assessment</h2>
          <p className="text-neutral-600">Answer these questions to help us understand your stress levels.</p>
          
          {/* Assessment limit indicator */}
          <div className="flex justify-center mt-3">
            <Badge variant={todayAssessmentCount >= 2 ? "destructive" : "secondary"} className="px-3 py-1">
              {3 - todayAssessmentCount} of 3 assessments remaining today
            </Badge>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-neutral-600 mb-1">
            <span>Question {currentQuestion} of {stressQuestions.length}</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white rounded-lg shadow-md mb-4 transition-all duration-300 ease-in-out">
          <CardContent className="p-6">
            <h3 className="font-heading font-medium text-lg mb-4">
              {currentQuestionData.question}
            </h3>
            <RadioGroup 
              value={answers[currentQuestion - 1].toString()} 
              onValueChange={handleOptionSelect}
              className="space-y-3"
            >
              {currentQuestionData.options.map((option, index) => (
                <div 
                  key={index}
                  className={`block p-3 border ${answers[currentQuestion - 1] === (index + 1) ? 'border-primary bg-primary/5' : 'border-neutral-200'} rounded-lg hover:bg-neutral-100 cursor-pointer transition-all duration-200`}
                  onClick={() => handleOptionSelect((index + 1).toString())}
                >
                  <div className="flex items-center">
                    <RadioGroupItem value={(index + 1).toString()} id={`option-${index}`} className="mr-3"/>
                    <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">{option}</Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 1}
            className="px-6 py-2"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button 
            onClick={handleNext} 
            className="px-6 py-2"
          >
            {currentQuestion === stressQuestions.length ? 'See Results' : 'Next'} 
            {currentQuestion !== stressQuestions.length && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StressAssessment;
