const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');
code = code.replace(/allow create: if true;/, 'allow create: if isAuthenticated();');
fs.writeFileSync('firestore.rules', code);
