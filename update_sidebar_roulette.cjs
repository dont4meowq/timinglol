const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!code.includes("Dices")) {
  code = code.replace("Gift } from 'lucide-react';", "Gift, Dices } from 'lucide-react';");
}

const target = `        <button 
          onClick={() => { setAppView('bonuses'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'bonuses' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Gift size={18} />
          <span className="font-medium">Бонусы</span>
        </button>`;

const replacement = `        <button 
          onClick={() => { setAppView('bonuses'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'bonuses' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Gift size={18} />
          <span className="font-medium">Бонусы</span>
        </button>
        <button 
          onClick={() => { setAppView('roulette'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'roulette' ? 'bg-pink-600/20 text-pink-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Dices size={18} />
          <span className="font-medium">Рулетка</span>
        </button>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/Sidebar.tsx', code);
