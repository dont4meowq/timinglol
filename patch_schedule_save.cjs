const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

code = code.replace(/if \(!selectedModel \|\| !operatorName\) \{\n      alert\('Заполните все поля!'\);\n      return;\n    \}/, "if (!selectedModel || !operatorName) { alert('Заполните все поля: Анкета (' + selectedModel + '), Оператор (' + operatorName + ')'); return; }");

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
