const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/console\.error\(err\);\s*\}/, "console.error(err);\n        alert('Ошибка удаления: ' + (err.message || ''));\n      }");

fs.writeFileSync('src/components/AdminPanel.tsx', code);
