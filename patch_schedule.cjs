const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

code = code.replace(/setOperatorName\(currentUser\?\.username \|\| ''\);/, "setOperatorName(currentUser?.name || '');");

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
