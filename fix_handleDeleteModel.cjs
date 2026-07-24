const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const regex = /const handleDeleteModel = async \(id: string\) => \{[\s\S]*?const handleUpdateModelName = async/g;
const correctCode = `const handleDeleteModel = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'models', id));
    } catch (err: any) { console.error(err); }
  };

  const handleUpdateModelName = async`;

code = code.replace(regex, correctCode);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
