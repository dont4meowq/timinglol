const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

if (!code.includes('pastes: Paste[];')) {
  // Add Paste import
  code = code.replace("import { User, DayOff, ModelInfo, Bonus, Guide, GuideFolder, Custom , Contest, Roulette} from './types';", "import { User, DayOff, ModelInfo, Bonus, Guide, GuideFolder, Custom , Contest, Roulette, Paste} from './types';");
  
  // Add to AppState
  code = code.replace("appView: 'admin' | 'schedule' | 'bonuses' | 'roulette' | 'guides' | 'customs' | 'contests';", "appView: 'admin' | 'schedule' | 'bonuses' | 'roulette' | 'guides' | 'customs' | 'contests' | 'pastes';");
  code = code.replace("setAppView: (view: 'admin' | 'schedule' | 'bonuses' | 'roulette' | 'guides' | 'customs' | 'contests') => void;", "setAppView: (view: 'admin' | 'schedule' | 'bonuses' | 'roulette' | 'guides' | 'customs' | 'contests' | 'pastes') => void;");
  
  code = code.replace("roulettes: Roulette[];", "roulettes: Roulette[];\n  pastes: Paste[];");
  code = code.replace("setRoulettes: (roulettes: Roulette[]) => void;", "setRoulettes: (roulettes: Roulette[]) => void;\n  setPastes: (pastes: Paste[]) => void;\n  addPaste: (paste: Omit<Paste, 'id' | 'createdAt'>) => void;\n  deletePaste: (id: string) => void;\n  updatePaste: (id: string, updates: Partial<Paste>) => void;");

  // Add implementation
  code = code.replace("roulettes: [],", "roulettes: [],\n  pastes: [],");
  code = code.replace("setRoulettes: (roulettes) => set({ roulettes }),", "setRoulettes: (roulettes) => set({ roulettes }),\n  setPastes: (pastes) => set({ pastes }),\n  addPaste: async (paste) => {\n    const id = Date.now().toString() + Math.random().toString(36).substring(2);\n    const obj = { ...paste, id, createdAt: Date.now() , teamId: get().currentUser?.teamId};\n    await import('firebase/firestore').then(({doc, setDoc}) => setDoc(doc(import('../src/firebase.js').then(m=>m.db) as any, 'pastes', id), obj)).catch(()=>{});\n    set((state) => ({ pastes: [...state.pastes, obj as Paste] }));\n  },\n  deletePaste: async (id) => {\n    await import('firebase/firestore').then(({doc, deleteDoc}) => deleteDoc(doc(import('../src/firebase.js').then(m=>m.db) as any, 'pastes', id))).catch(()=>{});\n    set((state) => ({ pastes: state.pastes.filter(p => p.id !== id) }));\n  },\n  updatePaste: async (id, updates) => {\n    await import('firebase/firestore').then(({doc, updateDoc}) => updateDoc(doc(import('../src/firebase.js').then(m=>m.db) as any, 'pastes', id), updates)).catch(()=>{});\n    set((state) => ({\n      pastes: state.pastes.map(p => p.id === id ? { ...p, ...updates } : p)\n    }));\n  },");
  
  fs.writeFileSync('src/store.ts', code);
  console.log("Store patched.");
}
