const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const targetStr = `            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = getDayString(day);
              const dayName = getDayName(day);
              const isWeekend = dayName === 'Сб' || dayName === 'Вс';

              return (
                <div key={day} className={\`flex border-b border-dotted border-neutral-600 \${isWeekend ? 'bg-red-900/10 hover:bg-red-900/20' : (day % 2 === 0 ? 'bg-[#1a1c1d] hover:bg-[#252526]' : 'bg-[#1e1e1e] hover:bg-[#252526]')} transition-colors\`}>
                  <div className={\`w-24 shrink-0 flex items-center justify-center gap-2 border-r border-neutral-600 p-2 font-medium \${isWeekend ? 'text-red-400' : 'text-neutral-300'}\`}>
                    <span>{String(day).padStart(2, '0')}.{String(currentDate.getMonth() + 1).padStart(2, '0')}</span>
                    <span className="text-sm opacity-60">{dayName}</span>
                  </div>`;

const replaceStr = `            {Array.from({ length: daysInMonth }).map((_, i) => {
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
                <div key={day} className={\`flex border-b border-dotted border-neutral-600 \${isWeekend ? 'bg-red-900/10 hover:bg-red-900/20' : (day % 2 === 0 ? 'bg-[#1a1c1d] hover:bg-[#252526]' : 'bg-[#1e1e1e] hover:bg-[#252526]')} transition-colors\`}>
                  <div className={\`w-24 shrink-0 flex items-center justify-center gap-2 border-r border-neutral-600 p-2 font-medium \${isWeekend ? 'text-red-400' : 'text-neutral-300'} relative group/date\`}>
                    <span>{String(day).padStart(2, '0')}.{String(currentDate.getMonth() + 1).padStart(2, '0')}</span>
                    <span className="text-sm opacity-60">{dayName}</span>
                    {recentDayOff && (
                      <div className="absolute top-[80%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 text-[10px] text-red-400 leading-tight bg-[#2a2d2e] p-1.5 rounded shadow-xl z-20 border border-red-900/50 whitespace-nowrap px-3 opacity-0 group-hover/date:opacity-100 transition-opacity pointer-events-none">
                        <AlertCircle size={12} className="shrink-0" />
                        <span>График 6/1. Выходной: {recentDayOff.date}</span>
                      </div>
                    )}
                  </div>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
