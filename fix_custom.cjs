const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const targetStr = `                  {models.map(m => m.name).filter(m => currentUser?.role === 'admin' || m === currentUser?.assignedModel).map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>`;

const replaceStr = `                  {models.map(m => m.name).filter(m => currentUser?.role === 'admin' || m === currentUser?.assignedModel).map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  <option value="Custom">Другая (ввести вручную)</option>
                </select>`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
