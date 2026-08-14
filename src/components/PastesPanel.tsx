import React, { useState } from 'react';
import { useStore } from '../store';
import { ClipboardList, Plus, Search, Trash2, Edit2, Copy, Check } from 'lucide-react';


export function PastesPanel() {
  const { pastes, addPaste, updatePaste, deletePaste, currentUser } = useStore();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPastes = React.useMemo(() => {
    const s = search.toLowerCase();
    return pastes.filter(p => 
      p.title.toLowerCase().includes(s) || 
      p.content.toLowerCase().includes(s)
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [pastes, search]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    if (editingId) {
      updatePaste(editingId, { title, content });
    } else {
      addPaste({ title, content, authorId: currentUser?.id || '' });
    }
    setTitle('');
    setContent('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (p: any) => {
    setTitle(p.title);
    setContent(p.content);
    setEditingId(p.id);
    setIsAdding(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e]">
      <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-[#1e1e1e]">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <ClipboardList className="text-blue-400" />
            Пасты
          </h1>
          <p className="text-neutral-400 text-sm">Быстрые ответы и шаблоны для чаттеров</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setTitle(''); setContent(''); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Добавить пасту
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        {isAdding && (
          <div className="bg-[#252526] p-6 rounded-xl border border-neutral-700 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">{editingId ? 'Редактировать пасту' : 'Новая паста'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Название / Тема</label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                  placeholder="Например: Приветствие для новых"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Текст пасты</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full h-32 bg-[#1e1e1e] border border-neutral-700 text-white rounded-lg px-4 py-2 outline-none focus:border-blue-500 custom-scrollbar resize-y"
                  placeholder="Текст шаблона..."
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button 
                  onClick={() => { setIsAdding(false); setEditingId(null); setTitle(''); setContent(''); }}
                  className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                >
                  Отмена
                </button>
                <button 
                  onClick={handleSave}
                  disabled={!title.trim() || !content.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по пастам..."
            className="w-full bg-[#252526] border border-neutral-700 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPastes.map(p => (
            <div key={p.id} className="bg-[#252526] border border-neutral-700 rounded-xl overflow-hidden flex flex-col group hover:border-neutral-600 transition-colors">
              <div className="p-4 border-b border-neutral-800 flex justify-between items-start bg-[#2a2d2e]/50">
                <h3 className="font-semibold text-white truncate pr-2">{p.title}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button 
                    onClick={() => handleCopy(p.id, p.content)}
                    className="p-1.5 text-neutral-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Скопировать"
                  >
                    {copiedId === p.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                  <button 
                    onClick={() => handleEdit(p)}
                    className="p-1.5 text-neutral-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => deletePaste(p.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1">
                <p className="text-neutral-300 text-sm whitespace-pre-wrap font-mono break-words">
                  {p.content}
                </p>
              </div>
            </div>
          ))}
          
          {filteredPastes.length === 0 && !isAdding && (
            <div className="col-span-full text-center py-12 text-neutral-500 border border-neutral-800 border-dashed rounded-xl">
              <ClipboardList size={48} className="mx-auto mb-3 opacity-50" />
              <p>Пасты не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
