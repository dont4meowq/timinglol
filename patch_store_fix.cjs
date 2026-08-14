const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

code = code.replace(/await import\('firebase\/firestore'\)\.then\(\(\{[^}]+\}\) => [^)]+\(doc\(import\('\.\.\/src\/firebase\.js'\)\.then\(m=>m\.db\) as any, 'pastes', id\), [^)]+\)\)\.catch\(\(\)=>{}\);/g, "setDoc(doc(db, `pastes/${id}`), obj).catch(console.error);");
code = code.replace(/await import\('firebase\/firestore'\)\.then\(\(\{[^}]+\}\) => [^)]+\(doc\(import\('\.\.\/src\/firebase\.js'\)\.then\(m=>m\.db\) as any, 'pastes', id\)\)\)\.catch\(\(\)=>{}\);/g, "deleteDoc(doc(db, `pastes/${id}`)).catch(console.error);");
code = code.replace(/await import\('firebase\/firestore'\)\.then\(\(\{[^}]+\}\) => [^)]+\(doc\(import\('\.\.\/src\/firebase\.js'\)\.then\(m=>m\.db\) as any, 'pastes', id\), [^)]+\)\)\.catch\(\(\)=>{}\);/g, "updateDoc(doc(db, `pastes/${id}`), updates).catch(console.error);");

// Wait, the replace above was probably not perfectly matching. Let's just rewrite the functions if needed.
const pastesFunctionsStr = `  addPaste: (paste) => {
    const id = generateId();
    const obj = { ...paste, id, createdAt: Date.now() , teamId: get().currentUser?.teamId};
    setDoc(doc(db, \`pastes/\${id}\`), obj).catch(console.error);
    set((state) => ({ pastes: [...state.pastes, obj as Paste] }));
  },
  deletePaste: (id) => {
    deleteDoc(doc(db, \`pastes/\${id}\`)).catch(console.error);
    set((state) => ({ pastes: state.pastes.filter(p => p.id !== id) }));
  },
  updatePaste: (id, updates) => {
    updateDoc(doc(db, \`pastes/\${id}\`), updates).catch(console.error);
    set((state) => ({
      pastes: state.pastes.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  },`;

code = code.replace(/addPaste: async[\s\S]+?updatePaste: async[^,]+,/m, pastesFunctionsStr);
fs.writeFileSync('src/store.ts', code);
