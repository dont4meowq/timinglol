
import React, { useState } from 'react';
import { useStore } from '../store';
import { Trash2, Shield, User, ArrowLeft, Loader2, Plus, Edit2, X, Check } from 'lucide-react';
import { secondaryAuth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, deleteDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export function AdminPanel() {
  const { allUsers, currentUser, setAppView, models } = useStore();
  
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [role, setRole] = useState('chatter');
  const [assignedModel, setAssignedModel] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [newModelName, setNewModelName] = useState('');
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [editModelName, setEditModelName] = useState('');

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogin.trim() || !newPassword || !newName.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      const formatEmail = (str: string) => {
        if (str.includes('@') && str.includes('.') && !str.startsWith('@')) return str;
        return `${str.replace('@', '').toLowerCase()}@nexus.app`;
      };
      const authEmail = formatEmail(newLogin);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, authEmail, newPassword);
      const uid = userCredential.user.uid;
      
      const newUserObj = {
        id: uid,
        email: newLogin, // save original login as email field for display
        name: newName,
        role,
        ...(role === 'chatter' ? { assignedModel: assignedModel.trim() } : {})
      };
      
      await setDoc(doc(db, 'users', uid), newUserObj);
      
      setNewLogin('');
      setNewPassword('');
      setNewName('');
      setRole('chatter');
      setAssignedModel('');
    } catch (err: any) { console.error(err); } finally {
      setLoading(false);
      secondaryAuth.signOut();
    }
  };

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
    try {
      await deleteDoc(doc(db, 'models', id));
    } catch (err: any) { console.error(err); }
  };

  const handleUpdateModelName = async (id: string) => {
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
  };
  
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    
    try {
      // Delete user
      await deleteDoc(doc(db, 'users', id));
      
      // Delete their day-offs
      const q = query(collection(db, 'dayOffs'), where('operator', '==', name));
      const snap = await getDocs(q);
      const deletePromises = snap.docs.map(d => deleteDoc(d.ref).catch(console.error));
      await Promise.all(deletePromises);
      
    } catch (err: any) {
      console.error("Ошибка удаления", err);
    }
  };

  const handleUpdateModel = async (userId: string, newModel: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { assignedModel: newModel });
    } catch (err) {
      console.error("Ошибка обновления", err);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e1e] text-neutral-400">
        У вас нет прав для просмотра этой страницы
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#1e1e1e] overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 border-b border-neutral-800 pb-4">
          <button 
            onClick={() => setAppView('dashboard')}
            className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white">Управление пользователями</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-[#252526] p-6 rounded-xl border border-neutral-700 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4">Создать аккаунт</h2>
              
              {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
              
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Логин</label>
                  <input 
                    type="text"
                    value={newLogin}
                    onChange={e => setNewLogin(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Пароль</label>
                  <input 
                    type="text"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Имя (Ник)</label>
                  <input 
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Роль</label>
                  <select 
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                    className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
                  >
                    <option value="chatter">Чаттер</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>

                {role === 'chatter' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Анкета (Model)</label>
                    <select
                      value={assignedModel}
                      onChange={(e) => setAssignedModel(e.target.value)}
                      className="w-full bg-[#1e1e1e] border border-neutral-700 rounded px-3 py-2 text-white outline-none focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="" disabled>Выберите анкету</option>
                      {models.map(m => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors mt-2 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Создать
                </button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-[#252526] p-6 rounded-xl border border-neutral-700 shadow-xl h-full flex flex-col">
              <h2 className="text-lg font-semibold text-white mb-4">Список пользователей ({allUsers.length})</h2>
              
              <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                {allUsers.map(user => (
                  <div key={user.id} className="flex items-start justify-between p-3 bg-[#1e1e1e] border border-neutral-800 rounded-lg group">
                    <div className="flex items-start gap-3 w-full">
                      <div className={`p-2 rounded-full mt-1 ${user.role === 'admin' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                        {user.role === 'admin' ? <Shield size={16} /> : <User size={16} />}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{user.name} <span className="text-neutral-500 text-xs font-normal">({user.email})</span></p>
                        
                        <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-neutral-500 w-12">Роль:</p>
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                              className="bg-[#1e1e1e] border border-neutral-700 text-xs text-white rounded outline-none focus:border-blue-500 py-0.5 px-1"
                            >
                              <option value="chatter">Чаттер</option>
                              <option value="admin">Администратор</option>
                            </select>
                          </div>
                          {user.role === 'chatter' && (
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-neutral-500 w-12">Анкета:</p>
                              <select
                                value={user.assignedModel || ''}
                                onChange={(e) => handleUpdateModel(user.id, e.target.value)}
                                className="bg-[#1e1e1e] border border-neutral-700 text-xs text-white rounded outline-none focus:border-blue-500 py-0.5 px-1 flex-1"
                              >
                                <option value="" disabled>Не назначена</option>
                                {models.map(m => (
                                  <option key={m.id} value={m.name}>{m.name}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 pl-2">
                      {user.id !== currentUser?.id ? (
                        <button 
                          onClick={() => { handleDeleteUser(user.id, user.name); }}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span className="text-xs text-neutral-500 px-2 pt-1">Вы</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-[#252526] p-6 rounded-xl border border-neutral-700 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-4">Управление анкетами</h2>
              
              <form onSubmit={handleAddModel} className="flex items-center gap-2 mb-6">
                <input 
                  type="text"
                  value={newModelName}
                  onChange={e => setNewModelName(e.target.value)}
                  placeholder="Новая анкета (напр. Aska)"
                  className="flex-1 max-w-sm bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500"
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
                
                {models.length === 0 && (
                  <div className="col-span-full text-neutral-500 text-center py-4 border border-dashed border-neutral-700 rounded-lg">
                    Нет добавленных анкет.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
