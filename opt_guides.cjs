const fs = require('fs');
let code = fs.readFileSync('src/components/GuidesPanel.tsx', 'utf8');

const target = `  const filteredGuides = guides.filter(guide => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = guide.title.toLowerCase().includes(q) || guide.content.toLowerCase().includes(q);
    const matchesFolder = activeFolderId ? guide.blockId === activeFolderId : true;
    const matchesSubFolder = activeSubFolderId ? guide.subBlockId === activeSubFolderId : true;
    return matchesSearch && matchesFolder && matchesSubFolder;
  });`;

const repl = `  const filteredGuides = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    return guides.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(q) || guide.content.toLowerCase().includes(q);
      const matchesFolder = activeFolderId ? guide.blockId === activeFolderId : true;
      const matchesSubFolder = activeSubFolderId ? guide.subBlockId === activeSubFolderId : true;
      return matchesSearch && matchesFolder && matchesSubFolder;
    });
  }, [guides, searchQuery, activeFolderId, activeSubFolderId]);`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/GuidesPanel.tsx', code);
