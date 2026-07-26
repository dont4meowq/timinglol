const fs = require('fs');
let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const contestItem = `
        <button 
          onClick={() => { setAppView('contests'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'contests' ? 'bg-orange-600/20 text-orange-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Trophy size={18} />
          <span className="font-medium">Конкурсы</span>
        </button>`;

sidebar = sidebar.replace(
  /<button \s*onClick=\{\(\) => \{ setAppView\('guides'\); setSidebarOpen\(false\); \}\}\s*className=\{`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \$\{appView === 'guides' \? 'bg-blue-600\/20 text-blue-400' : 'hover:bg-\[#2a2d2e\]'\}`\}\s*>\s*<BookOpen size=\{18\} \/>\s*<span className="font-medium">Гайды<\/span>\s*<\/button>/,
  match => match + contestItem
);

fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
