import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { SchedulePanel } from './components/SchedulePanel';
import { BonusesPanel } from './components/BonusesPanel';
import { RoulettePanel } from './components/RoulettePanel';
import { GuidesPanel } from './components/GuidesPanel';
import { ContestsPanel } from './components/ContestsPanel';
import { CustomsPanel } from './components/CustomsPanel';
import { useStore } from './store';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { Menu } from 'lucide-react';

export default function App() {
  const { loading } = useFirebaseSync();
  const { sidebarOpen, setSidebarOpen, currentUser, appView } = useStore();
  
  if (loading) {
    return <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4 text-white">Загрузка...</div>;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="flex h-screen w-full bg-[#1e1e1e] text-neutral-300 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`flex flex-col fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 w-full bg-[#1e1e1e]">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-neutral-800 bg-[#1e1e1e]">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-neutral-400">
            <Menu size={24} />
          </button>
        </div>

        {appView === 'admin' ? (
          <AdminPanel />
        ) : appView === 'schedule' ? (
          <SchedulePanel />
        ) : appView === 'bonuses' ? (
          <BonusesPanel />
        ) : appView === 'roulette' ? (
          <RoulettePanel />
        ) : appView === 'guides' ? (
          <GuidesPanel />
        ) : appView === 'contests' ? (
          <ContestsPanel />
        ) : appView === 'customs' ? (
          <CustomsPanel />
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-500">Выберите раздел в меню</div>
        )}
      </div>
    </div>
  );
}
