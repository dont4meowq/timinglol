import React, { useState } from 'react';
import { useStore } from '../store';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { logOut } from '../firebase';
import { Folder, FolderOpen, Plus, MoreHorizontal, Edit2, Trash2, LogOut, Shield, Users, FileText, Calendar, Gift, Dices } from 'lucide-react';

export function Sidebar() {
  const { 
    sections, activeSectionId, activeNoteId, 
    setActiveSection, setActiveNote, addSection, 
    reorderSections, updateSection, deleteSection, 
    toggleSectionCollapse, setSidebarOpen, 
    updateNote, deleteNote, moveNoteToSection,
    currentUser, setAppView, models, appView
  } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editNoteTitle, setEditNoteTitle] = useState('');
  const [noteMenuOpenId, setNoteMenuOpenId] = useState<{noteId: string, sectionId: string} | null>(null);
  const [noteMenuPos, setNoteMenuPos] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const closeMenu = () => {
      setMenuOpenId(null);
      setNoteMenuOpenId(null);
    };
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over.id);
      reorderSections(oldIndex, newIndex);
    }
  };

  const handleAdd = () => {
    const id = crypto.randomUUID();
    addSection(id, 'Новый раздел', currentUser?.role === 'admin' ? 'Shared' : (currentUser?.assignedModel || 'Shared'));
    setEditingId(id);
    setEditTitle('Новый раздел');
  };

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
    setMenuOpenId(null);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateSection(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleEditNote = (noteId: string, currentTitle: string) => {
    setEditingNoteId(noteId);
    setEditNoteTitle(currentTitle);
    setNoteMenuOpenId(null);
  };

  const handleSaveNoteEdit = (sectionId: string) => {
    if (editingNoteId && editNoteTitle.trim()) {
      updateNote(sectionId, editingNoteId, { title: editNoteTitle.trim() });
    }
    setEditingNoteId(null);
  };

  const filteredSections = sections; // search is handled globally if needed, but for now show all

  return (
    <div className="w-64 bg-[#181818] h-full flex flex-col border-r border-neutral-800 text-neutral-300">
      
      <div className="p-2 border-b border-neutral-800 space-y-1 shrink-0">
        <button 
          onClick={() => { setAppView('crm'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${appView === 'crm' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}`}
        >
          <Users size={18} />
          <span className="font-medium">Заметки о фанатах</span>
        </button>
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
          onClick={() => { setAppView('dashboard'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${appView === 'dashboard' ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#2a2d2e]'}`}
        >
          <FileText size={18} />
          <span className="font-medium">Пасты</span>
        </button>
      </div>

      {appView === 'dashboard' ? (
        <>
          <div className="p-4 flex items-center justify-between shrink-0">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-neutral-400">Категории паст</h2>
            <button onClick={handleAdd} className="p-1 hover:bg-neutral-700 rounded-md transition-colors text-neutral-400 hover:text-white" title="Новый раздел">
              <Plus size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 custom-scrollbar">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredSections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {filteredSections.map((section) => (
                  <SortableItem key={section.id} id={section.id}>
                    <div 
                      className={`group relative flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${activeSectionId === section.id && appView === 'dashboard' ? 'bg-[#2a2d2e] text-white' : 'hover:bg-[#2a2d2e]'}`}
                      onClick={() => { setActiveSection(section.id); setAppView('dashboard'); setSidebarOpen(false); }}
                    >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSectionCollapse(section.id); }}
                      className="text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                      {section.collapsed ? <Folder size={16} /> : <FolderOpen size={16} />}
                    </button>
                    {editingId === section.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="bg-neutral-800 text-sm px-1 py-0.5 rounded outline-none border border-blue-500 flex-1 min-w-0"
                        autoFocus
                      />
                    ) : (
                      <span className="truncate text-sm">{section.title}</span>
                    )}
                  </div>

                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === section.id ? null : section.id);
                      }}
                      className="p-1 hover:bg-neutral-600 rounded"
                    >
                      <MoreHorizontal size={14} />
                    </button>

                    {menuOpenId === section.id && (
                      <div className="absolute right-2 top-8 w-32 bg-neutral-800 border border-neutral-700 rounded shadow-xl z-50 py-1" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleEdit(section.id, section.title)} className="w-full text-left px-3 py-1.5 text-sm hover:bg-neutral-700 flex items-center gap-2">
                          <Edit2 size={14} /> Переименовать
                        </button>
                        <button onClick={() => { deleteSection(section.id); setMenuOpenId(null); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-900/30 text-red-400 flex items-center gap-2">
                          <Trash2 size={14} /> Удалить
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Render notes under section if not collapsed */}
                {!section.collapsed && section.notes.length > 0 && (
                  <div className="mt-1 mb-2 ml-4 border-l border-neutral-800 pl-2 space-y-1">
                    {section.notes.map(note => (
                      <div 
                        key={note.id}
                        onClick={(e) => { e.stopPropagation(); setActiveSection(section.id); setActiveNote(note.id); setAppView('dashboard'); setSidebarOpen(false); }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNoteMenuPos({ x: e.clientX, y: e.clientY });
                          setNoteMenuOpenId({ noteId: note.id, sectionId: section.id });
                        }}
                        className={`px-2 py-1 text-sm rounded cursor-pointer transition-colors ${activeNoteId === note.id && activeSectionId === section.id && appView === 'dashboard' ? 'bg-[#2a2d2e] text-blue-400' : 'text-neutral-400 hover:bg-[#2a2d2e] hover:text-neutral-200'} flex items-center min-w-0`}
                      >
                        {editingNoteId === note.id ? (
                          <input
                            type="text"
                            value={editNoteTitle}
                            onChange={(e) => setEditNoteTitle(e.target.value)}
                            onBlur={() => handleSaveNoteEdit(section.id)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveNoteEdit(section.id)}
                            className="bg-neutral-800 text-sm px-1 py-0.5 rounded outline-none border border-blue-500 flex-1 min-w-0"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate">{note.title}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
      </>
      ) : appView === 'crm' ? (
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
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${useStore.getState().activeModel === model ? 'bg-[#2a2d2e] text-white' : 'text-neutral-400 hover:bg-[#2a2d2e] hover:text-neutral-200'}`}
              >
                {model}
              </button>
            ))}
          </div>
        </>
      ) : null}

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

      {noteMenuOpenId && (
        <div 
          className="fixed bg-[#252526] border border-neutral-700 rounded shadow-2xl z-50 py-1 w-48 overflow-visible"
          style={{ top: noteMenuPos.y, left: noteMenuPos.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
            onClick={() => {
              const note = sections.find(s => s.id === noteMenuOpenId.sectionId)?.notes.find(n => n.id === noteMenuOpenId.noteId);
              if (note) handleEditNote(note.id, note.title);
            }}
          >
            <Edit2 size={14} /> Переименовать
          </button>
          
          {sections.length > 1 && (
            <div className="group relative">
              <button className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-between">
                <span>Переместить в...</span>
                <span>›</span>
              </button>
              <div className="absolute left-full top-0 pl-1 hidden group-hover:block z-50">
                <div className="bg-[#252526] border border-neutral-700 rounded shadow-2xl w-48 py-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {sections.filter(s => s.id !== noteMenuOpenId.sectionId).map(s => (
                    <button
                      key={s.id}
                      className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors truncate"
                      onClick={() => {
                        moveNoteToSection(noteMenuOpenId.noteId, noteMenuOpenId.sectionId, s.id);
                        setNoteMenuOpenId(null);
                      }}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="h-px bg-neutral-700 my-1"></div>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
            onClick={() => {
              deleteNote(noteMenuOpenId.sectionId, noteMenuOpenId.noteId);
              setNoteMenuOpenId(null);
            }}
          >
            <Trash2 size={14} /> Удалить
          </button>
        </div>
      )}
    </div>
  );
}
