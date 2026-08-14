const fs = require('fs');
let code = fs.readFileSync('src/components/PastesPanel.tsx', 'utf8');

const target = `  const filteredPastes = pastes.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.content.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => b.createdAt - a.createdAt);`;

const repl = `  const filteredPastes = React.useMemo(() => {
    const s = search.toLowerCase();
    return pastes.filter(p => 
      p.title.toLowerCase().includes(s) || 
      p.content.toLowerCase().includes(s)
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [pastes, search]);`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/PastesPanel.tsx', code);
