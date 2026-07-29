import React, { useState } from 'react';
import { useStore } from '../store';
import { Calendar as CalendarIcon, Plus, X, AlertCircle } from 'lucide-react';

export function SchedulePanel() {
  const { dayOffs, addDayOff, deleteDayOff,  currentUser, models } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [modalOpen, setModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShift, setSelectedShift] = useState<'night' | 'morning' | 'evening'>('night');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModelName, setCustomModelName] = useState('');
  const [operatorName, setOperatorName] = useState('');

  // Generate days for current month
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
    
    const availableModels = models.map(m => m.name).filter(m => currentUser?.role === 'admin' || m === currentUser?.assignedModel);
    setSelectedModel(availableModels.length > 0 ? availableModels[0] : '');
    setCustomModelName('');
    
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedModel) { 
      setAlertModal({ isOpen: true, message: 'Выберите анкету' });
      return; 
    }

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

  const shiftColors = {
    night: 'bg-purple-800 border-purple-600 text-white shadow-sm',
    morning: 'bg-amber-600 border-amber-500 text-white shadow-sm',
    evening: 'bg-blue-600 border-blue-500 text-white shadow-sm'
  };

  const shifts: ('night' | 'morning' | 'evening')[] = ['night', 'morning', 'evening'];

  const renderShiftSlots = (dateStr: string, shift: 'night' | 'morning' | 'evening') => {
    const dayOffsForShift = dayOffs.filter(d => d.date === dateStr && d.shift === shift);
    const isFull = dayOffsForShift.length >= 2;

    const slots = [0, 1].map(index => {
      const dayOff = dayOffsForShift[index];
      if (dayOff) {
        const canDelete = currentUser?.role === 'admin' || dayOff.operator === currentUser?.name;
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
      
      const isFirstEmpty = index === dayOffsForShift.length;

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
                  <Plus size={14} className="mr-1" /> Добавить
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
        <div className="flex items-center gap-4">
          <CalendarIcon size={24} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">График выходных</h1>
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

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar p-4">
        <div className="min-w-[1200px] border border-neutral-700 rounded-lg overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="flex bg-[#252526] border-b border-neutral-600 shrink-0">
            <div className="w-24 shrink-0 p-3 text-center border-r border-neutral-600 font-semibold text-neutral-400">
              Дата
            </div>
            <div className="flex-1 grid grid-cols-3">
              <div className="p-3 text-center border-r border-neutral-600 font-bold bg-purple-900/20 text-purple-400">
                Ночь 🌃
              </div>
              <div className="p-3 text-center border-r border-neutral-600 font-bold bg-amber-900/20 text-amber-500">
                Утро 🌅
              </div>
              <div className="p-3 text-center font-bold bg-blue-900/20 text-blue-400">
                Вечер 🌆
              </div>
            </div>
          </div>
          <div className="flex bg-[#2a2d2e] border-b border-neutral-600 text-[10px] text-neutral-400 uppercase tracking-wider shrink-0">
            <div className="w-24 shrink-0 border-r border-neutral-600"></div>
            <div className="flex-1 grid grid-cols-3">
              <div className="grid grid-cols-4">
                <div className="p-2 text-center border-r border-neutral-600">Анкета</div>
                <div className="p-2 text-center border-r border-neutral-600">Выходной</div>
                <div className="p-2 text-center border-r border-neutral-600">Анкета2</div>
                <div className="p-2 text-center border-r border-neutral-600">Выходной</div>
              </div>
              <div className="grid grid-cols-4">
                <div className="p-2 text-center border-r border-neutral-600">Анкета</div>
                <div className="p-2 text-center border-r border-neutral-600">Выходной</div>
                <div className="p-2 text-center border-r border-neutral-600">Анкета2</div>
                <div className="p-2 text-center border-r border-neutral-600">Выходной</div>
              </div>
              <div className="grid grid-cols-4">
                <div className="p-2 text-center border-r border-neutral-600">Анкета</div>
                <div className="p-2 text-center border-r border-neutral-600">Выходной</div>
                <div className="p-2 text-center border-r border-neutral-600">Анкета2</div>
                <div className="p-2 text-center">Выходной</div>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div 
            className="bg-[#252526] w-full max-w-md rounded-xl shadow-2xl border border-neutral-700 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-dotted border-neutral-600">
              <h2 className="text-lg font-semibold text-white">Добавить выходной</h2>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-neutral-400">Дата:</span>
                <span className="font-medium text-white">{selectedDate.split('-').reverse().join('.')}</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-neutral-400">Смена:</span>
                <span className="font-medium text-white capitalize">
                  {selectedShift === 'night' ? 'Ночь 🌃' : selectedShift === 'morning' ? 'Утро 🌅' : 'Вечер 🌆'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1.5">Анкета</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="" disabled>Выберите анкету</option>
                  {models.map(m => m.name).filter(m => currentUser?.role === 'admin' || m === currentUser?.assignedModel).map(model => (
                    <option key={model} value={model}>{model}</option>
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
