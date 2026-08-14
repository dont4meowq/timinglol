const fs = require('fs');
let code = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

code = code.replace("setContests,", "setContests,\n    setPastes,");
code = code.replace("setCustoms", "setCustoms,\n    setPastes"); // just in case the first didn't hit

const pasteSyncCode = `
      // Pastes
      let pastesQ = collection(db, 'pastes');
      if (currentUser.role !== 'superadmin') {
        pastesQ = query(collection(db, 'pastes'), where('teamId', '==', currentUser.teamId));
      } else {
        pastesQ = query(collection(db, 'pastes'));
      }
      const unsubPastes = onSnapshot(pastesQ, (snap) => {
        const p = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        setPastes(p);
      });
      unsubs.push(unsubPastes);
`;

code = code.replace("return () => unsubs.forEach(u => u());", pasteSyncCode + "\n      return () => unsubs.forEach(u => u());");

fs.writeFileSync('src/hooks/useFirebaseSync.ts', code);
console.log("Sync patched");
