const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/alert\("Ошибка удаления: " \+ err\.message\);/, '');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
