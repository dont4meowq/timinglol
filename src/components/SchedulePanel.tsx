import React, { useState } from 'react';
import { useStore } from '../store';
import { Calendar as CalendarIcon, Plus, X, AlertCircle } from 'lucide-react';

export function SchedulePanel() {
  const { dayOffs, addDayOff, deleteDayOff, currentUser, models } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [modalOpen, setModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState<'night' | 'morning' | 'evening'>('night');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [activeTab, setActiveTab] = useState<'calendar' | 'stats'>('calendar');


  const groupedDayOffs = React.useMemo(() => {
    const map = {};
    dayOffs.forEach(d => {
      if (!map[d.date]) map[d.date] = {};
      if (!map[d.date][d.shift]) map[d.date][d.shift] = [];
      map[d.date][d.shift].push(d);
    });
    return map;
  }, [dayOffs]);

  const sortedMonthlyStats = React.useMemo(() => {
    const monthlyStats = dayOffs.reduce((acc: Record<string, number>, curr) => {
      const d = new Date(curr.date);
      if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
        acc[curr.operator] = (acc[curr.operator] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(monthlyStats).sort((a, b) => b[1] - a[1]);
  }, [dayOffs, currentDate]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
  const getNextAvailableDate = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 7);
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
  };

  const getDayString = (day: number) => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDayName = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dayNames[d.getDay()];
  };

  const openAddModal = (dateStr: string, shift: 'night' | 'morning' | 'evening') => {
    setSelectedDate(dateStr);
    setSelectedShift(shift);
    
    const availableModels = models
      .map(m => m.name)
      .filter(m => currentUser?.role === 'admin' || m === currentUser?.assignedModel);
      
    setSelectedModel(availableModels.length > 0 ? availableModels[0] : '');
    setCustomModelName('');
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedModel) return;
    
    const operatorName = currentUser?.name || 'Unknown';
    const newDate = new Date(selectedDate);
    newDate.setHours(0, 0, 0, 0);

    const recentDayOff = dayOffs.find(d => {
      if (d.operator !== operatorName) return false;
      const dDate = new Date(d.date);
      dDate.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(newDate.getTime() - dDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays < 7;
    });

    if (recentDayOff) {
      setAlertModal({ 
        isOpen: true, 
        message: `Нельзя взять выходной в этот день.\nВыходной: ${recentDayOff.date.split('-').reverse().join('.')}.\nСледующий возможный: ${getNextAvailableDate(recentDayOff.date)}.`
      });
      return;
    }

    const finalModelName = selectedModel === 'Custom' ? customModelName.trim() : selectedModel;
    if (!finalModelName) {
      setAlertModal({ isOpen: true, message: 'Укажите имя анкеты' });
      return;
    }

    setConfirmModal({
      isOpen: true,
      message: `Вы уверены, что хотите взять выходной ${selectedDate}?`,
      onConfirm: () => {
        addDayOff({
          date: selectedDate,
          shift: selectedShift,
          model: finalModelName,
          operator: operatorName
        });
        setModalOpen(false);
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} });
      }
    });
  };

  const renderShiftSlots = (dateStr: string, shift: 'night' | 'morning' | 'evening') => {
    const shifts = groupedDayOffs[dateStr]?.[shift] || [];
    const maxSlots = 2;
    const isFull = shifts.length >= maxSlots;
    const operatorName = currentUser?.name || 'Unknown';

    const shiftColors = {
      night: 'text-purple-400 bg-purple-900/20',
      morning: 'text-blue-400 bg-blue-900/20',
      evening: 'text-orange-400 bg-orange-900/20'
    };

    const slots = Array.from({ length: maxSlots }, (_, index) => {
      const dayOff = shifts[index];
      const isFirstEmpty = !dayOff && (!shifts[index - 1] || index === 0);
      
      if (dayOff) {
        const canDelete = currentUser?.role === 'admin' || dayOff.operator === operatorName;
        return (
          <div key={dayOff.id} className="grid grid-cols-2 relative group/item w-full h-full">
            <div className={`p-1.5 border-r border-neutral-600 truncate text-xs flex items-center ${shiftColors[shift]}`} title={dayOff.model}>
              <span className="font-semibold">{dayOff.model}</span>
            </div>
            <div className={`p-1.5 truncate text-xs flex items-center justify-between ${shiftColors[shift]}`} title={dayOff.operator}>
              <span className="opacity-80 truncate">{dayOff.operator.startsWith('@') ? dayOff.operator : '@' + dayOff.operator}</span>
              {canDelete && (
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteDayOff(dayOff.id); }}
                  className="opacity-0 group-hover/item:opacity-100 hover:text-white transition-opacity shrink-0 ml-1"
                  title="Удалить"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        );
      }

      const newDate = new Date(dateStr);
      newDate.setHours(0, 0, 0, 0);
      const recentDayOff = dayOffs.find(d => {
        if (d.operator !== operatorName) return false;
        const dDate = new Date(d.date);
        dDate.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(newDate.getTime() - dDate.getTime());
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays < 7;
      });

      return (
        <div key={`empty-${index}`} className="grid grid-cols-2 w-full h-full group/empty relative">
          <div className="col-span-2 p-1 flex items-center justify-center relative">
            {isFirstEmpty && !isFull && (
              recentDayOff ? (
                <div className="flex items-center text-xs text-neutral-500 opacity-0 group-hover/empty:opacity-100 absolute inset-0 justify-center w-full h-full cursor-not-allowed">
                  <span className="text-red-400">График 6/1</span>
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 text-[10px] text-red-400 leading-tight bg-[#2a2d2e] p-1.5 rounded shadow-xl z-20 border border-red-900/50 whitespace-nowrap px-3 opacity-0 group-hover/empty:opacity-100 transition-opacity pointer-events-none">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>Выходной: {recentDayOff.date.split('-').reverse().join('.')}. Можно с: {getNextAvailableDate(recentDayOff.date)}</span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => openAddModal(dateStr, shift)}
                  className="flex items-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors opacity-0 group-hover/empty:opacity-100 absolute inset-0 justify-center w-full h-full"
                >
                  <Plus size={14} className="mr-1" />
                  Взять выходной
                </button>
              )
            )}
          </div>
        </div>
      );
    });

    return (
      <div className="flex flex-col w-full h-full relative group/shift">
        <div className="grid grid-cols-2 h-full w-full">
          <div className="border-r border-neutral-600">{slots[0]}</div>
          <div>{slots[1]}</div>
        </div>
        {isFull && (
          <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 text-[10px] text-amber-500 leading-tight bg-[#2a2d2e] p-1.5 rounded shadow-xl z-20 border border-amber-900/50 whitespace-nowrap px-3 opacity-0 group-hover/shift:opacity-100 transition-opacity pointer-events-none">
            <AlertCircle size={12} className="shrink-0" />
            <span>Если вам нужен выходной, обратитесь к админу</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-[#1e1e1e]">
      {/* Header */}
      <div className="p-4 border-b border-dotted border-neutral-600 flex items-center justify-between shrink-0 bg-[#252526]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <CalendarIcon size={24} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider hidden sm:block">График выходных</h1>
          </div>
          
          <div className="flex bg-[#1a1c1d] rounded-lg p-1 border border-neutral-700">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'calendar' ? 'bg-[#2a2d2e] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Календарь
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'stats' ? 'bg-[#2a2d2e] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Статистика
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
            className="p-2 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
          >
            &larr; Пред
          </button>
          <span className="text-lg font-medium text-white min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button 
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
            className="p-2 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors"
          >
            След &rarr;
          </button>
        </div>
      </div>

      {activeTab === 'calendar' ? (
        <div className="flex-1 min-h-0 overflow-auto custom-scrollbar p-4">
          <div className="min-w-[1200px] border border-neutral-700 rounded-lg overflow-hidden flex flex-col">
            {/* Table Header */}
            <div className="flex bg-[#252526] border-b border-neutral-600 shrink-0">
              <div className="w-24 shrink-0 p-3 text-center border-r border-neutral-600 font-semibold text-neutral-400">
                Дата
              </div>
              <div className="flex-1 grid grid-cols-3">
                <div className="p-3 text-center border-r border-neutral-600 font-semibold text-purple-400 bg-purple-900/10">Ночь</div>
                <div className="p-3 text-center border-r border-neutral-600 font-semibold text-blue-400 bg-blue-900/10">Утро</div>
                <div className="p-3 text-center font-semibold text-orange-400 bg-orange-900/10">Вечер</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="flex flex-col">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dateStr = getDayString(day);
                const dayName = getDayName(day);
                const isWeekend = dayName === 'Сб' || dayName === 'Вс';
                const operatorName = currentUser?.name || 'Unknown';
                
                const newDate = new Date(dateStr);
                newDate.setHours(0, 0, 0, 0);
                const recentDayOff = dayOffs.find(d => {
                  if (d.operator !== operatorName) return false;
                  const dDate = new Date(d.date);
                  dDate.setHours(0, 0, 0, 0);
                  const diffTime = Math.abs(newDate.getTime() - dDate.getTime());
                  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 && diffDays < 7;
                });

                return (
                  <div key={day} className={`flex border-b border-dotted border-neutral-600 ${isWeekend ? 'bg-red-900/10 hover:bg-red-900/20' : (day % 2 === 0 ? 'bg-[#1a1c1d] hover:bg-[#252526]' : 'bg-[#1e1e1e] hover:bg-[#252526]')} transition-colors`}>
                    <div className={`w-24 shrink-0 flex items-center justify-center gap-2 border-r border-neutral-600 p-2 font-medium ${isWeekend ? 'text-red-400' : 'text-neutral-300'} relative group/date cursor-default`}>
                      <span>{String(day).padStart(2, '0')}.{String(currentDate.getMonth() + 1).padStart(2, '0')}</span>
                      <span className="text-sm opacity-60">{dayName}</span>
                      {recentDayOff && (
                        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 text-[10px] text-red-400 leading-tight bg-[#2a2d2e] p-1.5 rounded shadow-xl z-20 border border-red-900/50 whitespace-nowrap px-3 opacity-0 group-hover/date:opacity-100 transition-opacity pointer-events-none">
                          <AlertCircle size={12} className="shrink-0" />
                          <span>Выходной: {recentDayOff.date.split('-').reverse().join('.')}. Можно с: {getNextAvailableDate(recentDayOff.date)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 grid grid-cols-3">
                      <div className="border-r border-neutral-600 min-h-[40px] flex items-stretch">
                        {renderShiftSlots(dateStr, 'night')}
                      </div>
                      <div className="border-r border-neutral-600 min-h-[40px] flex items-stretch">
                        {renderShiftSlots(dateStr, 'morning')}
                      </div>
                      <div className="min-h-[40px] flex items-stretch">
                        {renderShiftSlots(dateStr, 'evening')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1e1e1e] p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CalendarIcon className="text-blue-400" />
              Статистика выходных (за выбранный месяц)
            </h2>
            <div className="bg-[#252526] rounded-xl border border-neutral-700 overflow-hidden shadow-xl">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-700 bg-[#1e1e1e] font-medium text-neutral-400 text-sm">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-7">Оператор</div>
                <div className="col-span-4 text-right">Количество выходных</div>
              </div>
              <div className="p-2 space-y-1">
                {sortedMonthlyStats
                  .map(([operator, count], idx) => (
                    <div key={operator} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-[#2a2d2e] rounded-lg transition-colors">
                      <div className="col-span-1 text-center font-bold text-neutral-500">
                        {idx + 1}
                      </div>
                      <div className="col-span-7 font-medium text-white">{operator.startsWith('@') ? operator : '@' + operator}</div>
                      <div className="col-span-4 text-right font-bold text-blue-400">
                        {count} {count === 1 ? 'день' : count > 1 && count < 5 ? 'дня' : 'дней'}
                      </div>
                    </div>
                  ))}
                  
                {sortedMonthlyStats.length === 0 && (
                  <div className="text-center py-10 text-neutral-500">Нет взятых выходных в этом месяце</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#252526] rounded-xl shadow-xl border border-neutral-700 w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Взять выходной</h2>
                <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Анкета</label>
                  <select
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
                  >
                    {models
                      .filter(m => currentUser?.role === 'admin' || m.name === currentUser?.assignedModel)
                      .map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    <option value="Custom">Другая (ввести вручную)</option>
                  </select>
                  {selectedModel === 'Custom' && (
                    <input
                      type="text"
                      autoFocus
                      placeholder="Введите имя анкеты..."
                      className="w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors mt-2"
                      value={customModelName}
                      onChange={e => setCustomModelName(e.target.value)}
                    />
                  )}
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    Отмена
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSave}
                    disabled={!selectedModel || (selectedModel === 'Custom' && !customModelName.trim())}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#252526] rounded-xl shadow-xl border border-neutral-700 w-full max-w-sm overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-neutral-800 bg-red-900/20 text-red-400">
              <AlertCircle size={24} />
              <h2 className="text-lg font-semibold">Внимание</h2>
            </div>
            <div className="p-4">
              <p className="text-neutral-300 whitespace-pre-line">{alertModal.message}</p>
            </div>
            <div className="p-4 border-t border-neutral-800 flex justify-end">
              <button 
                onClick={() => setAlertModal({ isOpen: false, message: '' })}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Понятно
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#252526] rounded-xl shadow-xl border border-neutral-700 w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Подтверждение</h2>
              <p className="text-neutral-300">{confirmModal.message}</p>
            </div>
            <div className="p-4 border-t border-neutral-800 flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} })}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
