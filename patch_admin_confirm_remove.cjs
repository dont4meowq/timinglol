const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Remove window.confirm for Model
code = code.replace(/if \(window\.confirm\('Удалить эту анкету\?'\)\) \{/, '');
code = code.replace(/alert\('Ошибка удаления: ' \+ \(err\.message \|\| ''\)\);/, '');
code = code.replace(/catch \(err: any\) \{\s*console\.error\(err\);\s*\}/, 'catch (err: any) { console.error(err); }');
// Remove closing brace of if
code = code.replace(/catch \(err: any\) \{[\s\S]*?\}\s*\}/, 'catch (err: any) { console.error(err); }');

// Remove window.confirm for User
code = code.replace(/if \(!window\.confirm\([\s\S]*?\)\) return;/, '');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
