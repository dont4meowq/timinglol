const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

code = code.replace(/activeModel: 'Nana Waifu',/, "activeModel: '',");

fs.writeFileSync('src/store.ts', code);
