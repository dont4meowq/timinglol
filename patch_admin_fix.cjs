const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Replace the extra `</div>` at the end of the users list or add the missing ones at the end of the file
// I will just parse it and count divs.
code = code.replace(/<\/div>\s*<\/div>\s*<div className="md:col-span-3 mt-8">/, `</div>\n          </div>\n\n          <div className="md:col-span-3 mt-8">`);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
