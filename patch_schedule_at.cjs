const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');
code = code.replace(/<span className="opacity-80 truncate">@\{dayOff\.operator\}<\/span>/, '<span className="opacity-80 truncate">{dayOff.operator.startsWith(\'@\') ? dayOff.operator : \'@\' + dayOff.operator}</span>');
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
