const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

// handleSave alert
const target1 = "message: \`Нельзя взять выходной в этот день (график 6/1).\\nДругой ваш выходной: ${recentDayOff.date.split('-').reverse().join('.')}.\\nМежду выходными должно быть минимум 6 рабочих дней.\`";
const repl1 = "message: \`Нельзя взять выходной в этот день.\\nВыходной: ${recentDayOff.date.split('-').reverse().join('.')}.\\nСледующий возможный: ${getNextAvailableDate(recentDayOff.date)}.\`";
code = code.replace(target1, repl1);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
