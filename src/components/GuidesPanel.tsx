import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Plus, Edit2, Trash2, Heart, MessageSquare, Send, X, Image as ImageIcon, Search, Folder, FolderOpen, ChevronRight, ChevronDown, MoreVertical } from 'lucide-react';
import { GuidePost } from "./GuidePost";
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { GuideFolder } from '../types';

export function GuidesPanel() {
  const { guides, guideFolders, currentUser, addGuide, updateGuide, deleteGuide, addGuideFolder, updateGuideFolder, deleteGuideFolder } = useStore();
  const isAdmin = currentUser?.role === 'admin';

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [activeSubFolderId, setActiveSubFolderId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [isCreatingSubFolder, setIsCreatingSubFolder] = useState<string | null>(null);
  const [newSubFolderName, setNewSubFolderName] = useState('');
  
  const [guideFolderId, setGuideFolderId] = useState<string>('');
  const [guideSubFolderId, setGuideSubFolderId] = useState<string>('');
  
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [subFolderToDelete, setSubFolderToDelete] = useState<{folderId: string, subFolderId: string} | null>(null);

  const filteredGuides = guides.filter(guide => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = guide.title.toLowerCase().includes(q) || guide.content.toLowerCase().includes(q);
    const matchesFolder = activeFolderId ? guide.blockId === activeFolderId : true;
    const matchesSubFolder = activeSubFolderId ? guide.subBlockId === activeSubFolderId : true;
    return matchesSearch && matchesFolder && matchesSubFolder;
  });

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    if (editId) {
      updateGuide(editId, { 
        title, 
        content,
        blockId: guideFolderId || null,
        subBlockId: guideSubFolderId || null
      });
    } else {
      addGuide({
        title,
        content,
        authorId: currentUser!.id,
        authorName: currentUser!.name,
        blockId: guideFolderId || null,
        subBlockId: guideSubFolderId || null
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
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
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

            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            
            document.execCommand('insertImage', false, dataUrl);
            if (editorRef.current) setContent(editorRef.current.innerHTML);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const editorRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [editId]);

  const startEdit = (guide: any) => {
    setEditId(guide.id);
    setTitle(guide.title);
    setContent(guide.content);
    setGuideFolderId(guide.blockId || '');
    setGuideSubFolderId(guide.subBlockId || '');
    setIsEditing(true);
  };
  
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    addGuideFolder({ name: newFolderName, subFolders: [] });
    setNewFolderName('');
    setIsCreatingFolder(false);
  };
  
  const handleCreateSubFolder = (folderId: string) => {
    if (!newSubFolderName.trim()) return;
    const folder = guideFolders.find(f => f.id === folderId);
    if (folder) {
      const newSubFolders = [...folder.subFolders, { id: crypto.randomUUID(), name: newSubFolderName }];
      updateGuideFolder(folderId, { subFolders: newSubFolders });
    }
    setNewSubFolderName('');
    setIsCreatingSubFolder(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolderToDelete(folderId);
  };

  const handleDeleteSubFolder = (folderId: string, subFolderId: string) => {
    setSubFolderToDelete({ folderId, subFolderId });
  };

  return (
    <div className="flex flex-1 h-full bg-[#1e1e1e] overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 border-r border-neutral-700 bg-[#252526] flex flex-col h-full">
        <div className="p-4 border-b border-neutral-700 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-white uppercase tracking-wider text-sm">Навигация</h2>
          {isAdmin && (
            <button onClick={() => setIsCreatingFolder(true)} className="text-neutral-400 hover:text-white" title="Добавить блок">
              <Plus size={16} />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          <button 
            onClick={() => { setActiveFolderId(null); setActiveSubFolderId(null); }}
            className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 text-sm transition-colors ${!activeFolderId ? 'bg-blue-600/20 text-blue-400' : 'text-neutral-300 hover:bg-neutral-800'}`}
          >
            <Folder size={16} className={!activeFolderId ? "text-blue-400" : "text-neutral-500"} /> Все гайды
          </button>
          
          {isCreatingFolder && (
            <div className="mt-2 px-2 flex items-center gap-2">
              <input 
                type="text" 
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Имя блока..."
                className="w-full bg-[#1e1e1e] border border-neutral-700 rounded px-2 py-1 text-sm text-white outline-none focus:border-blue-500"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
              />
              <button onClick={() => setIsCreatingFolder(false)} className="text-neutral-400 hover:text-white"><X size={14} /></button>
            </div>
          )}
          
          <div className="mt-4 space-y-1">
            {guideFolders.map(folder => (
              <div key={folder.id}>
                <div className={`group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${activeFolderId === folder.id && !activeSubFolderId ? 'bg-neutral-800 text-white' : 'text-neutral-300 hover:bg-neutral-800/50'}`}>
                  <div 
                    className="flex items-center gap-2 flex-1 min-w-0"
                    onClick={() => {
                      setActiveFolderId(folder.id);
                      setActiveSubFolderId(null);
                      setExpandedFolders(prev => ({ ...prev, [folder.id]: !prev[folder.id] }));
                    }}
                  >
                    {expandedFolders[folder.id] ? <ChevronDown size={14} className="text-neutral-500 shrink-0" /> : <ChevronRight size={14} className="text-neutral-500 shrink-0" />}
                    <FolderOpen size={14} className={activeFolderId === folder.id ? "text-blue-400" : "text-neutral-500"} />
                    <span className="truncate text-sm select-none">{folder.name}</span>
                  </div>
                  
                  {isAdmin && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); setIsCreatingSubFolder(folder.id); }} className="p-1 text-neutral-400 hover:text-blue-400" title="Добавить подблок"><Plus size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }} className="p-1 text-neutral-400 hover:text-red-400" title="Удалить блок"><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
                
                {expandedFolders[folder.id] && (
                  <div className="ml-6 mt-1 space-y-1">
                    {folder.subFolders.map(sub => (
                      <div 
                        key={sub.id}
                        onClick={() => { setActiveFolderId(folder.id); setActiveSubFolderId(sub.id); }}
                        className={`group flex items-center justify-between px-3 py-1.5 rounded cursor-pointer text-sm transition-colors ${activeSubFolderId === sub.id ? 'bg-blue-600/20 text-blue-400' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'}`}
                      >
                        <span className="truncate">{sub.name}</span>
                        {isAdmin && (
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteSubFolder(folder.id, sub.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400"><Trash2 size={12} /></button>
                        )}
                      </div>
                    ))}
                    
                    {isCreatingSubFolder === folder.id && (
                      <div className="px-2 py-1 flex items-center gap-2">
                        <input 
                          type="text" 
                          value={newSubFolderName}
                          onChange={e => setNewSubFolderName(e.target.value)}
                          placeholder="Имя подблока..."
                          className="w-full bg-[#1e1e1e] border border-neutral-700 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && handleCreateSubFolder(folder.id)}
                        />
                        <button onClick={() => setIsCreatingSubFolder(null)} className="text-neutral-400 hover:text-white"><X size={12} /></button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight">Гайды</h1>
            {isAdmin && !isEditing && (
              <button 
                onClick={() => {
                  setGuideFolderId(activeFolderId || '');
                  setGuideSubFolderId(activeSubFolderId || '');
                  setIsEditing(true);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <Plus size={18} />
                <span>Написать гайд</span>
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
                placeholder="Поиск по гайдам..."
                className="w-full bg-[#252526] border border-neutral-700 text-white rounded-lg pl-10 pr-4 py-3 outline-none focus:border-blue-500 transition-colors placeholder:text-neutral-500"
              />
            </div>
          )}

          {isEditing && (
            <div className="bg-[#252526] border border-neutral-700 rounded-xl p-6 shadow-xl mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{editId ? 'Редактировать гайд' : 'Новый гайд'}</h2>
                <button onClick={() => { setIsEditing(false); setEditId(null); setTitle(''); setContent(''); }} className="text-neutral-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Блок</label>
                  <select 
                    value={guideFolderId} 
                    onChange={e => {
                      setGuideFolderId(e.target.value);
                      setGuideSubFolderId('');
                    }}
                    className="w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Без блока</option>
                    {guideFolders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Подблок</label>
                  <select 
                    value={guideSubFolderId} 
                    onChange={e => setGuideSubFolderId(e.target.value)}
                    disabled={!guideFolderId}
                    className="w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="">Без подблока</option>
                    {guideFolderId && guideFolders.find(f => f.id === guideFolderId)?.subFolders.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
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
                  data-placeholder="Содержание гайда... Можно вставлять картинки (Ctrl+V)."
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
            {filteredGuides.length === 0 ? (
              <div className="text-center text-neutral-500 py-12">
                {searchQuery ? 'Гайды не найдены по вашему запросу.' : `Гайдов в этом разделе пока нет. ${isAdmin ? 'Напишите первый!' : ''}`}
              </div>
            ) : (
              filteredGuides.map(guide => (
                <GuidePost key={guide.id} guide={guide} isAdmin={isAdmin} onEdit={() => startEdit(guide)} />
              ))
            )}
          </div>
        </div>
      </div>

      {folderToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#252526] rounded-xl shadow-xl border border-neutral-700 w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Подтверждение</h2>
              <p className="text-neutral-300">Вы уверены, что хотите удалить этот блок? Гайды останутся, но без привязки к нему.</p>
            </div>
            <div className="p-4 border-t border-neutral-800 flex justify-end gap-3">
              <button 
                onClick={() => setFolderToDelete(null)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={() => {
                  deleteGuideFolder(folderToDelete);
                  if (activeFolderId === folderToDelete) {
                    setActiveFolderId(null);
                    setActiveSubFolderId(null);
                  }
                  setFolderToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {subFolderToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#252526] rounded-xl shadow-xl border border-neutral-700 w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Подтверждение</h2>
              <p className="text-neutral-300">Вы уверены, что хотите удалить этот подблок?</p>
            </div>
            <div className="p-4 border-t border-neutral-800 flex justify-end gap-3">
              <button 
                onClick={() => setSubFolderToDelete(null)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={() => {
                  const folder = guideFolders.find(f => f.id === subFolderToDelete.folderId);
                  if (folder) {
                    updateGuideFolder(subFolderToDelete.folderId, { subFolders: folder.subFolders.filter(s => s.id !== subFolderToDelete.subFolderId) });
                    if (activeSubFolderId === subFolderToDelete.subFolderId) {
                      setActiveSubFolderId(null);
                    }
                  }
                  setSubFolderToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

