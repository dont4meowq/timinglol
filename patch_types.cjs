const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

const regex1 = /export interface Note \{[\s\S]*?pinned: boolean;\n\}/g;
const regex2 = /export interface Section \{[\s\S]*?order\?: number;\n\}/g;

content = content.replace(regex1, '');
content = content.replace(regex2, '');

fs.writeFileSync('src/types.ts', content);
