const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const stateCode = `
  const [modalOpen, setModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: () => {} });
`;
code = code.replace(/const \[modalOpen, setModalOpen\] = useState\(false\);/, stateCode.trim());

const handleSaveOrig = `  const handleSave = () => {
    if (!selectedModel) { alert('Выберите анкету'); return; }

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
      alert(\`Нельзя взять выходной в этот день (график 6/1). Другой ваш выходной: \${recentDayOff.date}. Между выходными должно быть минимум 6 рабочих дней.\`);
      return;
    }

    const confirmMessage = \`Вы уверены, что хотите взять выходной \${selectedDate}?\`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    addDayOff({
      date: selectedDate,
      shift: selectedShift,
      model: selectedModel,
      operator: operatorName
    });
    setModalOpen(false);
  };`;

const handleSaveNew = `  const handleSave = () => {
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
        message: \`Нельзя взять выходной в этот день (график 6/1).\\nДругой ваш выходной: \${recentDayOff.date}.\\nМежду выходными должно быть минимум 6 рабочих дней.\` 
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      message: \`Вы уверены, что хотите взять выходной \${selectedDate}?\`,
      onConfirm: () => {
        addDayOff({
          date: selectedDate,
          shift: selectedShift,
          model: selectedModel,
          operator: operatorName
        });
        setModalOpen(false);
        setConfirmModal({ isOpen: false, message: '', onConfirm: () => {} });
      }
    });
  };`;

code = code.replace(handleSaveOrig, handleSaveNew);

const modalsCode = `      )}

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
    </div>`;

code = code.replace(/      \)}\s*<\/div>/s, modalsCode);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
