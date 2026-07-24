const fs = require('fs');
let code = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

code = code.replace(
  "    setAllUsers",
  "    setAllUsers,\n    setBonuses"
);

code = code.replace(
  "// Models",
  "// Bonuses\n    unsubs.push(\n      onSnapshot(collection(db, 'bonuses'), (snap) => {\n        setBonuses(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));\n      })\n    );\n\n    // Models"
);

code = code.replace(
  "setModels]);",
  "setModels, setBonuses]);"
);

fs.writeFileSync('src/hooks/useFirebaseSync.ts', code);
