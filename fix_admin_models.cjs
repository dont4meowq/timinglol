const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /const handleAddModel = async[\s\S]*?const handleUpdateModelName = async/g;

const correctCode = `
  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModelName.trim()) return;
    try {
      await addDoc(collection(db, 'models'), { name: newModelName.trim() });
      setNewModelName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteModel = async (id: string) => {
    if (window.confirm('Удалить эту анкету?')) {
      try {
        await deleteDoc(doc(db, 'models', id));
      } catch (err: any) {
        console.error(err);
        alert('Ошибка удаления: ' + (err.message || ''));
      }
    }
  };

  const handleUpdateModelName = async
`;

code = code.replace(regex, correctCode.trim());

fs.writeFileSync('src/components/AdminPanel.tsx', code);
