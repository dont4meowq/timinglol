const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

code = code.replace("appView: 'dashboard' | 'admin' | 'crm' | 'schedule' | 'bonuses';", "appView: 'dashboard' | 'admin' | 'crm' | 'schedule' | 'bonuses' | 'roulette';");
code = code.replace("setAppView: (view: 'dashboard' | 'admin' | 'crm' | 'schedule' | 'bonuses') => void;", "setAppView: (view: 'dashboard' | 'admin' | 'crm' | 'schedule' | 'bonuses' | 'roulette') => void;");

fs.writeFileSync('src/store.ts', code);
