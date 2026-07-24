const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const replacement = `
  const handleDeleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err: any) {
      console.error("Ошибка удаления", err);
      alert("Ошибка удаления: " + err.message);
    }
  };
`;

code = code.replace(/const handleDeleteUser = async \(id: string\) => \{[\s\S]*?if \(window\.confirm\([\s\S]*?\}[\s\S]*?\};/, replacement.trim());

fs.writeFileSync('src/components/AdminPanel.tsx', code);
