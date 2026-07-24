const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(/currentUser\?\.username/g, "currentUser?.name");
code = code.replace(/addSection\(id, 'Новый раздел'\);/, "addSection(id, 'Новый раздел', currentUser?.role === 'admin' ? 'Shared' : (currentUser?.assignedModel || 'Shared'));");

fs.writeFileSync('src/components/Sidebar.tsx', code);
