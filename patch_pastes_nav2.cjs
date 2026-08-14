const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

appCode = appCode.replace(
    "        ) : appView === 'customs' ? (\n          <CustomsPanel />\n        ) : (",
    "        ) : appView === 'customs' ? (\n          <CustomsPanel />\n        ) : appView === 'pastes' ? (\n          <PastesPanel />\n        ) : ("
);

fs.writeFileSync('src/App.tsx', appCode);
console.log('Navigation patched');
