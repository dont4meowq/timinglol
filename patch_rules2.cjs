const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

if (!code.includes('match /models/')) {
  code = code.replace(/match \/sections\/\{sectionId\} \{/, "match /models/{modelId} {\n      allow read: if isAuthenticated();\n      allow write: if isAdmin();\n    }\n\n    match /sections/{sectionId} {");
}

fs.writeFileSync('firestore.rules', code);
