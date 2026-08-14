const fs = require('fs');
let code = fs.readFileSync('src/components/ContestsPanel.tsx', 'utf8');

const target = `  const filteredContests = contests.filter(contest => {
    const query = searchQuery.toLowerCase();
    return contest.title.toLowerCase().includes(query) || contest.content.toLowerCase().includes(query);
  });`;

const repl = `  const filteredContests = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    return contests.filter(contest => 
      contest.title.toLowerCase().includes(query) || contest.content.toLowerCase().includes(query)
    );
  }, [contests, searchQuery]);`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/ContestsPanel.tsx', code);
