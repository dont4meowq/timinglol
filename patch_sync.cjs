const fs = require('fs');

let sync = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

sync = sync.replace(
  /onSnapshot\(collection\(db, 'guides'\), \(snap\) => \{\s*setGuides\(snap\.docs\.map\(d => \(\{ id: d\.id, \.\.\.d\.data\(\) \} as any\)\)\.sort\(\(a, b\) => b\.createdAt - a\.createdAt\)\);\s*\}\)\s*\);/,
  match => match + "\n    unsubs.push(\n      onSnapshot(collection(db, 'contests'), (snap) => {\n        useStore.getState().setContests(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => b.createdAt - a.createdAt));\n      })\n    );"
);

fs.writeFileSync('src/hooks/useFirebaseSync.ts', sync);
