import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store';

export function Editor() {
  const { sections, activeSectionId, activeNoteId, updateNote } = useStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeSection = sections.find(s => s.id === activeSectionId);
  const activeNote = activeSection?.notes.find(n => n.id === activeNoteId);

  const [localContent, setLocalContent] = useState('');

  // Sync local state when active note changes
  useEffect(() => {
    if (activeNote) {
      setLocalContent(activeNote.content);
    } else {
      setLocalContent('');
    }
  }, [activeNote?.id]);

  // Debounced save
  useEffect(() => {
    if (!activeNote || !activeSection) return;
    
    if (localContent !== activeNote.content) {
      const timeout = setTimeout(() => {
        updateNote(activeSection.id, activeNote.id, { content: localContent });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [localContent, activeNote?.content, activeSection?.id, activeNote?.id, updateNote]);


  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500 bg-[#1e1e1e]">
        <div className="text-center">
          <p className="text-lg mb-2">Выберите вкладку или создайте новую</p>
          <p className="text-sm">Ctrl+N — новая вкладка</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] relative overflow-hidden">
      <textarea
        ref={textareaRef}
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        placeholder="Начните писать здесь..."
        className="flex-1 w-full p-8 bg-transparent text-neutral-200 resize-none outline-none text-base leading-relaxed custom-scrollbar font-sans"
        spellCheck={false}
      />
      <div className="absolute bottom-2 right-4 text-xs text-neutral-600 pointer-events-none">
        {localContent.length} символов | {localContent.split(/\s+/).filter(Boolean).length} слов
      </div>
    </div>
  );
}
