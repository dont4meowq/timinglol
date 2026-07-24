const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

const t = `                        <button onClick={() => { deleteSection(section.id); setMenuOpenId(null); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-900/30 text-red-400 flex items-center gap-2">`;
const r = `                        <button onClick={() => { if(confirm('Удалить раздел и все вкладки в нем?')) { deleteSection(section.id); setMenuOpenId(null); } }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-900/30 text-red-400 flex items-center gap-2">`;
code = code.replace(t, r);

const t2 = `                        <button onClick={() => { deleteNote(section.id, note.id); setNoteMenuOpenId(null); }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-900/30 text-red-400 flex items-center gap-2">`;
const r2 = `                        <button onClick={() => { if(confirm('Удалить вкладку?')) { deleteNote(section.id, note.id); setNoteMenuOpenId(null); } }} className="w-full text-left px-3 py-1.5 text-sm hover:bg-red-900/30 text-red-400 flex items-center gap-2">`;
code = code.replace(t2, r2);

fs.writeFileSync('src/components/Sidebar.tsx', code);
