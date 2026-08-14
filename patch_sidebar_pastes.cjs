const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!code.includes('ClipboardList')) {
  code = code.replace("LogOut } from 'lucide-react';", "LogOut, ClipboardList } from 'lucide-react';");
}

if (!code.includes("setAppView('pastes')")) {
  const pastesBtn = `
        <button 
          onClick={() => { setAppView('pastes'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'pastes' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <ClipboardList size={18} />
          <span className="font-medium">Пасты</span>
        </button>
        <button 
          onClick={() => { setAppView('contests'); setSidebarOpen(false); }}`;
          
  code = code.replace(/<button\s+onClick=\{\(\) => \{ setAppView\('contests'\); setSidebarOpen\(false\); \}\}/, pastesBtn);
  fs.writeFileSync('src/components/Sidebar.tsx', code);
  console.log("Patched sidebar!");
} else {
  console.log("Already patched.");
}
