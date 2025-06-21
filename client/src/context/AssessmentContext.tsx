import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// Define a Type for Assessment data
interface AssessmentData {
  id: number;
  userId: number;
  score: number;
  stressLevel: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface AssessmentContextType {
  currentQuestion: number;
  answers: number[];
  stressLevel: 'low' | 'medium' | 'high';
  stressScore: number;
  assessmentCompleted: boolean;
  assessmentHistory: AssessmentData[];
  isLoading: boolean;
  todayAssessmentCount: number;
  canTakeAssessment: boolean;
  setCurrentQuestion: (questionNumber: number) => void;
  setAnswer: (questionIndex: number, value: number) => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
  loadAssessmentHistory: () => Promise<void>;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

interface AssessmentProviderProps {
  children: ReactNode;
}

export const AssessmentProvider = ({ children }: AssessmentProviderProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(0));
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [stressScore, setStressScore] = useState(0);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [todayAssessmentCount, setTodayAssessmentCount] = useState(0);
  const [canTakeAssessment, setCanTakeAssessment] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const setAnswer = useCallback((questionIndex: number, value: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });
  }, []);

  const calculateStressLevel = useCallback((score: number): 'low' | 'medium' | 'high' => {
    const percentage = (score / 50) * 100; // 10 questions, max 5 points each
    if (percentage < 40) return 'low';
    if (percentage < 70) return 'medium';
    return 'high';
  }, []);

  const completeAssessment = useCallback(async () => {
    // Calculate total score
    const totalScore = answers.reduce((sum, value) => sum + value, 0);
    const level = calculateStressLevel(totalScore);
    
    setStressScore(totalScore);
    setStressLevel(level);
    setAssessmentCompleted(true);

    // Save assessment result to backend
    try {
      // Get the current user ID from localStorage
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : 1;

      await apiRequest('POST', '/api/assessments', {
        userId: userId,
        score: totalScore,
        stressLevel: level
      });
      
      toast({
        title: "Assessment Complete",
        description: "Your stress assessment has been recorded. View details in your dashboard.",
      });
    } catch (error) {
      // Silently handle assessment save failure
      toast({
        title: "Error",
        description: "Failed to save your assessment results.",
        variant: "destructive"
      });
    }
  }, [answers, calculateStressLevel, toast]);

  const resetAssessment = useCallback(() => {
    setCurrentQuestion(1);
    setAnswers(Array(10).fill(0));
    setStressLevel('low');
    setStressScore(0);
    setAssessmentCompleted(false);
  }, []);

  const loadAssessmentHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setIsLoading(false);
        return;
      }

      const userId = JSON.parse(storedUser).id;
      const data = await apiRequest<AssessmentData[]>('GET', `/api/assessments/user/${userId}`);
      
      if (data && Array.isArray(data)) {
        setAssessmentHistory(data);
        
        // Count assessments taken today
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const todayAssessments = data.filter(assessment => {
          const assessmentDate = new Date(assessment.createdAt).toISOString().split('T')[0];
          return assessmentDate === today;
        });
        
        setTodayAssessmentCount(todayAssessments.length);
        
        // Check if user can take more assessments today (limit: 3 per day)
        setCanTakeAssessment(todayAssessments.length < 3);
        
        if (todayAssessments.length >= 3) {
          toast({
            title: "Daily Limit Reached",
            description: "You've reached the limit of 3 assessments per day. Check back tomorrow!",
          });
        }
      }
    } catch (error) {
      // Silently handle assessment history load failure
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load assessment history when the component mounts
  useEffect(() => {
    loadAssessmentHistory();
  }, [loadAssessmentHistory]);

  // Update the completeAssessment function to check for daily limit
  const handleCompleteAssessment = useCallback(async () => {
    // First check if the user can take more assessments today
    if (!canTakeAssessment) {
      toast({
        title: "Daily Limit Reached",
        description: "You've reached the limit of 3 assessments per day. Check back tomorrow!",
        variant: "destructive"
      });
      return;
    }

    // If they can, proceed with the original completeAssessment logic
    await completeAssessment();
    
    // After saving, reload the history to update the counts
    await loadAssessmentHistory();
    
    // Invalidate dashboard queries to refresh the data
    queryClient.invalidateQueries({ queryKey: ['/api/assessments/user'] });
  }, [canTakeAssessment, completeAssessment, loadAssessmentHistory, queryClient, toast]);

  return (
    <AssessmentContext.Provider
      value={{
        currentQuestion,
        answers,
        stressLevel,
        stressScore,
        assessmentCompleted,
        assessmentHistory,
        isLoading,
        todayAssessmentCount,
        canTakeAssessment,
        setCurrentQuestion,
        setAnswer,
        completeAssessment: handleCompleteAssessment,
        resetAssessment,
        loadAssessmentHistory
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
