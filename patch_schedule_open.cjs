const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const replacement = `
  const openAddModal = (dateStr: string, shift: 'night' | 'morning' | 'evening') => {
    setSelectedDate(dateStr);
    setSelectedShift(shift);
    
    const availableModels = models.map(m => m.name).filter(m => currentUser?.role === 'admin' || m === currentUser?.assignedModel);
    setSelectedModel(availableModels.length > 0 ? availableModels[0] : '');
    
    setOperatorName(currentUser?.name || '');
    setModalOpen(true);
  };
`;
code = code.replace(/const openAddModal = [\s\S]*?setModalOpen\(true\);\n  \};/, replacement.trim());

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
