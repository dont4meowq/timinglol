const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const t = `  const handleUpdateModelName = async (id: string) => {
    if (!editModelName.trim()) return;
    try {
      await updateDoc(doc(db, 'models', id), { name: editModelName.trim() });
      setEditingModelId(null);
    } catch (err) {
      console.error(err);
    }
  };`;

const r = `  const handleUpdateModelName = async (id: string) => {
    if (!editModelName.trim()) return;
    const oldModel = models.find(m => m.id === id);
    try {
      await updateDoc(doc(db, 'models', id), { name: editModelName.trim() });
      
      // Cascade update if oldModel exists
      if (oldModel && oldModel.name !== editModelName.trim()) {
        const newName = editModelName.trim();
        const oldName = oldModel.name;

        // update users
        const usersQ = query(collection(db, 'users'), where('assignedModel', '==', oldName));
        const usersSnap = await getDocs(usersQ);
        usersSnap.forEach(d => updateDoc(d.ref, { assignedModel: newName }));

        // update fans
        const fansQ = query(collection(db, 'fans'), where('model', '==', oldName));
        const fansSnap = await getDocs(fansQ);
        fansSnap.forEach(d => updateDoc(d.ref, { model: newName }));

        // update sections
        const sectionsQ = query(collection(db, 'sections'), where('model', '==', oldName));
        const sectionsSnap = await getDocs(sectionsQ);
        sectionsSnap.forEach(d => updateDoc(d.ref, { model: newName }));

        // update dayOffs
        const dayOffsQ = query(collection(db, 'dayOffs'), where('model', '==', oldName));
        const dayOffsSnap = await getDocs(dayOffsQ);
        dayOffsSnap.forEach(d => updateDoc(d.ref, { model: newName }));
      }
      
      setEditingModelId(null);
    } catch (err) {
      console.error(err);
    }
  };`;

code = code.replace(t, r);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
