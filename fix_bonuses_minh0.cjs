const fs = require('fs');
let code = fs.readFileSync('src/components/BonusesPanel.tsx', 'utf8');

code = code.replace(
  '{/* Right Column: Bonuses */}\n        <div className="flex-1 flex flex-col bg-[#1e1e1e]">',
  '{/* Right Column: Bonuses */}\n        <div className="flex-1 flex flex-col bg-[#1e1e1e] min-h-0 min-w-0">'
);

code = code.replace(
  `          {selectedUserId === 'top' ? (\n            <div className="flex-1 flex flex-col p-6">`,
  `          {selectedUserId === 'top' ? (\n            <div className="flex-1 flex flex-col p-6 min-h-0">`
);

fs.writeFileSync('src/components/BonusesPanel.tsx', code);
