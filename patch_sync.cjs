const fs = require('fs');

let sync = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

if (!sync.includes("collection(db, 'roulettes')")) {
  sync = sync.replace(
    /onSnapshot\(collection\(db, 'contests'\), \(snap\) => \{\s*useStore\.getState\(\)\.setContests\(snap\.docs\.map\(d => \(\{ id: d\.id, \.\.\.d\.data\(\) \} as any\)\)\.sort\(\(a, b\) => b\.createdAt - a\.createdAt\)\);\s*\}\)\s*\);/,
    match => match + "\n    unsubs.push(\n      onSnapshot(collection(db, 'roulettes'), (snap) => {\n        useStore.getState().setRoulettes(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));\n      })\n    );"
  );
  fs.writeFileSync('src/hooks/useFirebaseSync.ts', sync);
}
