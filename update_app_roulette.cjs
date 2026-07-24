const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { RoulettePanel }")) {
  code = code.replace("import { BonusesPanel } from './components/BonusesPanel';", "import { BonusesPanel } from './components/BonusesPanel';\nimport { RoulettePanel } from './components/RoulettePanel';");
}

const target = `      ) : appView === 'bonuses' ? (
        <BonusesPanel />
      ) : (`;

const replacement = `      ) : appView === 'bonuses' ? (
        <BonusesPanel />
      ) : appView === 'roulette' ? (
        <RoulettePanel />
      ) : (`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
