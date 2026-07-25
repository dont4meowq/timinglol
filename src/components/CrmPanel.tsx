import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, Trash2, Edit2, User, Clock, DollarSign, Heart, X, Check } from 'lucide-react';
import { Fan } from '../types';

export function CrmPanel() {
  const { fans, addFan, updateFan, deleteFan, setSidebarOpen, activeModel } = useStore();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Fan, 'id'>>({
    model: activeModel,
    nickname: '',
    fetishes: '',
    spending: 'normal',
    timezone: '',
    notes: '',
    tagColor: 'none',
    link: ''
  });
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingFan, setViewingFan] = useState<Fan | null>(null);

  // Update form model when activeModel changes
  React.useEffect(() => {
    if (!isFormOpen) {
      setForm(prev => ({ ...prev, model: activeModel }));
    }
  }, [activeModel, isFormOpen]);

  const filteredFans = fans.filter(f => f.model === activeModel).filter(f => {
    const s = search.toLowerCase();
    return (f.nickname || '').toLowerCase().includes(s) || 
           (f.fetishes || '').toLowerCase().includes(s) ||
           (f.notes || '').toLowerCase().includes(s);
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateFan(editingId, form);
    } else {
      addFan({ ...form, model: activeModel });
    }
    setIsFormOpen(false);
    setEditingId(null);
    setForm({ model: activeModel, nickname: '', fetishes: '', spending: 'normal', timezone: '', notes: '', tagColor: 'none' });
  };

  const handleEdit = (fan: Fan) => {
    setForm({
      model: fan.model || activeModel,
      nickname: fan.nickname || '',
      fetishes: fan.fetishes || '',
      spending: fan.spending || 'normal',
      timezone: fan.timezone || '',
      notes: fan.notes || '',
      tagColor: fan.tagColor || 'none',
      link: fan.link || ''
    });
    setEditingId(fan.id);
    setIsFormOpen(true);
  };

  const tagColors = {
    red: 'bg-red-500/20 text-red-400 border-red-500/50',
    gold: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    green: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    none: 'bg-neutral-800 text-neutral-400 border-neutral-700'
  };

  const spendingLabels = {
    whale: 'Кит (Много)',
    normal: 'Обычный',
    low: 'Мало / Халявщик'
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-neutral-400 hover:text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">База фанатов</h1>
            <span className="bg-neutral-800 text-neutral-300 text-sm px-2.5 py-1 rounded-md font-medium border border-neutral-700">
              {activeModel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Поиск..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#252526] border border-neutral-700 text-sm text-white rounded-full pl-9 pr-4 py-1.5 outline-none focus:border-blue-500 w-64"
            />
          </div>
          <button 
            onClick={() => {
              setForm({ model: activeModel, nickname: '', fetishes: '', spending: 'normal', timezone: '', notes: '', tagColor: 'none' });
              setEditingId(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Новый профиль</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFans.map(fan => (
            <div 
              key={fan.id} 
              onClick={() => setViewingFan(fan)}
              className="bg-[#252526] border border-neutral-700 rounded-xl p-5 shadow-lg group hover:border-neutral-500 transition-colors flex flex-col cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3 gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                    <User size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-medium text-lg leading-tight truncate" title={fan.nickname}>{fan.nickname}</h3>
                    {fan.tagColor !== 'none' && (
                      <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold truncate max-w-full ${tagColors[fan.tagColor]}`} title={fan.tagColor === 'red' ? 'Спамер' : fan.tagColor === 'gold' ? 'Крупный покупатель' : fan.tagColor === 'green' ? 'Перспективный' : 'Обычный'}>
                        {fan.tagColor === 'red' ? 'Спамер' : fan.tagColor === 'gold' ? 'Крупный покупатель' : fan.tagColor === 'green' ? 'Перспективный' : 'Обычный'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(fan); }} className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors" title="Редактировать">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteFan(fan.id); }} className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors" title="Удалить">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mt-2 flex-1">
                <div className="flex items-start gap-2 text-sm">
                  <Heart size={14} className="text-pink-500 mt-0.5 shrink-0" />
                  <span className="text-neutral-300">{fan.fetishes || <span className="text-neutral-600">Нет данных по фетишам</span>}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <DollarSign size={14} className={fan.spending === 'whale' ? 'text-amber-400' : 'text-neutral-500'} />
                  <span>{spendingLabels[fan.spending]}</span>
                </div>
                {fan.timezone && (
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Clock size={14} className="text-blue-400" />
                    <span>{fan.timezone}</span>
                  </div>
                )}
                
                {fan.notes && (
                  <div className="mt-4 pt-3 border-t border-neutral-800 text-sm text-neutral-400 line-clamp-3">
                    {fan.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredFans.length === 0 && (
            <div className="col-span-full py-20 text-center text-neutral-500">
              Профили не найдены
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#252526] w-full max-w-md rounded-xl shadow-2xl border border-neutral-700 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-lg font-semibold text-white">{editingId ? 'Редактировать профиль' : 'Новый профиль'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-neutral-400 hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 overflow-y-auto custom-scrollbar space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Никнейм</label>
                <input required type="text" value={form.nickname} onChange={e => setForm({...form, nickname: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Заметки по фетишам</label>
                <input type="text" value={form.fetishes} onChange={e => setForm({...form, fetishes: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Ссылка на фаната</label>
                <input type="text" value={form.link || ''} onChange={e => setForm({...form, link: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Траты</label>
                  <select value={form.spending} onChange={e => setForm({...form, spending: e.target.value as any})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 appearance-none">
                    <option value="normal">Обычный</option>
                    <option value="whale">Кит</option>
                    <option value="low">Халявщик</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Часовой пояс</label>
                  <input type="text" placeholder="UTC+3" value={form.timezone} onChange={e => setForm({...form, timezone: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Цветной тег</label>
                <div className="flex gap-2">
                  {(['none', 'red', 'gold', 'green', 'blue'] as const).map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm({...form, tagColor: color})}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${form.tagColor === color ? 'border-white' : 'border-transparent'} ${tagColors[color].split(' ')[0]}`}
                      title={color}
                    >
                      {form.tagColor === color && <Check size={14} className={color === 'none' ? 'text-white' : 'text-current'} />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Общие заметки</label>
                <textarea rows={4} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 resize-none custom-scrollbar" />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingFan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewingFan(null)}>
          <div 
            className="bg-[#252526] w-full max-w-4xl rounded-xl shadow-2xl border border-neutral-700 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white leading-tight">{viewingFan.nickname}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                      {viewingFan.model}
                    </span>
                    {viewingFan.tagColor !== 'none' && (
                      <span className={`text-xs px-2 py-0.5 rounded border uppercase tracking-wider font-semibold ${tagColors[viewingFan.tagColor]}`}>
                        {viewingFan.tagColor === 'red' ? 'Спамер' : viewingFan.tagColor === 'gold' ? 'Крупный покупатель' : viewingFan.tagColor === 'green' ? 'Перспективный' : 'Обычный'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    handleEdit(viewingFan);
                    setViewingFan(null);
                  }} 
                  className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                  title="Редактировать"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => {
                    deleteFan(viewingFan.id);
                    setViewingFan(null);
                  }} 
                  className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors"
                  title="Удалить"
                >
                  <Trash2 size={18} />
                </button>
                <button onClick={() => setViewingFan(null)} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded transition-colors" title="Закрыть">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-hidden flex flex-col h-[70vh] min-h-[500px] gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wider">Фетиши и предпочтения</h3>
                  <div className="flex items-start gap-3 bg-[#1e1e1e] p-3 rounded-lg border border-neutral-800 h-full">
                    <Heart size={18} className="text-pink-500 shrink-0 mt-0.5" />
                    <span className="text-neutral-200">{viewingFan.fetishes || <span className="text-neutral-600">Нет данных</span>}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wider">Финансы</h3>
                    <div className="flex items-center gap-3 bg-[#1e1e1e] p-3 rounded-lg border border-neutral-800">
                      <DollarSign size={18} className={viewingFan.spending === 'whale' ? 'text-amber-400' : 'text-neutral-500'} />
                      <span className="text-neutral-200">{spendingLabels[viewingFan.spending]}</span>
                    </div>
                  </div>

                  {viewingFan.timezone && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wider">Часовой пояс</h3>
                      <div className="flex items-center gap-3 bg-[#1e1e1e] p-3 rounded-lg border border-neutral-800">
                        <Clock size={18} className="text-blue-400" />
                        <span className="text-neutral-200">{viewingFan.timezone}</span>
                      </div>
                    </div>
                  )}
                  {viewingFan.link && (
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wider">Ссылка</h3>
                      <div className="flex items-center gap-3 bg-[#1e1e1e] p-3 rounded-lg border border-neutral-800">
                        <a href={viewingFan.link.startsWith('http') ? viewingFan.link : `https://${viewingFan.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                          {viewingFan.link}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col flex-1 overflow-hidden">
                <h3 className="text-sm font-medium text-neutral-500 mb-2 uppercase tracking-wider shrink-0">Общие заметки</h3>
                <div className={`flex-1 bg-[#1e1e1e] p-4 rounded-lg border border-neutral-800 text-neutral-300 whitespace-pre-wrap break-words overflow-y-auto overflow-x-hidden custom-scrollbar ${
                  !viewingFan.notes ? 'text-base' :
                  viewingFan.notes.length > 1000 ? 'text-sm leading-relaxed' : 
                  'text-base leading-relaxed'
                }`}>
                  {viewingFan.notes || <span className="text-neutral-600">Нет общих заметок</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
