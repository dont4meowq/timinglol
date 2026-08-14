const fs = require('fs');

// Patch App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes('PastesPanel')) {
  appCode = appCode.replace("import { CustomsPanel } from './components/CustomsPanel';", "import { CustomsPanel } from './components/CustomsPanel';\nimport { PastesPanel } from './components/PastesPanel';");
  
  appCode = appCode.replace(
    "appView === 'customs' ? (\n                <CustomsPanel />\n              ) : (",
    "appView === 'customs' ? (\n                <CustomsPanel />\n              ) : appView === 'pastes' ? (\n                <PastesPanel />\n              ) : ("
  );
  fs.writeFileSync('src/App.tsx', appCode);
}

// Patch Sidebar.tsx
let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
if (!sidebarCode.includes('setAppView(\'pastes\')')) {
  sidebarCode = sidebarCode.replace("import { Users, Calendar, Gift, LogOut, ChevronDown, Gamepad2, BookOpen, Trophy, Scissors } from 'lucide-react';", "import { Users, Calendar, Gift, LogOut, ChevronDown, Gamepad2, BookOpen, Trophy, Scissors, ClipboardList } from 'lucide-react';");
  
  const menuBtn = `
      <button
        onClick={() => setAppView('pastes')}
        className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all \${appView === 'pastes' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-neutral-400 hover:bg-[#252526] hover:text-white'}\`}
      >
        <ClipboardList size={20} />
        <span className="font-medium">Пасты</span>
      </button>
      <button
        onClick={() => setAppView('bonuses')}
`;
  sidebarCode = sidebarCode.replace(`<button\n        onClick={() => setAppView('bonuses')}`, menuBtn.trim() + "\n");
  fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);
}

console.log('Navigation patched');
