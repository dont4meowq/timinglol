const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

// Add import
code = code.replace("import { Section, Note, User, Fan, DayOff, ModelInfo } from './types';", "import { Section, Note, User, Fan, DayOff, ModelInfo, Bonus } from './types';");

// Add state
code = code.replace("  dayOffs: DayOff[];", "  dayOffs: DayOff[];\n  bonuses: Bonus[];");
code = code.replace("  appView: 'dashboard' | 'admin' | 'crm' | 'schedule';", "  appView: 'dashboard' | 'admin' | 'crm' | 'schedule' | 'bonuses';");
code = code.replace("  setAppView: (view: 'dashboard' | 'admin' | 'crm' | 'schedule') => void;", "  setAppView: (view: 'dashboard' | 'admin' | 'crm' | 'schedule' | 'bonuses') => void;");

// Add actions types
code = code.replace("  setDayOffs: (dayOffs: DayOff[]) => void;", "  setDayOffs: (dayOffs: DayOff[]) => void;\n  setBonuses: (bonuses: Bonus[]) => void;\n  addBonus: (bonus: Omit<Bonus, 'id'>) => void;\n  deleteBonus: (id: string) => void;");

// Initialize state
code = code.replace("  dayOffs: [],", "  dayOffs: [],\n  bonuses: [],");

// Implement actions
const addBonusImpl = `  setBonuses: (bonuses) => set({ bonuses }),
  addBonus: (bonus) => {
    const id = generateId();
    const obj = { ...bonus, id };
    setDoc(doc(db, \`bonuses/\${id}\`), obj);
    set((state) => ({ bonuses: [...state.bonuses, obj] }));
  },
  deleteBonus: (id) => {
    deleteDoc(doc(db, \`bonuses/\${id}\`));
    set((state) => ({ bonuses: state.bonuses.filter(b => b.id !== id) }));
  },`;

code = code.replace("  setDayOffs: (dayOffs) => set({ dayOffs }),", "  setDayOffs: (dayOffs) => set({ dayOffs }),\n" + addBonusImpl);

fs.writeFileSync('src/store.ts', code);
