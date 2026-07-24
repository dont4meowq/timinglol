const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');
code = code.replace(/disabled=\{!selectedModel \|\| !operatorName\}/, "disabled={!selectedModel}");
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
