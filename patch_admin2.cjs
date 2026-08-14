const fs = require('fs');

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

if (!code.includes('const [newTeamId, setNewTeamId]')) {
  // Insert state
  code = code.replace(
    "const [newModelName, setNewModelName] = useState('');",
    "const [newModelName, setNewModelName] = useState('');\n  const [newTeamId, setNewTeamId] = useState('');"
  );
  
  // Modify newUserObj creation
  code = code.replace(
    `const newUserObj = {
        id: uid,
        email: newLogin,
        name: newName,
        role,
        ...(role === 'chatter' ? { assignedModel: assignedModel.trim() } : {}),
        teamId: currentUser?.teamId
      };`,
    `const newUserObj = {
        id: uid,
        email: newLogin,
        name: newName,
        role,
        ...(role === 'chatter' ? { assignedModel: assignedModel.trim() } : {}),
        teamId: currentUser?.role === 'superadmin' && newTeamId.trim() ? newTeamId.trim() : currentUser?.teamId
      };`
  );
  
  // Add input for teamId in the form if superadmin
  const insertIndex = code.indexOf(`{role === 'chatter' && (`);
  if (insertIndex !== -1) {
    const inputHtml = `
                {currentUser?.role === 'superadmin' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-neutral-400">ID Команды (для суперадмина)</label>
                    <input 
                      type="text"
                      value={newTeamId}
                      onChange={e => setNewTeamId(e.target.value)}
                      placeholder="team_name"
                      className="bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </div>
                )}
    `;
    code = code.slice(0, insertIndex) + inputHtml + code.slice(insertIndex);
  }
  
  fs.writeFileSync('src/components/AdminPanel.tsx', code);
  console.log('AdminPanel patched for superadmin team selection');
}
