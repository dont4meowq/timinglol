const fs = require('fs');
let code = fs.readFileSync('src/components/TabList.tsx', 'utf8');

const t1 = `                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNote(activeSection.id, note.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-neutral-600 rounded transition-opacity ml-1"
                  >`;
const r1 = `                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm('Удалить вкладку?')) deleteNote(activeSection.id, note.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-neutral-600 rounded transition-opacity ml-1"
                  >`;
code = code.replace(t1, r1);

const t2 = `            onClick={() => {
              deleteNote(activeSection.id, menuOpenId);
              setMenuOpenId(null);
            }}`;
const r2 = `            onClick={() => {
              if(confirm('Удалить вкладку?')) {
                deleteNote(activeSection.id, menuOpenId);
              }
              setMenuOpenId(null);
            }}`;
code = code.replace(t2, r2);

fs.writeFileSync('src/components/TabList.tsx', code);
