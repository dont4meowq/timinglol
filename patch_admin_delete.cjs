const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const importFix = `import { doc, setDoc, deleteDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';`;
code = code.replace(/import \{ doc, setDoc, deleteDoc, updateDoc, collection, addDoc \} from 'firebase\/firestore';/, importFix);

const replacement = `
  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm('Удалить пользователя ' + name + '?\\nВНИМАНИЕ: Его аккаунт останется в Firebase Auth, но он потеряет доступ.')) return;
    try {
      // Delete user
      await deleteDoc(doc(db, 'users', id));
      
      // Delete their day-offs
      const q = query(collection(db, 'dayOffs'), where('operator', '==', name));
      const snap = await getDocs(q);
      snap.forEach(d => {
        deleteDoc(d.ref);
      });
      
    } catch (err: any) {
      console.error("Ошибка удаления", err);
    }
  };
`;
code = code.replace(/const handleDeleteUser = async \(id: string\) => \{[\s\S]*?\};\n\n  const handleUpdateModel/, replacement.trim() + '\n\n  const handleUpdateModel');

code = code.replace(/onClick=\{\(\) => handleDeleteUser\(user\.id\)\}/g, "onClick={() => handleDeleteUser(user.id, user.name)}");

fs.writeFileSync('src/components/AdminPanel.tsx', code);
