const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

// I will insert the statistics div right after the main calendar div
// "          </div>\n        </div>\n      </div>\n\n" ... wait, let's find the end of the SchedulePanel rendering.

const searchString = `            </div>
          </div>
        </div>
      </div>
`;

// wait, let's use a regex to find the end of the return statement
const renderStats = `
      {/* Day Offs Statistics */}
      <div className="p-4 border-t border-neutral-800 bg-[#1e1e1e]">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CalendarIcon className="text-blue-400" />
          Статистика выходных (за выбранный месяц)
        </h2>
        <div className="bg-[#252526] rounded-xl border border-neutral-700 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-700 bg-[#1e1e1e] font-medium text-neutral-400 text-sm">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-7">Оператор</div>
            <div className="col-span-4 text-right">Количество выходных</div>
          </div>
          <div className="overflow-y-auto max-h-[300px] p-2 space-y-1 custom-scrollbar">
            {Object.entries(dayOffs.reduce((acc, curr) => {
              const d = new Date(curr.date);
              if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
                acc[curr.operator] = (acc[curr.operator] || 0) + 1;
              }
              return acc;
            }, {} as Record<string, number>))
              .sort((a, b) => b[1] - a[1])
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
              
              {Object.keys(dayOffs.filter(curr => {
                const d = new Date(curr.date);
                return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
              })).length === 0 && (
                <div className="text-center py-6 text-neutral-500">Нет взятых выходных в этом месяце</div>
              )}
          </div>
        </div>
      </div>
`;

// Insert it right before the last closing div and curly brace of the SchedulePanel
// Need to find the end of the SchedulePanel. Let's just do a string replace on the last closing tags.

code = code.replace(/    <\/div>\n  \);\n}\n?$/m, renderStats + '    </div>\n  );\n}\n');

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
console.log("Schedule stats patched.");
