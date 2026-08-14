import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import { ArrowLeft, Plus, Trash2, Gift, DollarSign } from 'lucide-react';

export function BonusesPanel() {
  const { allUsers, currentUser, setAppView, bonuses, addBonus, deleteBonus } = useStore();
  
  // Get all chatters, sorted by name

  const chatters = allUsers.filter(u => u.role === 'chatter').sort((a, b) => a.name.localeCompare(b.name));

  const userStats = useMemo(() => {
    const stats = {};
    chatters.forEach(c => {
      stats[c.id] = { total: 0, count: 0 };
    });
    bonuses.forEach(b => {
      if (stats[b.userId]) {
        stats[b.userId].total += b.amount;
        stats[b.userId].count += 1;
      }
    });
    return stats;
  }, [bonuses, chatters]);

  
  // If the current user is a chatter, maybe they are selected by default?
  const initialSelected = chatters.find(c => c.id === currentUser?.id)?.id || (chatters.length > 0 ? chatters[0].id : null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialSelected);
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const selectedUser = chatters.find(c => c.id === selectedUserId);
  const userBonuses = useMemo(() => {
    return bonuses
      .filter(b => b.userId === selectedUserId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bonuses, selectedUserId]);

  const handleAddBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !amount.trim() || !description.trim()) return;
    
    addBonus({
      userId: selectedUserId,
      amount: Number(amount),
      description: description.trim(),
      date: new Date().toISOString()
    });
    
    setAmount('');
    setDescription('');
  };

  const totalBonus = userBonuses.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      <div className="h-14 flex items-center px-4 border-b border-neutral-800 shrink-0 gap-4">
        <button 
          onClick={() => setAppView('schedule')}
          className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <Gift size={20} className="text-purple-400" />
          Бонусы
        </h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Chatters */}
        <div className="w-64 border-r border-neutral-800 flex flex-col bg-[#1e1e1e]">
          <div className="p-4 border-b border-neutral-800">
            <h2 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Чаттеры</h2>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            <button
                onClick={() => setSelectedUserId('top')}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedUserId === 'top' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-purple-400 hover:bg-purple-900/20'
                } mb-2`}
              >
                <span className="font-semibold">🏆 Топ чаттеров</span>
              </button>
            {chatters.map(chatter => (
              <button
                key={chatter.id}
                onClick={() => setSelectedUserId(chatter.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between ${
                  selectedUserId === chatter.id 
                    ? 'bg-[#2a2d2e] text-white' 
                    : 'text-neutral-400 hover:bg-[#2a2d2e]/50 hover:text-neutral-200'
                }`}
              >
                <span className="font-medium truncate">{chatter.name}</span>
                {userStats[chatter.id]?.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                    selectedUserId === chatter.id ? 'bg-purple-500/20 text-purple-300' : 'bg-neutral-800 text-neutral-500'
                  }`}>
                    {userStats[chatter.id].count}
                  </span>
                )}
              </button>
            ))}
            {chatters.length === 0 && (
              <div className="text-center text-sm text-neutral-500 p-4">
                Нет чаттеров
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bonuses */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] min-h-0 min-w-0">

          {selectedUserId === 'top' ? (
            <div className="flex-1 flex flex-col p-6 min-h-0">
              <div className="border-b border-neutral-800 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Gift className="text-purple-400" /> Топ чаттеров по бонусам
                </h2>
                <p className="text-neutral-400 text-sm mt-1">Рейтинг сотрудников на основе начисленных бонусов</p>
              </div>
              <div className="bg-[#252526] rounded-xl border border-neutral-700 overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-700 bg-[#1e1e1e] font-medium text-neutral-400 text-sm">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-7">Чаттер</div>
                  <div className="col-span-4 text-right">Сумма бонусов</div>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                  {chatters
                    .map(c => ({
                      ...c,
                      total: userStats[c.id]?.total || 0
                    }))
                    .sort((a, b) => b.total - a.total)
                    .map((c, idx) => (
                      <div key={c.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-[#2a2d2e] rounded-lg transition-colors">
                        <div className="col-span-1 text-center font-bold text-neutral-500">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </div>
                        <div className="col-span-7 font-medium text-white">{c.name}</div>
                        <div className={`col-span-4 text-right font-bold ${c.total > 0 ? 'text-emerald-400' : c.total < 0 ? 'text-red-400' : 'text-neutral-500'}`}>
                          {c.total > 0 ? '+' : ''}${c.total.toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : selectedUser ? (

            <>
              <div className="p-6 border-b border-neutral-800 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedUser.name}</h2>
                  <p className="text-neutral-400 text-sm">Управление бонусами сотрудника</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-400 mb-1">Всего бонусов</div>
                  <div className="text-3xl font-bold text-purple-400 flex items-center justify-end gap-1">
                    <DollarSign size={24} />
                    {totalBonus.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                {(currentUser?.role === 'admin' || currentUser?.id === selectedUserId) && (
                <form onSubmit={handleAddBonus} className="bg-[#252526] p-4 rounded-xl border border-neutral-700 mb-6 shadow-sm flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Описание за что бонус</label>
                    <input
                      type="text"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Например: Выполнение плана, отличная смена..."
                      className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded-lg px-3 py-2 outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div className="w-48">
                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Сумма ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded-lg pl-9 pr-3 py-2 outline-none focus:border-purple-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!description.trim() || !amount.trim() || Number(amount) === 0}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-[42px]"
                  >
                    <Plus size={18} />
                    Сохранить
                  </button>
                </form>
                )}

                <div className="space-y-3">
                  {userBonuses.length === 0 ? (
                    <div className="text-center py-12 bg-[#252526] rounded-xl border border-neutral-800 border-dashed">
                      <Gift size={48} className="mx-auto text-neutral-600 mb-3" />
                      <p className="text-neutral-400 text-lg">Бонусов пока нет</p>
                      <p className="text-neutral-500 text-sm mt-1">Добавьте первый бонус используя форму выше</p>
                    </div>
                  ) : (
                    userBonuses.map(bonus => (
                      <div key={bonus.id} className="bg-[#252526] p-4 rounded-xl border border-neutral-700 flex items-center justify-between group">
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium text-lg truncate mb-1">{bonus.description}</p>
                          <p className="text-xs text-neutral-500">
                            Добавлено: {new Date(bonus.date).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 pl-4">
                          <div className={`text-xl font-bold whitespace-nowrap ${bonus.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {bonus.amount > 0 ? '+' : ''}${bonus.amount.toLocaleString()}
                          </div>
                          {(currentUser?.role === 'admin' || currentUser?.id === bonus.userId) && (
                            <button
                              onClick={() => { deleteBonus(bonus.id); }}
                              className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              title="Удалить бонус"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500 p-6">
              <div className="text-center">
                <Gift size={64} className="mx-auto text-neutral-700 mb-4" />
                <p className="text-xl">Выберите чаттера слева</p>
                <p className="text-sm mt-2">чтобы просмотреть или добавить бонусы</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
