const fs = require('fs');

let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('export interface Paste')) {
  code += `
export interface Paste {
  teamId?: string;
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: number;
}
`;
  fs.writeFileSync('src/types.ts', code);
  console.log("Types updated.");
}
