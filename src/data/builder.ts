import { Question } from '../types';

export type RawQuestion = [
  number, // 1 to 100
  number, // 0: Reasoning, 1: GK, 2: Quant, 3: English
  string, // text
  string, string, string, string, // options
  string, // correct option id
  string, // explanation
  string?, // optional question background image URL
  [string, string, string, string]?, // optional option image URLs
  string? // optional context (passage)
];

const subjects = [
  'General Intelligence and Reasoning',
  'General Awareness',
  'Quantitative Aptitude',
  'English Comprehension',
  'Computer Knowledge',
  'General Studies II'
] as const;

export function buildQuestions(prefix: string, raw: RawQuestion[]): Question[] {
  return raw.map(r => ({
    id: `${prefix}_q${r[0]}`,
    subject: subjects[r[1]] as any,
    text: r[2],
    options: [
      { id: '1', text: r[3], imageUrl: r[10]?.[0] },
      { id: '2', text: r[4], imageUrl: r[10]?.[1] },
      { id: '3', text: r[5], imageUrl: r[10]?.[2] },
      { id: '4', text: r[6], imageUrl: r[10]?.[3] }
    ],
    correctOptionId: r[7],
    explanation: r[8],
    imageUrl: r[9],
    context: r[11]
  }));
}
