export interface StressQuestion {
  id: number;
  question: string;
  options: string[];
}

export const stressQuestions: StressQuestion[] = [
  {
    id: 1,
    question: "How often do you find yourself panicking about assignment deadlines even when you have time?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
  },
  {
    id: 2,
    question: "How often do you stay up past midnight to finish homework or study for tests?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Every night"]
  },
  {
    id: 3,
    question: "When you think about upcoming exams, do you feel physical symptoms (racing heart, headache, upset stomach)?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
  },
  {
    id: 4,
    question: "How difficult is it to focus in class when you're worried about other assignments?",
    options: ["Not difficult", "Slightly difficult", "Moderately difficult", "Very difficult", "Can't focus at all"]
  },
  {
    id: 5,
    question: "How often do you compare your grades or achievements to your classmates?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
  },
  {
    id: 6,
    question: "How often do you skip hanging out with friends because of study pressure?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
  },
  {
    id: 7,
    question: "When a teacher calls on you unexpectedly, how anxious do you feel?",
    options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"]
  },
  {
    id: 8,
    question: "How often do you skip meals or just grab junk food because you're too busy studying?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
  },
  {
    id: 9,
    question: "When you get a lower grade than expected, how long does it negatively affect your mood?",
    options: ["Not at all", "A few hours", "The rest of the day", "Several days", "A week or more"]
  },
  {
    id: 10,
    question: "How often do you have negative thoughts about your academic future?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"]
  }
];
