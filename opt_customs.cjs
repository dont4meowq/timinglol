const fs = require('fs');
let code = fs.readFileSync('src/components/CustomsPanel.tsx', 'utf8');

if (!code.includes('useMemo')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState, useMemo } from 'react';");
}

const target = `  const filteredCustoms = customs.filter(c => {
    if (selectedModelFilter !== 'all' && c.model !== selectedModelFilter) return false;
    const s = search.toLowerCase();
    return (c.fanLink || '').toLowerCase().includes(s) || 
           (c.customNumber || '').toLowerCase().includes(s) ||
           (c.statusComment || '').toLowerCase().includes(s);
  }).sort((a, b) => b.createdAt - a.createdAt);`;

const repl = `  const filteredCustoms = React.useMemo(() => {
    return customs.filter(c => {
      if (selectedModelFilter !== 'all' && c.model !== selectedModelFilter) return false;
      const s = search.toLowerCase();
      return (c.fanLink || '').toLowerCase().includes(s) || 
             (c.customNumber || '').toLowerCase().includes(s) ||
             (c.statusComment || '').toLowerCase().includes(s);
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [customs, selectedModelFilter, search]);`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/CustomsPanel.tsx', code);
