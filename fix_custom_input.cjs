const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

// 1. Add state variable
code = code.replace(
  "const [selectedModel, setSelectedModel] = useState('');",
  "const [selectedModel, setSelectedModel] = useState('');\n  const [customModelName, setCustomModelName] = useState('');"
);

// 2. Add reset to openAddModal
const openAddModalTarget = `    const availableModels = models.map(m => m.name).filter(m => currentUser?.role === 'admin' || m === currentUser?.assignedModel);
    setSelectedModel(availableModels.length > 0 ? availableModels[0] : '');
    
    
    setModalOpen(true);`;

const openAddModalReplace = `    const availableModels = models.map(m => m.name).filter(m => currentUser?.role === 'admin' || m === currentUser?.assignedModel);
    setSelectedModel(availableModels.length > 0 ? availableModels[0] : '');
    setCustomModelName('');
    
    setModalOpen(true);`;

code = code.replace(openAddModalTarget, openAddModalReplace);

// 3. handleSave logic for model name
const handleSaveTarget = `    setConfirmModal({
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
    });`;

const handleSaveReplace = `    const finalModelName = selectedModel === 'Custom' ? customModelName.trim() : selectedModel;
    if (!finalModelName) {
      setAlertModal({ isOpen: true, message: 'Укажите имя анкеты' });
      return;
    }
    setConfirmModal({
      isOpen: true,
      message: \`Вы уверены, что хотите взять выходной \${selectedDate}?\`,
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
    });`;

code = code.replace(handleSaveTarget, handleSaveReplace);

// 4. Input rendering in modal
const inputTarget = `                {selectedModel === 'Custom' && (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Введите имя анкеты..."
                    className="w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors mt-2"
                    onChange={e => setSelectedModel(e.target.value)}
                  />
                )}`;

const inputReplace = `                {selectedModel === 'Custom' && (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Введите имя анкеты..."
                    className="w-full bg-[#1e1e1e] border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors mt-2"
                    value={customModelName}
                    onChange={e => setCustomModelName(e.target.value)}
                  />
                )}`;

code = code.replace(inputTarget, inputReplace);

// 5. Submit button disable logic
const submitTarget = `                  disabled={!selectedModel}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"`;

const submitReplace = `                  disabled={!selectedModel || (selectedModel === 'Custom' && !customModelName.trim())}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"`;

code = code.replace(submitTarget, submitReplace);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
console.log("Done");
