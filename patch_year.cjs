const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

code = code.replace(
  "return \\`\\${String(d.getDate()).padStart(2, '0')}.\\${String(d.getMonth() + 1).padStart(2, '0')}\\`;",
  "return \\`\\${String(d.getDate()).padStart(2, '0')}.\\${String(d.getMonth() + 1).padStart(2, '0')}.\\${d.getFullYear()}\\`;"
);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
