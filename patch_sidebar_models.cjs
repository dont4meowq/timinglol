const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(/\{(\['Nana Waifu'[^\]]+\])\.filter/g, "{models.map(m => m.name).filter");

if (!code.includes('currentUser, setAppView, models')) {
  code = code.replace(/currentUser, setAppView/, "currentUser, setAppView, models");
}

fs.writeFileSync('src/components/Sidebar.tsx', code);
