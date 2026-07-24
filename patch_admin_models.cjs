const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const importReplacement = `
import { Trash2, Shield, User, ArrowLeft, Loader2, Plus, Edit2, X, Check } from 'lucide-react';
import { secondaryAuth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, deleteDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
`;
code = code.replace(/import \{ Trash2, Shield, User, ArrowLeft, Loader2 \} from 'lucide-react';\nimport \{ secondaryAuth, db \} from '\.\.\/firebase';\nimport \{ createUserWithEmailAndPassword \} from 'firebase\/auth';\nimport \{ doc, setDoc, deleteDoc, updateDoc \} from 'firebase\/firestore';/, importReplacement.trim());

const modelsState = `
  const [newModelName, setNewModelName] = useState('');
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [editModelName, setEditModelName] = useState('');

  const { models } = useStore();
`;
code = code.replace(/const \[role, setRole\] = useState\('chatter'\);/, "const [role, setRole] = useState('chatter');\n" + modelsState);

const handleModelOps = `
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
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUpdateModelName = async (id: string) => {
    if (!editModelName.trim()) return;
    try {
      await updateDoc(doc(db, 'models', id), { name: editModelName.trim() });
      setEditingModelId(null);
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (err) {
      console.error(err);
    }
  };
`;
code = code.replace(/const handleDeleteUser = async/, handleModelOps + '\n  const handleDeleteUser = async');

// Update dropdowns to use `models` from store
code = code.replace(/\{(\['Nana Waifu'[^\]]+\])\.map\(model => \(/g, "{models.map(m => m.name).map(model => (");

// Add models UI after users list
const modelsUI = `
          <div className="md:col-span-3 mt-8">
            <div className="bg-[#252526] p-6 rounded-xl border border-neutral-700 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4">Управление анкетами (Models)</h2>
              
              <form onSubmit={handleAddModel} className="flex items-center gap-2 mb-6">
                <input 
                  type="text"
                  value={newModelName}
                  onChange={e => setNewModelName(e.target.value)}
                  placeholder="Новая анкета (напр. Aska)"
                  className="bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors flex items-center justify-center">
                  <Plus size={20} />
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {models.map(model => (
                  <div key={model.id} className="bg-[#1e1e1e] border border-neutral-800 rounded-lg p-3 flex items-center justify-between group">
                    {editingModelId === model.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input 
                          type="text"
                          value={editModelName}
                          onChange={e => setEditModelName(e.target.value)}
                          className="bg-[#252526] border border-neutral-600 text-white rounded px-2 py-1 w-full outline-none text-sm"
                          autoFocus
                        />
                        <button onClick={() => handleUpdateModelName(model.id)} className="text-green-400 hover:bg-green-900/20 p-1 rounded">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingModelId(null)} className="text-neutral-400 hover:bg-neutral-800 p-1 rounded">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-white font-medium">{model.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingModelId(model.id); setEditModelName(model.name); }}
                            className="text-neutral-400 hover:text-blue-400 hover:bg-blue-900/20 p-1.5 rounded"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteModel(model.id)}
                            className="text-neutral-400 hover:text-red-400 hover:bg-red-900/20 p-1.5 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
`;
code = code.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/, `        </div>\n${modelsUI}\n      </div>\n    </div>\n  );\n}`);

// Update user role dropdown
const roleDropdown = `
                          <div className="flex flex-col gap-2 mt-1">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-neutral-500">Роль:</p>
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                className="bg-[#1e1e1e] border border-neutral-700 text-xs text-white rounded outline-none focus:border-blue-500 py-0.5"
                              >
                                <option value="chatter">Чаттер</option>
                                <option value="admin">Администратор</option>
                              </select>
                            </div>
                            {user.role === 'chatter' && (
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-neutral-500">Анкета:</p>
                                <select
                                  value={user.assignedModel || ''}
                                  onChange={(e) => handleUpdateModel(user.id, e.target.value)}
                                  className="bg-[#1e1e1e] border border-neutral-700 text-xs text-white rounded outline-none focus:border-blue-500 py-0.5"
                                >
                                  {models.map(m => m.name).map(model => (
                                    <option key={model} value={model}>{model}</option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
`;

code = code.replace(/\{user\.role === 'admin' \? \([\s\S]*?Администратор[\s\S]*?\) : \([\s\S]*?<div className="flex items-center gap-2 mt-0\.5">[\s\S]*?<\/div>\s*\)\}/, roleDropdown.trim());

fs.writeFileSync('src/components/AdminPanel.tsx', code);
