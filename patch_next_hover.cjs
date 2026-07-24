const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const t1 = "<span>График 6/1. Другой выходной: {recentDayOff.date.split('-').reverse().join('.')}</span>";
const r1 = "<span>Выходной: {recentDayOff.date.split('-').reverse().join('.')}. Можно с: {getNextAvailableDate(recentDayOff.date)}</span>";
code = code.replace(t1, r1);

const t2 = "<span>График 6/1. Выходной: {recentDayOff.date.split('-').reverse().join('.')}</span>";
const r2 = "<span>Выходной: {recentDayOff.date.split('-').reverse().join('.')}. Можно с: {getNextAvailableDate(recentDayOff.date)}</span>";
code = code.replace(t2, r2);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
