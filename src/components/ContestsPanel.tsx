import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Plus, Edit2, Trash2, Heart, MessageSquare, Send, X, Image as ImageIcon, Search } from 'lucide-react';
import { ContestPost } from "./ContestPost";
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export function ContestsPanel() {
  const { contests, currentUser, addContest, updateContest, deleteContest, toggleContestLike } = useStore();
  const isAdmin = currentUser?.role === 'admin';
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContests = contests.filter(contest => {
    const query = searchQuery.toLowerCase();
    return contest.title.toLowerCase().includes(query) || contest.content.toLowerCase().includes(query);
  });

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    if (editId) {
      updateContest(editId, { title, content });
    } else {
      addContest({
        title,
        content,
        authorId: currentUser!.id,
        authorName: currentUser!.name,
      });
    }
    setIsEditing(false);
    setEditId(null);
    setTitle('');
    setContent('');
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    let imagePasted = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        imagePasted = true;
        const file = items[i].getAsFile();
        if (!file) continue;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            
            document.execCommand('insertImage', false, dataUrl);
            if (editorRef.current) setContent(editorRef.current.innerHTML);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
    // If it's just text, let it paste naturally
  };

  const editorRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [editId]);

  const startEdit = (contest: any) => {
    setEditId(contest.id);
    setTitle(contest.title);
    setContent(contest.content);
    setIsEditing(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Конкурсы</h1>
            {isAdmin && !isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Plus size={18} />
                <span>Добавить конкурс</span>
              </button>
            )}
          </div>

          {!isEditing && (
            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-neutral-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Поиск по конкурсам..."
                className="w-full bg-[#252526] border border-neutral-700 text-white rounded-lg pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition-colors placeholder:text-neutral-500"
              />
            </div>
          )}

          {isEditing && (
            <div className="bg-[#252526] border border-neutral-700 rounded-xl p-6 shadow-xl mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{editId ? 'Редактировать конкурс' : 'Новый конкурс'}</h2>
                <button onClick={() => { setIsEditing(false); setEditId(null); setTitle(''); setContent(''); }} className="text-neutral-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Заголовок..."
                className="w-full bg-transparent border-b border-neutral-700 pb-2 text-2xl font-bold text-white outline-none mb-4 focus:border-blue-500 transition-colors"
              />
              <div className="bg-neutral-900/50 rounded-lg border border-neutral-700 p-2 mb-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 mb-2 text-neutral-400">
                  <button className="p-1 hover:text-white hover:bg-neutral-800 rounded flex gap-2 items-center text-sm px-2" onClick={() => {
                    const url = prompt("Введите URL картинки:");
                    if (url) {
                      document.execCommand('insertImage', false, url);
                      if (editorRef.current) setContent(editorRef.current.innerHTML);
                    }
                  }}>
                    <ImageIcon size={16} /> Картинка
                  </button>
                  <span className="text-xs text-neutral-500 ml-auto">Редактор с поддержкой картинок</span>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={e => setContent(e.currentTarget.innerHTML)}
                  onPaste={handlePaste}
                  data-placeholder="Описание конкурса... Можно вставлять картинки (Ctrl+V)."
                  className="w-full min-h-[16rem] bg-transparent outline-none text-neutral-200 custom-scrollbar overflow-y-auto prose prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-500 cursor-text"
                />
              </div>
              <div className="flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={!title.trim() || !content.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium transition-colors"
                >
                  Опубликовать
                </button>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {filteredContests.length === 0 ? (
              <div className="text-center text-neutral-500 py-12">
                {searchQuery ? 'Конкурсы не найдены по вашему запросу.' : `Конкурсов пока нет. ${isAdmin ? 'Напишите первый!' : ''}`}
              </div>
            ) : (
              filteredContests.map(contest => (
                <ContestPost key={contest.id} contest={contest} isAdmin={isAdmin} onEdit={() => startEdit(contest)} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
