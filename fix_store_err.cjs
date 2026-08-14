const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

const regex = /updatePaste: \(id, updates\) => \{[\s\S]+?addRoulette: \(roulette\) => \{/m;

const replacement = `updatePaste: (id, updates) => {
    updateDoc(doc(db, \`pastes/\${id}\`), updates).catch(console.error);
    set((state) => ({
      pastes: state.pastes.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  },
  addRoulette: (roulette) => {`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/store.ts', code);
console.log("Fixed store.");
