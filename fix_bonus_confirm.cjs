const fs = require('fs');
let code = fs.readFileSync('src/components/BonusesPanel.tsx', 'utf8');

code = code.replace(
  "if(confirm('Удалить этот бонус?')) deleteBonus(bonus.id);",
  "deleteBonus(bonus.id);"
);

fs.writeFileSync('src/components/BonusesPanel.tsx', code);
