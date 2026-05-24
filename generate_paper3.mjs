import fs from 'fs';

let out = `import { RawQuestion } from './builder';\n\nexport const paper3_raw: RawQuestion[] = [\n`;

const subjects = [
  { start: 1, end: 30, sub: 2, title: 'Maths Q' },
  { start: 31, end: 60, sub: 0, title: 'Reasoning Q' },
  { start: 61, end: 105, sub: 3, title: 'English Q' },
  { start: 106, end: 130, sub: 1, title: 'GA Q' },
  { start: 131, end: 150, sub: 4, title: 'Computer Q' },
];

for (const s of subjects) {
  for (let i = s.start; i <= s.end; i++) {
    out += `  [${i}, ${s.sub}, '${s.title}${i}: Example question text from paper', 'Option A', 'Option B', 'Option C', 'Option D', '1', 'Explanation for ${i}'],\n`;
  }
}

out += `];\n`;
fs.writeFileSync('./src/data/paper3.ts', out);
console.log('Done!');
