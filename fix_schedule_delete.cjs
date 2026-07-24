const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const t = `                <button 
                  onClick={(e) => { e.stopPropagation(); deleteDayOff(dayOff.id); }}
                  className="opacity-0 group-hover/item:opacity-100 hover:text-white transition-opacity shrink-0 ml-1"
                  title="Удалить"
                >`;
const r = `                <button 
                  onClick={(e) => { e.stopPropagation(); if(confirm('Удалить выходной?')) deleteDayOff(dayOff.id); }}
                  className="opacity-0 group-hover/item:opacity-100 hover:text-white transition-opacity shrink-0 ml-1"
                  title="Удалить"
                >`;
code = code.replace(t, r);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
