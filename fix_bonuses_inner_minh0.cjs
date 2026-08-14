const fs = require('fs');
let code = fs.readFileSync('src/components/BonusesPanel.tsx', 'utf8');

code = code.replace(
  'className="bg-[#252526] rounded-xl border border-neutral-700 overflow-hidden flex-1 flex flex-col"',
  'className="bg-[#252526] rounded-xl border border-neutral-700 overflow-hidden flex-1 flex flex-col min-h-0"'
);

fs.writeFileSync('src/components/BonusesPanel.tsx', code);
