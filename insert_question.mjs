import fs from 'fs';

let p4 = fs.readFileSync('src/data/paper4.ts', 'utf8');

// I will find the end of the array inside paper4.ts which is probably around line 78 or so.
// Let's insert a question at the end.
const newQuestion = `
  [
    79,
    5,
    "Complete the pattern in the given figure.",
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "3",
    "The 3rd option fits the missing piece.",
    "data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='45' height='45' x='5' y='5' fill='none' stroke='black'/><rect width='45' height='45' x='50' y='5' fill='black'/><rect width='45' height='45' x='5' y='50' fill='black'/><rect width='45' height='45' x='50' y='50' fill='none' stroke='black' stroke-dasharray='4'/><text x='55' y='75' font-size='20'>?</text></svg>",
    [
      "data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='45' height='45' x='25' y='25' fill='black'/></svg>",
      "data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='20' fill='black'/></svg>",
      "data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><rect width='45' height='45' x='25' y='25' fill='none' stroke='black'/></svg>",
      "data:image/svg+xml;utf8,<svg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'><path d='M25,25 L75,75' stroke='black'/></svg>"
    ]
  ]
`;

// Looking at generateMockTest function in paper4.ts:
// return {
//   id: 'test-paper-4',
// ...
//   questions: rawQuestions.map((q) => {
// ...

// Wait, the raw questions array is defined as `const rawQuestions = [ ... ];`
// We can append to it.

p4 = p4.replace("  [78, 5, 'A pattern formed by two characters a and b is repeated more than once in the following string : x b x a x a x x a x a x b a b. What is x x in the 7th and 8th positions from the left in the above string?', 'aa', 'ab', 'ba', 'bb', '4', 'bb.'],\n  [79, 5, 'The speed of a train T is 100 km per hour and the speed of a person P is 4 km per hour. T crosses P in 15 seconds, if P travels along the direction of motion of T. If P travels along the opposite direction of T, then in how much time does T cross P, in seconds, approximately?', '11', '12', '13', '14', '4', '14.']\n];", 
  "  [78, 5, 'A pattern formed by two characters a and b is repeated more than once in the following string : x b x a x a x x a x a x b a b. What is x x in the 7th and 8th positions from the left in the above string?', 'aa', 'ab', 'ba', 'bb', '4', 'bb.'],\n  [79, 5, 'The speed of a train T is 100 km per hour and the speed of a person P is 4 km per hour. T crosses P in 15 seconds, if P travels along the direction of motion of T. If P travels along the opposite direction of T, then in how much time does T cross P, in seconds, approximately?', '11', '12', '13', '14', '4', '14.'],\n" + newQuestion + "\n];");

if (!p4.includes("Complete the pattern")) {
  console.error("Replacement failed, maybe the string didn't match.");
}

// We also need to modify the map in `paper4.ts` to parse the new structure.
// The array structure in paper4.ts currently has 10 items.
// Let's modify the code that maps rawQuestions to Question objects:
// q[0] is id, q[1] is subject... q[9] is explanation.
// Let's change it so we can accept optional q[10] and q[11] 

let mapReplacement = `  questions: rawQuestions.map((q) => {
    return {
      id: \`q\${q[0]}\`,
      subject: subjects[q[1] as number],
      text: q[2] as string,
      options: [
        { id: '1', text: q[3] as string, imageUrl: (q[11] as any)?.[0] },
        { id: '2', text: q[4] as string, imageUrl: (q[11] as any)?.[1] },
        { id: '3', text: q[5] as string, imageUrl: (q[11] as any)?.[2] },
        { id: '4', text: q[6] as string, imageUrl: (q[11] as any)?.[3] },
      ],
      correctOptionId: q[7] as string,
      explanation: q[8] as string,
      imageUrl: q[10] as string | undefined
    };
  })
`;

// Original mapper in paper4.ts:
p4 = p4.replace(/questions: rawQuestions\.map\(\(q\) => \{\s+return \{\s+id: `q\$\{q\[0\]\}`,\s+subject: subjects\[q\[1\] as number\],\s+text: q\[2\] as string,\s+options: \[\s+\{ id: '1', text: q\[3\] as string \},\s+\{ id: '2', text: q\[4\] as string \},\s+\{ id: '3', text: q\[5\] as string \},\s+\{ id: '4', text: q\[6\] as string \},\s+\],\s+correctOptionId: q\[7\] as string,\s+explanation: q\[8\] as string\s+\};\s+\}\)/g, mapReplacement.trim());


fs.writeFileSync('src/data/paper4.ts', p4);
console.log('Inserted pattern question into paper4');
