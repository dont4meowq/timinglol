const fs = require('fs');
let code = fs.readFileSync('src/components/BonusesPanel.tsx', 'utf8');

// 1. Add useMemo import if missing
if (!code.includes('useMemo')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState, useMemo } from 'react';");
}

// 2. Pre-calculate user bonus stats
const statsCode = `
  const chatters = allUsers.filter(u => u.role === 'chatter').sort((a, b) => a.name.localeCompare(b.name));

  const userStats = useMemo(() => {
    const stats = {};
    chatters.forEach(c => {
      stats[c.id] = { total: 0, count: 0 };
    });
    bonuses.forEach(b => {
      if (stats[b.userId]) {
        stats[b.userId].total += b.amount;
        stats[b.userId].count += 1;
      }
    });
    return stats;
  }, [bonuses, chatters]);
`;
code = code.replace("  const chatters = allUsers.filter(u => u.role === 'chatter').sort((a, b) => a.name.localeCompare(b.name));", statsCode);

// 3. Replace sidebar usage
code = code.replace(
  /{bonuses.some\(b => b.userId === chatter.id\) && \(/g,
  "{userStats[chatter.id]?.count > 0 && ("
);
code = code.replace(
  /{bonuses.filter\(b => b.userId === chatter.id\).length}/g,
  "{userStats[chatter.id].count}"
);

// 4. Replace top chatters usage
code = code.replace(
  /                  {chatters\s*\.map\(c => \(\{\s*\.\.\.c,\s*total: bonuses\.filter\(b => b\.userId === c\.id\)\.reduce\(\(sum, b\) => sum \+ b\.amount, 0\)\s*\}\)\)/g,
  "                  {chatters\n                    .map(c => ({\n                      ...c,\n                      total: userStats[c.id]?.total || 0\n                    }))"
);

fs.writeFileSync('src/components/BonusesPanel.tsx', code);
