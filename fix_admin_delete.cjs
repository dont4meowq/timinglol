const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const t = `                        <button 
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                          title="Удалить"
                        >`;
const r = `                        <button 
                          onClick={() => { if(confirm('Удалить пользователя?')) handleDeleteUser(user.id, user.name); }}
                          className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                          title="Удалить"
                        >`;
code = code.replace(t, r);

const t2 = `                          <button onClick={() => handleDeleteModel(m.id)} className="p-1 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>`;
const r2 = `                          <button onClick={() => { if(confirm('Удалить анкету? Это не удалит связанные данные!')) handleDeleteModel(m.id); }} className="p-1 text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100">
                            <Trash2 size={16} />
                          </button>`;
code = code.replace(t2, r2);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
