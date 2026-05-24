import { Question } from '../types';

export type RawQuestion = [
  number, // 1 to 100
  number, // 0: Reasoning, 1: GK, 2: Quant, 3: English
  string, // text
  string, string, string, string, // options
  string, // correct option id
  string // explanation
];

const subjects = [
  'General Intelligence and Reasoning',
  'General Awareness',
  'Quantitative Aptitude',
  'English Comprehension'
] as const;

export function buildQuestions(prefix: string, raw: RawQuestion[]): Question[] {
  return raw.map(r => ({
    id: `${prefix}_q${r[0]}`,
    subject: subjects[r[1]] as any,
    text: r[2],
    options: [
      { id: '1', text: r[3] },
      { id: '2', text: r[4] },
      { id: '3', text: r[5] },
      { id: '4', text: r[6] }
    ],
    correctOptionId: r[7],
    explanation: r[8]
  }));
}
