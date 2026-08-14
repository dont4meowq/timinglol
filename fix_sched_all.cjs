const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

// The `activeTab` condition was never opened properly because `calStart` replacement failed.
// Let's remove the broken `) : (` part.
code = code.replace(
  /      \) : \([\s\S]+?\n\}\n?$/m, 
  `    </div>\n  );\n}`
);

// Now, properly inject `{activeTab === 'calendar' ? (` before `{/* Table */}`
code = code.replace(
  "      {/* Table */}",
  "      {activeTab === 'calendar' ? (\n      <>\n      {/* Table */}"
);

// And after the calendar modals (which is right before the end of the return statement)
// Let's find the end of `confirmModal`
const endCalendar = `        </div>
      )}
      </>
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
                  
                {dayOffs.filter(curr => {
                  const d = new Date(curr.date);
                  return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
                }).length === 0 && (
                  <div className="text-center py-10 text-neutral-500">Нет взятых выходных в этом месяце</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

code = code.replace(/        <\/div>\n      \)\}\n    <\/div>\n  \);\n\}/, endCalendar);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
