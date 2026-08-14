const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

code = code.replace("\\n  const daysInMonth", "\n  const daysInMonth");
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
