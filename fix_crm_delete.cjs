const fs = require('fs');
let code = fs.readFileSync('src/components/CrmPanel.tsx', 'utf8');

const t1 = `                  <button onClick={(e) => { e.stopPropagation(); deleteFan(fan.id); }} className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors" title="Удалить">`;
const r1 = `                  <button onClick={(e) => { e.stopPropagation(); if(confirm('Удалить фаната?')) deleteFan(fan.id); }} className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-900/30 rounded transition-colors" title="Удалить">`;
code = code.replace(t1, r1);

const t2 = `                  <button onClick={() => {
                    deleteFan(viewingFan.id);
                    setViewingFan(null);
                  }} className="p-2 bg-neutral-800 hover:bg-red-900/30 text-neutral-400 hover:text-red-400 rounded-lg transition-colors" title="Удалить">`;
const r2 = `                  <button onClick={() => {
                    if(confirm('Удалить фаната?')) {
                      deleteFan(viewingFan.id);
                      setViewingFan(null);
                    }
                  }} className="p-2 bg-neutral-800 hover:bg-red-900/30 text-neutral-400 hover:text-red-400 rounded-lg transition-colors" title="Удалить">`;
code = code.replace(t2, r2);

fs.writeFileSync('src/components/CrmPanel.tsx', code);
