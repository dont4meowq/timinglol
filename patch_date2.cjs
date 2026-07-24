const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

// Replace 1
code = code.replace(
  "Другой ваш выходной: ${recentDayOff.date}",
  "Другой ваш выходной: ${recentDayOff.date.split('-').reverse().join('.')}"
);

// Replace 2
code = code.replace(
  "График 6/1. Другой выходной: {recentDayOff.date}",
  "График 6/1. Другой выходной: {recentDayOff.date.split('-').reverse().join('.')}"
);

// Replace 3
code = code.replace(
  "График 6/1. Выходной: {recentDayOff.date}",
  "График 6/1. Выходной: {recentDayOff.date.split('-').reverse().join('.')}"
);

const targetDeleteStr = `      if (dayOff) {
        return (
          <div key={dayOff.id} className="grid grid-cols-2 relative group/item w-full h-full">
            <div className={\`p-1.5 border-r border-neutral-600 truncate text-xs flex items-center \${shiftColors[shift]}\`} title={dayOff.model}>
              <span className="font-semibold">{dayOff.model}</span>
            </div>
            <div className={\`p-1.5 truncate text-xs flex items-center justify-between \${shiftColors[shift]}\`} title={dayOff.operator}>
              <span className="opacity-80 truncate">{dayOff.operator.startsWith('@') ? dayOff.operator : '@' + dayOff.operator}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteDayOff(dayOff.id); }}
                className="opacity-0 group-hover/item:opacity-100 hover:text-white transition-opacity shrink-0 ml-1"
                title="Удалить"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        );
      }`;

const replaceDeleteStr = `      if (dayOff) {
        const canDelete = currentUser?.role === 'admin' || dayOff.operator === currentUser?.name;
        return (
          <div key={dayOff.id} className="grid grid-cols-2 relative group/item w-full h-full">
            <div className={\`p-1.5 border-r border-neutral-600 truncate text-xs flex items-center \${shiftColors[shift]}\`} title={dayOff.model}>
              <span className="font-semibold">{dayOff.model}</span>
            </div>
            <div className={\`p-1.5 truncate text-xs flex items-center justify-between \${shiftColors[shift]}\`} title={dayOff.operator}>
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
      }`;

code = code.replace(targetDeleteStr, replaceDeleteStr);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
