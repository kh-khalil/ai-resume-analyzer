interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  userId?: string;
  createdAt?: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback;
}

interface Suggestion {
  type: "good" | "improve";
  tip: string;
  explanation: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

interface Feedback {
  overallScore: number;
  ATS: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: ATSProps;
  content: ATSProps;
  structure: ATSProps;
  skills: ATSProps;
}
