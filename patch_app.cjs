const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/addSection\(id, 'Новый раздел'\);/, "addSection(id, 'Новый раздел', currentUser?.role === 'admin' ? 'Shared' : (currentUser?.assignedModel || 'Shared'));");

fs.writeFileSync('src/App.tsx', code);
