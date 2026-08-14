const fs = require('fs');
let code = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

const target = `    let customsQuery = getTeamQuery('customs');
    if (currentUser.role === 'chatter') {
      if (currentUser.teamId) {
        customsQuery = query(collection(db, 'customs'), where('teamId', '==', currentUser.teamId), where('model', '==', currentUser.assignedModel));
      } else {
        customsQuery = query(collection(db, 'customs'), where('model', '==', currentUser.assignedModel));
      }
    }`;

const repl = `    let customsQuery = getTeamQuery('customs');
    if (currentUser.role === 'chatter') {
      const safeModel = currentUser.assignedModel || 'UNASSIGNED';
      if (currentUser.teamId) {
        customsQuery = query(collection(db, 'customs'), where('teamId', '==', currentUser.teamId), where('model', '==', safeModel));
      } else {
        customsQuery = query(collection(db, 'customs'), where('model', '==', safeModel));
      }
    }`;

code = code.replace(target, repl);
fs.writeFileSync('src/hooks/useFirebaseSync.ts', code);
