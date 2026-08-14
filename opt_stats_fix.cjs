const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const oldCheck = `                {dayOffs.filter(curr => {
                  const d = new Date(curr.date);
                  return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
                }).length === 0 && (`;

const newCheck = `                {sortedMonthlyStats.length === 0 && (`

code = code.replace(oldCheck, newCheck);
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
