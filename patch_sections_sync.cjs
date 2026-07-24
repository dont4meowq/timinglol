const fs = require('fs');
let code = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

code = code.replace(
  /\/\/ Sections: Admins see all, Chatters see 'Shared' and their assigned model[\s\S]*?const sectionsQuery = [^;]+;/,
  "// Sections: Everyone sees all\n    const sectionsQuery = collection(db, 'sections');"
);

fs.writeFileSync('src/hooks/useFirebaseSync.ts', code);
