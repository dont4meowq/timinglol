const fs = require('fs');
let code = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

const target = `      let pastesQ: any = collection(db, 'pastes');
      if (currentUser.role !== 'superadmin') {
        pastesQ = query(collection(db, 'pastes'), where('teamId', '==', currentUser.teamId));
      } else {
        pastesQ = query(collection(db, 'pastes'));
      }`;

code = code.replace(target, "      const pastesQ = getTeamQuery('pastes');");

fs.writeFileSync('src/hooks/useFirebaseSync.ts', code);
