const fs = require('fs');
let code = fs.readFileSync('src/components/BonusesPanel.tsx', 'utf8');

const target = `  const selectedUser = chatters.find(c => c.id === selectedUserId);
  const userBonuses = bonuses
    .filter(b => b.userId === selectedUserId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());`;

const repl = `  const selectedUser = chatters.find(c => c.id === selectedUserId);
  const userBonuses = useMemo(() => {
    return bonuses
      .filter(b => b.userId === selectedUserId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bonuses, selectedUserId]);`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/BonusesPanel.tsx', code);
