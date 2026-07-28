const fs = require('fs');
const content = `import React from 'react';
import { useStore } from '../store';
import { logOut } from '../firebase';
import { Users, Calendar, Gift, Dices, BookOpen, Camera, Trophy, Shield, LogOut } from 'lucide-react';

export function Sidebar() {
  const { 
    currentUser, setAppView, models, appView, setSidebarOpen
  } = useStore();

  return (
    <div className="w-64 bg-[#181818] h-full flex flex-col border-r border-neutral-800 text-neutral-300">
      
      <div className="p-2 border-b border-neutral-800 space-y-1 shrink-0">
        <button 
          onClick={() => { setAppView('crm'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'crm' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Users size={18} />
          <span className="font-medium">Заметки о фанатах</span>
        </button>
        <button 
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
        </button>
        <button 
          onClick={() => { setAppView('roulette'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'roulette' ? 'bg-pink-600/20 text-pink-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Dices size={18} />
          <span className="font-medium">Рулетка</span>
        </button>
        <button 
          onClick={() => { setAppView('guides'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'guides' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <BookOpen size={18} />
          <span className="font-medium">Гайды и Инструкции</span>
        </button>
        <button 
          onClick={() => { setAppView('contests'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'contests' ? 'bg-yellow-600/20 text-yellow-500' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Trophy size={18} />
          <span className="font-medium">Конкурсы</span>
        </button>
        <button 
          onClick={() => { setAppView('customs'); setSidebarOpen(false); }}
          className={\`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors \${appView === 'customs' ? 'bg-emerald-600/20 text-emerald-400' : 'hover:bg-[#2a2d2e]'}\`}
        >
          <Camera size={18} />
          <span className="font-medium">Заказ кастомов</span>
        </button>
      </div>

      {appView === 'crm' ? (
        <>
          <div className="p-4 flex items-center justify-between shrink-0">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-neutral-400">Модели</h2>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 custom-scrollbar">
            {models.map(m => m.name).filter(m => currentUser?.role === 'admin' || m === currentUser?.assignedModel).map(model => (
              <button
                key={model}
                onClick={() => {
                  useStore.getState().setActiveModel(model);
                  setSidebarOpen(false);
                }}
                className={\`w-full text-left px-3 py-2 text-sm rounded-md transition-colors \${useStore.getState().activeModel === model ? 'bg-[#2a2d2e] text-white' : 'text-neutral-400 hover:bg-[#2a2d2e] hover:text-neutral-200'}\`}
              >
                {model}
              </button>
            ))}
          </div>
        </>
      ) : <div className="flex-1" />}

      <div className="p-4 border-t border-neutral-800 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div className={\`p-1.5 rounded bg-neutral-800 shrink-0 \${currentUser?.role === 'admin' ? 'text-purple-400' : 'text-neutral-400'}\`}>
            {currentUser?.role === 'admin' ? <Shield size={16} /> : <div className="w-4 h-4 bg-neutral-600 rounded-full" />}
          </div>
          <div className="truncate text-sm font-medium text-white pr-2">
            {currentUser?.name}
          </div>
        </div>
        
        <div className="flex items-center gap-1 shrink-0">
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setAppView('admin')}
              className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
              title="Панель администратора"
            >
              <Shield size={16} />
            </button>
          )}
          <button 
            onClick={logOut}
            className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
            title="Выйти"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/Sidebar.tsx', content);
