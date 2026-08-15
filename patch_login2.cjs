const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

code = code.replace(
  '"@spiraldown9": "spiraldown9.2@nexus.app",',
  '"@spiraldown9": "spiraldown9.2@nexus.app",\n        "@godproudofyou": "godproudofyou@nexus.app",'
);

fs.writeFileSync('src/components/Login.tsx', code);
