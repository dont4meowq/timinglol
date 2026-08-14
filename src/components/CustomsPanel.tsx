import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, Trash2, Edit2, Check, X, Link, Hash, MessageSquare } from 'lucide-react';
import { Custom } from '../types';

const statusColors = {
  pending: 'bg-neutral-500',
  done: 'bg-green-500',
  declined: 'bg-red-500'
};

const statusLabels = {
  pending: 'Ожидание',
  done: 'Сделано',
  declined: 'Отказано'
};

export function CustomsPanel() {
  const { customs, addCustom, updateCustom, deleteCustom, activeModel, currentUser, models } = useStore();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>(currentUser?.role === 'admin' ? 'all' : (currentUser?.assignedModel || activeModel));

  const formDefaultModel = currentUser?.role === 'admin' 
    ? (selectedModelFilter !== 'all' ? selectedModelFilter : '') 
    : (currentUser?.assignedModel || activeModel);

  const [form, setForm] = useState<Omit<Custom, 'id' | 'createdAt'>>({
    model: formDefaultModel,
    customNumber: '',
    fanLink: '',
    status: 'pending',
    statusComment: '',
    authorId: currentUser?.id || '',
    authorName: currentUser?.name || ''
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingCustom, setViewingCustom] = useState<Custom | null>(null);
  const displayedCustom = viewingCustom ? customs.find(c => c.id === viewingCustom.id) || viewingCustom : null;

  React.useEffect(() => {
    if (!isFormOpen) {
      setForm(prev => ({ ...prev, model: formDefaultModel }));
    }
  }, [formDefaultModel, isFormOpen]);

  const filteredCustoms = React.useMemo(() => {
    return customs.filter(c => {
      if (selectedModelFilter !== 'all' && c.model !== selectedModelFilter) return false;
      const s = search.toLowerCase();
      return (c.fanLink || '').toLowerCase().includes(s) || 
             (c.customNumber || '').toLowerCase().includes(s) ||
             (c.statusComment || '').toLowerCase().includes(s);
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [customs, selectedModelFilter, search]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCustom(editingId, form);
    } else {
      addCustom({ 
        ...form, 
        model: form.model,
        authorId: currentUser?.id || '',
        authorName: currentUser?.name || ''
      });
    }
    setIsFormOpen(false);
    setEditingId(null);
    setForm({ model: formDefaultModel, customNumber: '', fanLink: '', status: 'pending', statusComment: '', authorId: currentUser?.id || '', authorName: currentUser?.name || '' });
  };

  const handleEdit = (custom: Custom) => {
    setForm({
      model: custom.model,
      customNumber: custom.customNumber || '',
      fanLink: custom.fanLink || '',
      status: custom.status || 'pending',
      statusComment: custom.statusComment || '',
      authorId: custom.authorId || currentUser?.id || '',
      authorName: custom.authorName || currentUser?.name || ''
    });
    setEditingId(custom.id);
    setIsFormOpen(true);
  };

  const toggleStatus = (id: string, currentStatus: Custom['status']) => {
    if (currentUser?.role !== 'admin') return;
    const nextStatus = currentStatus === 'pending' ? 'done' : currentStatus === 'done' ? 'declined' : 'pending';
    updateCustom(id, { status: nextStatus });
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      <div className="p-4 border-b border-neutral-800 bg-[#252526] sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex gap-2 items-center flex-1 max-w-xl">
            {currentUser?.role === 'admin' ? (
              <select 
                value={selectedModelFilter} 
                onChange={e => setSelectedModelFilter(e.target.value)}
                className="bg-[#1e1e1e] border border-neutral-700 text-sm text-white rounded-md px-3 py-1.5 outline-none focus:border-blue-500 appearance-none shrink-0"
              >
                <option value="all">Все модели</option>
                {models.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>
            ) : (
              <div className="bg-[#1e1e1e] border border-neutral-700 text-sm text-white rounded-md px-3 py-1.5 shrink-0">
                Модель: {currentUser?.assignedModel}
              </div>
            )}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Поиск кастомов..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-neutral-700 text-sm text-white rounded-full pl-9 pr-4 py-1.5 outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button 
            onClick={() => {
              setForm({ model: formDefaultModel, customNumber: '', fanLink: '', status: 'pending', statusComment: '', authorId: currentUser?.id || '', authorName: currentUser?.name || '' });
              setEditingId(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Новый кастом</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustoms.map(custom => (
            <div 
              key={custom.id} 
              className="bg-[#252526] rounded-xl border border-neutral-800 overflow-hidden hover:border-neutral-600 transition-colors flex flex-col cursor-pointer"
              onClick={() => setViewingCustom(custom)}
            >
              <div className="p-4 border-b border-neutral-800 flex justify-between items-start bg-neutral-900/30">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className={`w-3 h-3 shrink-0 rounded-full ${statusColors[custom.status]} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                  <span className="font-semibold text-white truncate max-w-[200px] text-sm uppercase tracking-wider">Кастом #{custom.customNumber}</span>
                  {currentUser?.role === 'admin' && selectedModelFilter === 'all' && (
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded ml-2">{custom.model}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleEdit(custom); }}
                    className="p-1.5 hover:bg-neutral-700 rounded-md text-neutral-500 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteCustom(custom.id); }}
                    className="p-1.5 hover:bg-red-900/30 rounded-md text-neutral-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="text-sm text-blue-400 truncate mb-2">
                  <Link size={14} className="inline mr-1" /> {custom.fanLink}
                </div>
                {currentUser?.role === 'admin' && custom.statusComment && (
                  <div className="mt-auto text-sm text-neutral-400 line-clamp-3 bg-neutral-900/50 p-2 rounded-lg border border-neutral-800">
                    <MessageSquare size={14} className="inline mr-1" /> {custom.statusComment}
                  </div>
                )}
              </div>
              <div className="px-4 py-2 bg-neutral-900/50 border-t border-neutral-800 text-xs text-neutral-500 flex justify-between">
                <span>{new Date(custom.createdAt).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>
          ))}
          
          {filteredCustoms.length === 0 && (
            <div className="col-span-full text-center text-neutral-500 py-12 bg-[#252526] rounded-xl border border-neutral-800 border-dashed">
              Кастомов не найдено.
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#252526] border border-neutral-700 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1e1e1e]">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Редактировать кастом' : 'Новый кастом'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 overflow-y-auto custom-scrollbar space-y-4">
              {currentUser?.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Модель</label>
                  <select required value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 appearance-none">
                    <option value="" disabled>Выберите модель</option>
                    {models.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Номер кастома</label>
                  <input required type="text" placeholder="Например: #1234" value={form.customNumber} onChange={e => setForm({...form, customNumber: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Ссылка на фаната</label>
                  <input required type="text" value={form.fanLink} onChange={e => setForm({...form, fanLink: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500" />
                </div>
              </div>
              
              {currentUser?.role === 'admin' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Статус</label>
                    <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Custom['status']})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 appearance-none">
                      <option value="pending">Ожидание</option>
                      <option value="done">Сделано</option>
                      <option value="declined">Отказано</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Комментарий к статусу</label>
                    <textarea rows={3} placeholder="Причина отказа или другие детали..." value={form.statusComment || ''} onChange={e => setForm({...form, statusComment: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 resize-none custom-scrollbar" />
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-800">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-neutral-400 hover:text-white transition-colors">Отмена</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2">
                  <Check size={16} /> Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {displayedCustom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewingCustom(null)}>
          <div className="bg-[#252526] border border-neutral-700 rounded-xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1e1e1e]">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">Детали кастома</h2>
                <div className={`px-2 py-0.5 rounded text-xs font-medium text-white ${statusColors[displayedCustom.status]}`}>
                  {statusLabels[displayedCustom.status]}
                </div>
                {currentUser?.role === 'admin' && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleStatus(displayedCustom.id, displayedCustom.status);
                    }}
                    className="ml-2 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-2 py-1 rounded transition-colors"
                  >
                    Изменить статус
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => { setViewingCustom(null); handleEdit(displayedCustom); }}
                  className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded"
                >
                  <Edit2 size={18} />
                </button>
                <button onClick={() => setViewingCustom(null)} className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-6">
              
              <div className="md:w-1/3 flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wider">Информация</h3>
                  <div className="space-y-3">
                    {currentUser?.role === 'admin' && selectedModelFilter === 'all' && (
                      <div className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-lg border border-neutral-800">
                        <div className="flex items-center gap-2 text-neutral-400">
                          <span className="font-medium">Модель</span>
                        </div>
                        <span className="text-white bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-sm">{displayedCustom.model}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between bg-[#1e1e1e] p-3 rounded-lg border border-neutral-800">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Hash size={16} /> Номер кастома
                      </div>
                      <span className="text-white font-medium">{displayedCustom.customNumber}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wider">Фанат</h3>
                  <div className="bg-[#1e1e1e] p-3 rounded-lg border border-neutral-800">
                    <a href={displayedCustom.fanLink.startsWith('http') ? displayedCustom.fanLink : `https://${displayedCustom.fanLink}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline break-all text-sm">
                      <Link size={14} className="shrink-0" /> {displayedCustom.fanLink}
                    </a>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-neutral-800 text-xs text-neutral-500">
                  Добавлено {new Date(displayedCustom.createdAt).toLocaleString('ru-RU')} ({displayedCustom.authorName})
                </div>
              </div>

              {currentUser?.role === 'admin' && displayedCustom.statusComment && (
                <div className="flex-1 flex flex-col">
                  <h3 className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wider">Комментарий к статусу</h3>
                  <div className="flex-1 bg-[#1e1e1e] p-4 rounded-lg border border-neutral-800 text-neutral-300 whitespace-pre-wrap break-words overflow-y-auto custom-scrollbar text-base leading-relaxed">
                    {displayedCustom.statusComment}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
