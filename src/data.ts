import { MockTest } from './types';
import { paper1_raw } from './data/paper1';
import { paper2_raw } from './data/paper2';
import { paper3_raw } from './data/paper3';
import { paper4_raw } from './data/paper4';
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
  },
  {
    id: 'ssc-cgl-tier2-20-jan-2025',
    title: 'SSC CGL 2024 (Tier-II) Previous Year Paper',
    date: '2025-01-20',
    durationMinutes: 135, // 2 Hour : 15 Minute
    totalMarks: 450,
    positiveMarks: 3,
    negativeMarks: 1,
    questions: buildQuestions('p3', paper3_raw)
  },
  {
    id: 'csat-2026',
    title: 'CSAT 2026 (General Studies Paper-II)',
    date: '2026-05-24',
    durationMinutes: 120,
    totalMarks: 200,
    positiveMarks: 2.5,
    negativeMarks: 0.833,
    questions: buildQuestions('p4', paper4_raw)
  }
];
