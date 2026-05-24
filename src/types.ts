export type Subject = 
  | 'General Intelligence and Reasoning' 
  | 'General Awareness' 
  | 'Quantitative Aptitude' 
  | 'English Comprehension';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  subject: Subject;
  text: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
}

export interface MockTest {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  totalMarks: number;
  questions: Question[];
}

export type QuestionStatus = 
  | 'NOT_VISITED' 
  | 'NOT_ANSWERED' 
  | 'ANSWERED' 
  | 'MARKED_FOR_REVIEW' 
  | 'ANSWERED_AND_MARKED_FOR_REVIEW';

export interface TestAttempt {
  answers: Record<string, string>; // questionId -> optionId
  statuses: Record<string, QuestionStatus>;
  timeRemaining: number;
}
