const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(/import \{ Folder, FolderOpen/g, "import { logOut } from '../firebase';\nimport { Folder, FolderOpen");
code = code.replace(/currentUser, logout, setAppView/g, "currentUser, setAppView");
code = code.replace(/onClick=\{logout\}/g, "onClick={logOut}");

fs.writeFileSync('src/components/Sidebar.tsx', code);
