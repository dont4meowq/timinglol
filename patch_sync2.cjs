const fs = require('fs');
let content = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

const regex = /\/\/ Sections: Everyone sees all[\s\S]*?setSections\(sections\);\s*}\)\s*\);/g;
content = content.replace(regex, '');

fs.writeFileSync('src/hooks/useFirebaseSync.ts', content);
