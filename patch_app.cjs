const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');

if (!app.includes('ContestsPanel')) {
  app = app.replace(
    /import \{ GuidesPanel \} from '\.\/components\/GuidesPanel';/,
    "import { GuidesPanel } from './components/GuidesPanel';\nimport { ContestsPanel } from './components/ContestsPanel';"
  );
  
  app = app.replace(
    /\} else if \(appView === 'guides'\) \{/,
    "} else if (appView === 'guides') {\n        return <GuidesPanel />;\n      } else if (appView === 'contests') {\n        return <ContestsPanel />;"
  );
  
  app = app.replace(
    /appView === 'guides' \? \(\s*<GuidesPanel \/>\s*\) : appView === 'customs' \? \(\s*<CustomsPanel \/>\s*\)/,
    "appView === 'guides' ? (\n        <GuidesPanel />\n      ) : appView === 'contests' ? (\n        <ContestsPanel />\n      ) : appView === 'customs' ? (\n        <CustomsPanel />\n      )"
  );

  fs.writeFileSync('src/App.tsx', app);
}

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
if (!sidebar.includes('contests')) {
  sidebar = sidebar.replace(
    /import \{ .* Trophy/g,
    "import { Users, BookOpen, Settings, LayoutDashboard, UserCheck, CalendarDays, Gift, Dices, Trophy, Flag" // Flag for contests
  );
  
  // Find Guides item and insert Contests item after it
  const guideItem = `
        <button 
          onClick={() => { setAppView('guides'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'guides' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <BookOpen size={20} />
          <span>Гайды</span>
        </button>`;
        
  const contestItem = `
        <button 
          onClick={() => { setAppView('contests'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'contests' ? 'bg-orange-600/20 text-orange-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Trophy size={20} />
          <span>Конкурсы</span>
        </button>`;

  sidebar = sidebar.replace(
    /<button \s*onClick=\{\(\) => \{ setAppView\('guides'\); setSidebarOpen\(false\); \}\}\s*className=\{`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \$\{appView === 'guides' \? 'bg-blue-600\/20 text-blue-400' : 'hover:bg-\[#2a2d2e\]'\}`\}\s*>\s*<BookOpen size=\{20\} \/>\s*<span>Гайды<\/span>\s*<\/button>/,
    match => match + contestItem
  );
  
  fs.writeFileSync('src/components/Sidebar.tsx', sidebar);
}

