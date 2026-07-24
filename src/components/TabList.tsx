import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus, X, Pin, Menu } from 'lucide-react';

export function TabList() {
  const { sections, activeSectionId, activeNoteId, setActiveNote, addNote, updateNote, deleteNote, reorderNotes, togglePinNote, setSidebarOpen } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const activeSection = sections.find(s => s.id === activeSectionId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const closeMenu = () => setMenuOpenId(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  if (!activeSection) {
    return (
      <div className="flex items-center h-10 bg-[#1e1e1e] border-b border-neutral-800 px-4 md:hidden">
        <button onClick={() => setSidebarOpen(true)} className="text-neutral-400 hover:text-white">
          <Menu size={20} />
        </button>
      </div>
    );
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = activeSection.notes.findIndex((n) => n.id === active.id);
      const newIndex = activeSection.notes.findIndex((n) => n.id === over.id);
      reorderNotes(activeSection.id, oldIndex, newIndex);
    }
  };

  const handleAdd = () => {
    addNote(activeSection.id, 'Новая вкладка');
  };

  const handleEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateNote(activeSection.id, editingId, { title: editTitle.trim() });
    }
    setEditingId(null);
  };

  const pinnedNotes = activeSection.notes.filter(n => n.pinned);
  const unpinnedNotes = activeSection.notes.filter(n => !n.pinned);

  // We only make unpinned notes sortable for simplicity, pinned tabs stick to left.
  return (
    <div className="flex bg-[#1e1e1e] border-b border-neutral-800 overflow-x-auto custom-scrollbar min-h-[40px]">
      <button 
        onClick={() => setSidebarOpen(true)} 
        className="md:hidden px-3 text-neutral-400 hover:text-white border-r border-neutral-800"
      >
        <Menu size={18} />
      </button>
      <div className="flex items-center">
        {pinnedNotes.map(note => (
          <div 
            key={note.id}
            onClick={() => setActiveNote(note.id)}
            onDoubleClick={() => handleEdit(note.id, note.title)}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenuPos({ x: e.clientX, y: e.clientY });
              setMenuOpenId(note.id);
            }}
            className={`group flex items-center gap-2 px-4 py-2 border-r border-neutral-800 cursor-pointer text-sm whitespace-nowrap min-w-[120px] max-w-[200px] ${activeNoteId === note.id ? 'bg-[#252526] text-blue-400 border-t-2 border-t-blue-500' : 'text-neutral-400 hover:bg-[#2a2d2e] border-t-2 border-t-transparent'}`}
          >
            <Pin size={12} className="text-blue-500 flex-shrink-0" />
            {editingId === note.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                className="bg-neutral-800 text-sm px-1 py-0 rounded outline-none w-full"
                autoFocus
              />
            ) : (
              <span className="truncate flex-1 select-none">{note.title}</span>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); togglePinNote(activeSection.id, note.id); }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-neutral-600 rounded transition-opacity ml-1"
            >
              <X size={14} className="opacity-0" /> {/* Just spacing or we can put unpin icon */}
            </button>
          </div>
        ))}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={unpinnedNotes.map(n => n.id)} strategy={horizontalListSortingStrategy}>
          <div className="flex items-center">
            {unpinnedNotes.map(note => (
              <SortableItem key={note.id} id={note.id} className="flex-shrink-0">
                <div 
                  onClick={() => setActiveNote(note.id)}
                  onDoubleClick={() => handleEdit(note.id, note.title)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setMenuPos({ x: e.clientX, y: e.clientY });
                    setMenuOpenId(note.id);
                  }}
                  className={`group flex items-center gap-2 px-3 py-2 border-r border-neutral-800 cursor-pointer text-sm whitespace-nowrap min-w-[120px] max-w-[200px] ${activeNoteId === note.id ? 'bg-[#1e1e1e] text-neutral-100 border-t-2 border-t-blue-500' : 'bg-[#2d2d2d] text-neutral-400 hover:bg-[#2a2d2e] border-t-2 border-t-transparent'}`}
                >
                  {editingId === note.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                      className="bg-neutral-700 text-sm px-1 py-0 rounded outline-none w-full"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate flex-1 select-none">{note.title}</span>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNote(activeSection.id, note.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-neutral-600 rounded transition-opacity ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button 
        onClick={handleAdd}
        className="px-3 py-2 text-neutral-400 hover:text-white hover:bg-[#2a2d2e] flex-shrink-0 transition-colors flex items-center"
        title="Новая вкладка"
      >
        <Plus size={16} />
      </button>

      {menuOpenId && (
        <div 
          className="fixed bg-[#252526] border border-neutral-700 rounded shadow-2xl z-50 py-1 w-48 overflow-hidden"
          style={{ top: menuPos.y, left: menuPos.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
            onClick={() => {
              togglePinNote(activeSection.id, menuOpenId);
              setMenuOpenId(null);
            }}
          >
            {activeSection.notes.find(n => n.id === menuOpenId)?.pinned ? 'Открепить' : 'Закрепить'} вкладку
          </button>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-blue-600 hover:text-white transition-colors"
            onClick={() => {
              const note = activeSection.notes.find(n => n.id === menuOpenId);
              if (note) handleEdit(note.id, note.title);
              setMenuOpenId(null);
            }}
          >
            Переименовать
          </button>
          <div className="h-px bg-neutral-700 my-1"></div>
          <button 
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors"
            onClick={() => {
              deleteNote(activeSection.id, menuOpenId);
              setMenuOpenId(null);
            }}
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}
