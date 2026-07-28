const fs = require('fs');

let store = fs.readFileSync('src/store.ts', 'utf8');

// Types
store = store.replace(/import \{ Section, Note, User, Fan, Custom, DayOff, ModelInfo, Bonus, Guide, Contest, Roulette \} from '\.\/types';/, "import { User, Fan, Custom, DayOff, ModelInfo, Bonus, Guide, Contest, Roulette } from './types';");

store = store.replace(/\s*sections: Section\[\];\s*activeSectionId: string \| null;\s*activeNoteId: string \| null;\s*searchQuery: string;/, "");

store = store.replace(/appView: 'dashboard' \| 'admin' \| 'crm' \| 'schedule' \| 'bonuses' \| 'roulette' \| 'guides' \| 'customs' \| 'contests';/g, "appView: 'admin' | 'crm' | 'schedule' | 'bonuses' | 'roulette' | 'guides' | 'customs' | 'contests';");

store = store.replace(/\s*setSections: \(sections: Section\[\]\) => void;/, "");

const actionRegex = /\s*addSection: \([\s\S]*?togglePinNote: \([\s\S]*?\},/g;
// actually, I can just use string manipulation or a simpler regex

fs.writeFileSync('src/store.ts', store);
