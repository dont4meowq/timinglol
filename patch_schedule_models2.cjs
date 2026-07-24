const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

code = code.replace(/const \{ dayOffs, addDayOff, deleteDayOff, fans, currentUser \} = useStore\(\);/, "const { dayOffs, addDayOff, deleteDayOff, fans, currentUser, models } = useStore();");

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
