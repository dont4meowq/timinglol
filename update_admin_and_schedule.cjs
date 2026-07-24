const fs = require('fs');

// 1. AdminPanel
let adminCode = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
adminCode = adminCode.replace(/Управление анкетами \(Models\)/g, 'Управление анкетами');
fs.writeFileSync('src/components/AdminPanel.tsx', adminCode);

// 2. SchedulePanel
let schedCode = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');
// Remove Operator field UI
schedCode = schedCode.replace(/<div>\s*<label className="block text-sm font-medium text-neutral-400 mb-1\.5">Оператор \(Ваш ник\)<\/label>[\s\S]*?<\/div>/, '');

// Update openAddModal (remove setOperatorName)
schedCode = schedCode.replace(/setOperatorName\(currentUser\?\.name \|\| ''\);/g, '');

// Update handleSave to use currentUser.name directly
const handleSave = `
  const handleSave = () => {
    if (!selectedModel) { alert('Выберите анкету'); return; }
    addDayOff({
      date: selectedDate,
      shift: selectedShift,
      model: selectedModel,
      operator: currentUser?.name || 'Unknown'
    });
    setModalOpen(false);
  };
`;
schedCode = schedCode.replace(/const handleSave = \(\) => \{[\s\S]*?setModalOpen\(false\);\n  \};/, handleSave.trim());
fs.writeFileSync('src/components/SchedulePanel.tsx', schedCode);
