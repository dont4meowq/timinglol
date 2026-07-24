const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

code = code.replace(/addFan: \(fan\) => set\(\(state\) => \(\{[\s\S]*?fans: \[\.\.\.state\.fans, \{ \.\.\.fan, id: generateId\(\) \}\][\s\S]*?\}\)\),/, `addFan: (fan) => {
  const id = generateId();
  const obj = { ...fan, id };
  if (auth.currentUser) setDoc(doc(db, \`users/\${auth.currentUser.uid}/fans/\${id}\`), obj);
  set((state) => ({ fans: [...state.fans, obj] }));
},`);

code = code.replace(/deleteFan: \(id\) => set\(\(state\) => \(\{[\s\S]*?fans: state\.fans\.filter\(f => f\.id !== id\)[\s\S]*?\}\)\),/, `deleteFan: (id) => {
  if (auth.currentUser) deleteDoc(doc(db, \`users/\${auth.currentUser.uid}/fans/\${id}\`));
  set((state) => ({ fans: state.fans.filter(f => f.id !== id) }));
},`);

code = code.replace(/updateFan: \(id, updates\) => set\(\(state\) => \(\{[\s\S]*?fans: state\.fans\.map\(f => f\.id === id \? \{ \.\.\.f, \.\.\.updates \} : f\)[\s\S]*?\}\)\),/, `updateFan: (id, updates) => {
  if (auth.currentUser) setDoc(doc(db, \`users/\${auth.currentUser.uid}/fans/\${id}\`), updates, { merge: true });
  set((state) => ({ fans: state.fans.map(f => f.id === id ? { ...f, ...updates } : f) }));
},`);

code = code.replace(/addDayOff: \(dayOff\) => set\(\(state\) => \(\{[\s\S]*?dayOffs: \[\.\.\.state\.dayOffs, \{ \.\.\.dayOff, id: generateId\(\) \}\][\s\S]*?\}\)\),/, `addDayOff: (dayOff) => {
  const id = generateId();
  const obj = { ...dayOff, id };
  if (auth.currentUser) setDoc(doc(db, \`users/\${auth.currentUser.uid}/dayOffs/\${id}\`), obj);
  set((state) => ({ dayOffs: [...state.dayOffs, obj] }));
},`);

code = code.replace(/deleteDayOff: \(id\) => set\(\(state\) => \(\{[\s\S]*?dayOffs: state\.dayOffs\.filter\(d => d\.id !== id\)[\s\S]*?\}\)\),/, `deleteDayOff: (id) => {
  if (auth.currentUser) deleteDoc(doc(db, \`users/\${auth.currentUser.uid}/dayOffs/\${id}\`));
  set((state) => ({ dayOffs: state.dayOffs.filter(d => d.id !== id) }));
},`);

fs.writeFileSync('src/store.ts', code);
