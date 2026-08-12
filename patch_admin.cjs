const fs = require('fs');

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Patch new user creation
code = code.replace(
  `const newUserObj = {
        id: uid,
        email: newLogin, // save original login as email field for display
        name: newName,
        role,
        ...(role === 'chatter' ? { assignedModel: assignedModel.trim() } : {})
      };`,
  `const newUserObj = {
        id: uid,
        email: newLogin,
        name: newName,
        role,
        ...(role === 'chatter' ? { assignedModel: assignedModel.trim() } : {}),
        teamId: currentUser?.teamId
      };`
);

// Patch new model creation
code = code.replace(
  `await setDoc(doc(db, 'models', newModelName.trim()), {
        id: newModelName.trim(),
        name: newModelName.trim()
      });`,
  `await setDoc(doc(db, 'models', newModelName.trim()), {
        id: newModelName.trim(),
        name: newModelName.trim(),
        teamId: currentUser?.teamId
      });`
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('Patched AdminPanel');
