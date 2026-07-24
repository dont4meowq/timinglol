import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TabList } from './components/TabList';
import { Editor } from './components/Editor';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { CrmPanel } from './components/CrmPanel';
import { SchedulePanel } from './components/SchedulePanel';
import { BonusesPanel } from './components/BonusesPanel';
import { RoulettePanel } from './components/RoulettePanel';
import { useStore } from './store';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { Search, Menu } from 'lucide-react';

export default function App() {
  const { loading } = useFirebaseSync();
  const { addNote, activeSectionId, addSection, activeNoteId, updateNote, sections, sidebarOpen, setSidebarOpen, currentUser, appView } = useStore();

  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { setActiveSection, setActiveNote } = useStore();

  useEffect(() => {
    if (!currentUser) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.shiftKey) {
        e.preventDefault();
        if (activeSectionId) {
          addNote(activeSectionId, 'Новая вкладка');
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const id = crypto.randomUUID();
        addSection(id, 'Новый раздел', currentUser?.role === 'admin' ? 'Shared' : (currentUser?.assignedModel || 'Shared'));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionId, addNote, addSection, currentUser]);

  const searchResults = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: any[] = [];
    
    sections.forEach(s => {
      if (s.title.toLowerCase().includes(q)) {
        results.push({ type: 'section', id: s.id, title: s.title });
      }
      s.notes.forEach(n => {
        if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
          results.push({ type: 'note', id: n.id, sectionId: s.id, title: n.title, contentSnippet: n.content.substring(0, 50) });
        }
      });
    });
    return results;
  };

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

      {appView === 'admin' ? (
        <AdminPanel />
      ) : appView === 'schedule' ? (
        <SchedulePanel />
      ) : appView === 'crm' ? (
        <CrmPanel />
      ) : appView === 'bonuses' ? (
        <BonusesPanel />
      ) : appView === 'roulette' ? (
        <RoulettePanel />
      ) : (
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <TabList />
          <Editor />
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[10vh] z-50 p-4" onClick={() => setSearchOpen(false)}>
          <div className="bg-[#252526] w-full max-w-2xl rounded-xl shadow-2xl border border-neutral-700 overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center px-4 py-3 border-b border-neutral-700">
              <Search size={20} className="text-neutral-400 mr-3" />
              <input 
                autoFocus
                type="text" 
                placeholder="Поиск по разделам, вкладкам и тексту..." 
                className="bg-transparent flex-1 outline-none text-lg text-white"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1">
              {searchQuery && searchResults().length === 0 ? (
                <div className="p-8 text-center text-neutral-500">Ничего не найдено</div>
              ) : (
                <div className="py-2">
                  {searchResults().map((res, i) => (
                    <div 
                      key={i} 
                      className="px-4 py-3 hover:bg-[#2a2d2e] cursor-pointer flex flex-col"
                      onClick={() => {
                        if (res.type === 'section') {
                          setActiveSection(res.id);
                        } else {
                          setActiveSection(res.sectionId);
                          setActiveNote(res.id);
                        }
                        setSearchOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400 uppercase tracking-wider">{res.type === 'section' ? 'Раздел' : 'Вкладка'}</span>
                        <span className="text-white font-medium">{res.title}</span>
                      </div>
                      {res.type === 'note' && (
                        <span className="text-sm text-neutral-500 mt-1 truncate">{res.contentSnippet}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-4 py-2 bg-[#1e1e1e] border-t border-neutral-800 text-xs text-neutral-500 flex justify-between">
              <span>Используйте <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-400">Esc</kbd> для закрытия</span>
              <span><kbd className="bg-neutral-800 px-1 py-0.5 rounded text-neutral-400">Ctrl/Cmd + F</kbd> для поиска</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
