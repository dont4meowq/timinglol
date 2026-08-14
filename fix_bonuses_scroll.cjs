const fs = require('fs');
let code = fs.readFileSync('src/components/BonusesPanel.tsx', 'utf8');

code = code.replace(
  '<div className="overflow-y-auto p-2 space-y-1">',
  '<div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">'
);

fs.writeFileSync('src/components/BonusesPanel.tsx', code);
