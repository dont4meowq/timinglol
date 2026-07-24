const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const modalsStart = code.indexOf('      {/* Alert Modal */}');
const modalsEnd = code.indexOf('    </div>\n        </div>\n      );\n    });');

if (modalsStart !== -1 && modalsEnd !== -1) {
  const modalsCode = code.slice(modalsStart, modalsEnd + 10);
  
  // Remove modals from their current incorrect position
  code = code.replace(modalsCode, '');

  // Add them before the final closing tag of SchedulePanel
  code = code.replace('    </div>\n  );\n}', modalsCode + '\n    </div>\n  );\n}');

  // Also replace the empty slot rendering to add recentDayOff logic there
  const emptySlotStr = `      return (
        <div key={\`empty-\${index}\`} className="grid grid-cols-2 w-full h-full group/empty relative">
          <div className="col-span-2 p-1 flex items-center justify-center relative">
            {isFirstEmpty && !isFull && (
              <button 
                onClick={() => openAddModal(dateStr, shift)}
                className="flex items-center text-xs text-neutral-500 hover:text-neutral-300 transition-colors opacity-0 group-hover/empty:opacity-100 absolute inset-0 justify-center w-full h-full"
              >
                <Plus size={14} className="mr-1" /> Добавить
              </button>
            )}`;

  const operatorNameCode = `
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
      });`;

  const newEmptySlotStr = `      const isFirstEmpty = index === dayOffsForShift.length;
` + operatorNameCode + `

      return (
        <div key={\`empty-\${index}\`} className="grid grid-cols-2 w-full h-full group/empty relative">
          <div className="col-span-2 p-1 flex items-center justify-center relative">
            {isFirstEmpty && !isFull && (
              recentDayOff ? (
                <div className="flex items-center text-xs text-neutral-500 opacity-0 group-hover/empty:opacity-100 absolute inset-0 justify-center w-full h-full cursor-not-allowed">
                  <span className="text-red-400">График 6/1</span>
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 text-[10px] text-red-400 leading-tight bg-[#2a2d2e] p-1.5 rounded shadow-xl z-20 border border-red-900/50 whitespace-nowrap px-3 opacity-0 group-hover/empty:opacity-100 transition-opacity pointer-events-none">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>График 6/1. Другой выходной: {recentDayOff.date}</span>
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
            )}`;

  code = code.replace(`      const isFirstEmpty = index === dayOffsForShift.length;\n\n` + emptySlotStr, newEmptySlotStr);

  fs.writeFileSync('src/components/SchedulePanel.tsx', code);
  console.log("Success");
} else {
  console.log("Could not find modals block.");
}
