export interface Resource {
  icon: string;
  title: string;
  description: string;
  techniques: string[];
  link: string;
}

export const resourcesData: Resource[] = [
  {
    icon: "lungs",
    title: "Breathing Exercises",
    description: "Quick techniques to reduce anxiety",
    techniques: [
      "4-7-8 Breathing Technique",
      "Box Breathing Method",
      "Guided Breathing Sessions"
    ],
    link: "#breathing-exercises"
  },
  {
    icon: "clock",
    title: "Time Management",
    description: "Strategies to organize study schedules",
    techniques: [
      "Pomodoro Technique",
      "Priority Matrix Method",
      "Digital Planning Tools"
    ],
    link: "#time-management"
  },
  {
    icon: "brain",
    title: "Mindfulness Practices",
    description: "Stay present and reduce racing thoughts",
    techniques: [
      "5-Minute Meditation Guide",
      "Mindful Walking Exercise",
      "Guided Visualization"
    ],
    link: "#mindfulness"
  },
  {
    icon: "activity",
    title: "Physical Activity",
    description: "Exercise to reduce stress hormones",
    techniques: [
      "10-Minute Desk Stretches",
      "Quick Campus Workout Routes",
      "Stress-Reducing Yoga Poses"
    ],
    link: "#physical-activity"
  }
];

export const featuredResource = {
  title: "Exam Anxiety Coping Strategies",
  description: "Learn practical strategies to manage exam anxiety from Dr. Sarah Chen, academic stress specialist.",
  videoUrl: "#"
};
