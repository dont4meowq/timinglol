const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

if (!code.includes('models: ModelInfo[]')) {
  // Update imports
  code = code.replace(/import \{ Section, Note, User, Fan, DayOff \} from '\.\/types';/, "import { Section, Note, User, Fan, DayOff, ModelInfo } from './types';");
  
  // Update interface AppState
  code = code.replace(/fans: Fan\[\];/, "fans: Fan[];\n  models: ModelInfo[];");
  code = code.replace(/setFans: \(fans: Fan\[\]\) => void;/, "setFans: (fans: Fan[]) => void;\n  setModels: (models: ModelInfo[]) => void;");
  
  // Update initial state
  code = code.replace(/fans: \[\],/, "fans: [],\n  models: [],");
  
  // Update setModels method
  code = code.replace(/setFans: \(fans\) => set\(\{ fans \}\),/, "setFans: (fans) => set({ fans }),\n  setModels: (models) => set({ models }),");
}

fs.writeFileSync('src/store.ts', code);
