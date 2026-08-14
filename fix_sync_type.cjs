const fs = require('fs');
let code = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

code = code.replace("let pastesQ = collection(db, 'pastes');", "let pastesQ: any = collection(db, 'pastes');");

fs.writeFileSync('src/hooks/useFirebaseSync.ts', code);
