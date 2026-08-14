import React from 'react';
import { useStore } from '../store';
import { logOut } from '../firebase';
import { Calendar, Gift, Dices, BookOpen, Camera, Trophy, Shield, LogOut, ClipboardList } from 'lucide-react';

export function Sidebar() {
  const { 
    currentUser, setAppView, appView, setSidebarOpen
  } = useStore();

  return (
    <div className="w-64 bg-[#181818] h-full flex flex-col border-r border-neutral-800 text-neutral-300">
      
      <div className="p-2 border-b border-neutral-800 space-y-1 shrink-0">
        <button 
          onClick={() => { setAppView('schedule'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${appView === 'schedule' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}`}
        >
          <Calendar size={18} />
          <span className="font-medium">График выходных</span>
        </button>
        <button 
          onClick={() => { setAppView('bonuses'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${appView === 'bonuses' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}`}
        >
          <Gift size={18} />
          <span className="font-medium">Бонусы</span>
        </button>
        <button 
          onClick={() => { setAppView('roulette'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${appView === 'roulette' ? 'bg-pink-600/20 text-pink-400' : 'hover:bg-[#2a2d2e]'}`}
        >
          <Dices size={18} />
          <span className="font-medium">Рулетка</span>
        </button>
        <button 
          onClick={() => { setAppView('guides'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${appView === 'guides' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}`}
        >
          <BookOpen size={18} />
          <span className="font-medium">Гайды</span>
        </button>
        
        <button 
          onClick={() => { setAppView('pastes'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${appView === 'pastes' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}`}
        >
          <ClipboardList size={18} />
          <span className="font-medium">Пасты</span>
        </button>
        <button 
          onClick={() => { setAppView('contests'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${appView === 'contests' ? 'bg-yellow-600/20 text-yellow-500' : 'hover:bg-[#2a2d2e]'}`}
        >
          <Trophy size={18} />
          <span className="font-medium">Конкурсы</span>
        </button>
        <button 
          onClick={() => { setAppView('customs'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${appView === 'customs' ? 'bg-emerald-600/20 text-emerald-400' : 'hover:bg-[#2a2d2e]'}`}
        >
          <Camera size={18} />
          <span className="font-medium">Кастомы</span>
        </button>
      </div>

      <div className="flex-1" />

      <div className="p-4 border-t border-neutral-800 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div className={`p-1.5 rounded bg-neutral-800 shrink-0 ${currentUser?.role === 'admin' ? 'text-purple-400' : 'text-neutral-400'}`}>
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
