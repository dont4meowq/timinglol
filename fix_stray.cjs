const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');
code = code.replace("    }));\n  }, updates) => {", "    }));\n  },");
fs.writeFileSync('src/store.ts', code);
