const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

if (!code.includes('ModelInfo')) {
  code += `\nexport interface ModelInfo {\n  id: string;\n  name: string;\n}\n`;
}

fs.writeFileSync('src/types.ts', code);
