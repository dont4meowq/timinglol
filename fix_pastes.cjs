const fs = require('fs');
let code = fs.readFileSync('src/components/PastesPanel.tsx', 'utf8');
code = code.replace("import ReactMarkdown from 'react-markdown';", "");
fs.writeFileSync('src/components/PastesPanel.tsx', code);
