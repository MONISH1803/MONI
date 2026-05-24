import { MockTest } from './types';
import { paper1_raw } from './data/paper1';
import { paper2_raw } from './data/paper2';
import { buildQuestions } from './data/builder';

export const mockTests: MockTest[] = [
  {
    id: 'ssc-cgl-12-sept-2025-shift-1',
    title: 'SSC CGL Tier-I (12th Sept 2025, Shift-1)',
    date: '2025-09-12',
    durationMinutes: 60,
    totalMarks: 200,
    questions: buildQuestions('p1', paper1_raw)
  },
  {
    id: 'ssc-cgl-17-sept-2025-shift-1',
    title: 'SSC CGL Tier-I (17th Sept 2025, Shift-1)',
    date: '2025-09-17',
    durationMinutes: 60,
    totalMarks: 200,
    questions: buildQuestions('p2', paper2_raw)
  }
];
