const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/import \{ doc, setDoc, deleteDoc \} from 'firebase\/firestore';/, "import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';");

const handleUpdateModelCode = `
  const handleUpdateModel = async (userId: string, newModel: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { assignedModel: newModel });
    } catch (err) {
      console.error("Ошибка обновления", err);
    }
  };

  if (currentUser?.role !== 'admin') {
`;
code = code.replace(/if \(currentUser\?\.role !== 'admin'\) \{/, handleUpdateModelCode);

const userListReplacement = `
                        {user.role === 'admin' ? (
                          <p className="text-xs text-neutral-500">Администратор</p>
                        ) : (
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs text-neutral-500">Чаттер — Анкета:</p>
                            <select
                              value={user.assignedModel || ''}
                              onChange={(e) => handleUpdateModel(user.id, e.target.value)}
                              className="bg-[#1e1e1e] border border-neutral-700 text-xs text-white rounded outline-none focus:border-blue-500"
                            >
                              {['Nana Waifu', 'Lily Long', 'Kayla Angel', 'Linda Goth', 'Sofia', 'Ayulin', 'Aska'].map(model => (
                                <option key={model} value={model}>{model}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
`;
code = code.replace(/<p className="text-xs text-neutral-500">[\s\S]*?\{user\.role === 'admin' \? 'Администратор' : `Чаттер — Анкета: \$\{user\.assignedModel\}`\}[\s\S]*?<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>/, userListReplacement);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
