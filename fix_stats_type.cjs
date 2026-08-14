const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const target = `    const monthlyStats = dayOffs.reduce((acc, curr) => {`;
const repl = `    const monthlyStats = dayOffs.reduce((acc: Record<string, number>, curr) => {`;

code = code.replace(target, repl);
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
