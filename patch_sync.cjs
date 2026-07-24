const fs = require('fs');
let code = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

if (!code.includes('setModels(snap')) {
  code = code.replace(/setFans,[\s]+setDayOffs,/, "setFans,\n    setDayOffs,\n    setModels,");
  
  const modelsCode = `
    // Models
    unsubs.push(
      onSnapshot(collection(db, 'models'), (snap) => {
        setModels(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );
`;
  code = code.replace(/return \(\) => unsubs\.forEach\(u => u\(\)\);/, `${modelsCode}\n    return () => unsubs.forEach(u => u());`);
  
  code = code.replace(/\[currentUser, setFans, setDayOffs, setSections, setAllUsers\]/, "[currentUser, setFans, setDayOffs, setSections, setAllUsers, setModels]");
}

fs.writeFileSync('src/hooks/useFirebaseSync.ts', code);
