const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(/currentUser\?\.isAdmin/g, "currentUser?.role === 'admin'");

fs.writeFileSync('src/components/Sidebar.tsx', code);
