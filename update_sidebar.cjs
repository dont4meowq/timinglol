const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  "import { Folder, FolderOpen, Plus, MoreHorizontal, Edit2, Trash2, LogOut, Shield, Users, FileText, Calendar } from 'lucide-react';",
  "import { Folder, FolderOpen, Plus, MoreHorizontal, Edit2, Trash2, LogOut, Shield, Users, FileText, Calendar, Gift } from 'lucide-react';"
);

const target = `        <button 
          onClick={() => { setAppView('schedule'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'schedule' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Calendar size={18} />
          <span className="font-medium">График выходных</span>
        </button>`;

const replacement = `        <button 
          onClick={() => { setAppView('schedule'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'schedule' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Calendar size={18} />
          <span className="font-medium">График выходных</span>
        </button>
        <button 
          onClick={() => { setAppView('bonuses'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'bonuses' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Gift size={18} />
          <span className="font-medium">Бонусы</span>
        </button>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/Sidebar.tsx', code);
