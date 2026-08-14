const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  "const q = query(collection(db, 'dayOffs'), where('operator', '==', name));",
  "const q = query(collection(db, 'dayOffs'), where('operator', '==', name || 'UNASSIGNED'));"
);
code = code.replace(
  "const usersQ = query(collection(db, 'users'), where('assignedModel', '==', oldName));",
  "const usersQ = query(collection(db, 'users'), where('assignedModel', '==', oldName || 'UNASSIGNED'));"
);
code = code.replace(
  "const dayOffsQ = query(collection(db, 'dayOffs'), where('model', '==', oldName));",
  "const dayOffsQ = query(collection(db, 'dayOffs'), where('model', '==', oldName || 'UNASSIGNED'));"
);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
