const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

// add import of Roulette
code = code.replace(/import \{([^}]+)\} from '\.\/types';/, (match, group1) => {
  if (!group1.includes('Roulette')) {
    return `import {${group1}, Roulette} from './types';`;
  }
  return match;
});

// add state typing
code = code.replace(/contests: Contest\[\];/, "contests: Contest[];\n  roulettes: Roulette[];");

// add actions typing
code = code.replace(/setContests: \(contests: Contest\[\]\) => void;/, "setContests: (contests: Contest[]) => void;\n  setRoulettes: (roulettes: Roulette[]) => void;\n  addRoulette: (roulette: Omit<Roulette, 'id'>) => void;\n  deleteRoulette: (id: string) => void;\n  updateRoulette: (id: string, updates: Partial<Roulette>) => void;");

// add initial state
code = code.replace(/contests: \[\],/, "contests: [],\n  roulettes: [],");

// add actions implementation
code = code.replace(/setContests: \(contests\) => set\(\{ contests \}\),/, "setContests: (contests) => set({ contests }),\n  setRoulettes: (roulettes) => set({ roulettes }),");

const rouletteActions = `
  addRoulette: (roulette) => {
    const id = generateId();
    const obj = { ...roulette, id };
    setDoc(doc(db, \`roulettes/\${id}\`), obj).catch(console.error);
    set((state) => ({ roulettes: [...state.roulettes, obj] }));
  },
  updateRoulette: (id, updates) => {
    updateDoc(doc(db, \`roulettes/\${id}\`), updates).catch(console.error);
    set((state) => ({ roulettes: state.roulettes.map(r => r.id === id ? { ...r, ...updates } : r) }));
  },
  deleteRoulette: (id) => {
    deleteDoc(doc(db, \`roulettes/\${id}\`)).catch(console.error);
    set((state) => ({ roulettes: state.roulettes.filter(r => r.id !== id) }));
  },
`;

code = code.replace(/deleteContest: \(id\) => \{[\s\S]*?\},/, (match) => match + rouletteActions);

fs.writeFileSync('src/store.ts', code);
