const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

code = code.replace(
  "const authEmail = overrides[login] || formatEmail(login);",
  "const trimmed = login.trim();\n      const withAt = trimmed.startsWith('@') ? trimmed : '@' + trimmed;\n      const authEmail = overrides[withAt] || formatEmail(trimmed);"
);

fs.writeFileSync('src/components/Login.tsx', code);
