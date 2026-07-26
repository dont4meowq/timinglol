const fs = require('fs');

let panel = fs.readFileSync('src/components/RoulettePanel.tsx', 'utf8');

// Replace standard imports to add missing lucide icons
panel = panel.replace(/import \{ ArrowLeft, Dices, Coins \} from 'lucide-react';/, "import { ArrowLeft, Dices, Coins, Plus, Edit2, Trash2, X, Settings } from 'lucide-react';");

// Replace availableRoulettes logic
panel = panel.replace(
  /const availableRoulettes = currentUser\?\.role === 'admin' \? ROULETTES : ROULETTES\.filter\(r => r\.id !== 'money'\);/,
  `
  const { roulettes: customRoulettes, addRoulette, deleteRoulette } = useStore();
  const availableRoulettes = [
    ...(currentUser?.role === 'admin' ? ROULETTES : ROULETTES.filter(r => r.id !== 'money')),
    ...(currentUser?.role === 'admin' ? customRoulettes : customRoulettes.filter(r => !r.isAdminOnly))
  ].map(r => ({...r, icon: r.icon || Dices}));
  
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRoulette, setNewRoulette] = useState({ name: '', prizes: [''], isAdminOnly: false });
  `
);

panel = panel.replace(
  /const activeRoulette = availableRoulettes\.find\(r => r\.id === activeRouletteId\) \|\| availableRoulettes\[0\];/,
  `const activeRoulette = availableRoulettes.find(r => r.id === activeRouletteId) || availableRoulettes[0];
  
  // if active roulette was deleted
  React.useEffect(() => {
    if (!availableRoulettes.find(r => r.id === activeRouletteId)) {
      if (availableRoulettes.length > 0) setActiveRouletteId(availableRoulettes[0].id);
    }
  }, [availableRoulettes, activeRouletteId]);
  `
);

// Add button to header
panel = panel.replace(
  /<div className="flex items-center gap-4">\s*<button\s*onClick=\{\(\) => setAppView\('dashboard'\)\}/,
  `<div className="flex items-center gap-4">
          <button 
            onClick={() => setAppView('dashboard')}
`
);

// Add manage button in header
panel = panel.replace(
  /(\{\s*availableRoulettes\.length > 1 && \(\s*<div className="flex bg-neutral-800 rounded-lg p-1">\s*\{availableRoulettes\.map\(\(roulette\) => \([\s\S]*?<\/div>\s*\)\})/,
  `$1\n        <button onClick={() => setIsManageOpen(true)} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors ml-2"><Settings size={20} /></button>`
);

// Add manage modal
const manageModal = `
      {isManageOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#252526] border border-neutral-700 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-[#1e1e1e]">
              <h2 className="text-lg font-bold text-white">Управление рулетками</h2>
              <button onClick={() => {setIsManageOpen(false); setIsCreating(false);}} className="text-neutral-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
              {!isCreating ? (
                <>
                  <button 
                    onClick={() => { setIsCreating(true); setNewRoulette({ name: '', prizes: [''], isAdminOnly: false }); }}
                    className="w-full mb-4 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                  >
                    <Plus size={18} /> Создать свою рулетку
                  </button>
                  
                  <div className="space-y-2">
                    {customRoulettes.length === 0 && <div className="text-neutral-500 text-center py-4">Нет кастомных рулеток</div>}
                    {customRoulettes.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 bg-[#1e1e1e] border border-neutral-800 rounded-lg">
                        <div>
                          <div className="text-white font-medium flex items-center gap-2">
                            {r.name} 
                            {r.isAdminOnly && <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">Admin Only</span>}
                          </div>
                          <div className="text-xs text-neutral-500">{r.prizes.length} призов</div>
                        </div>
                        {(currentUser?.role === 'admin' || r.authorId === currentUser?.id) && (
                           <button onClick={() => deleteRoulette(r.id)} className="p-2 text-neutral-400 hover:text-red-400 transition-colors"><Trash2 size={16}/></button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1">Название рулетки</label>
                    <input type="text" value={newRoulette.name} onChange={e => setNewRoulette({...newRoulette, name: e.target.value})} className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="Моя рулетка..." />
                  </div>
                  
                  {currentUser?.role === 'admin' && (
                    <label className="flex items-center gap-2 text-neutral-300">
                      <input type="checkbox" checked={newRoulette.isAdminOnly} onChange={e => setNewRoulette({...newRoulette, isAdminOnly: e.target.checked})} className="rounded bg-[#1e1e1e] border-neutral-700" />
                      Только для админов (чаттеры не увидят)
                    </label>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">Призы</label>
                    {newRoulette.prizes.map((p, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={p} onChange={e => {
                          const newPrizes = [...newRoulette.prizes];
                          newPrizes[i] = e.target.value;
                          setNewRoulette({...newRoulette, prizes: newPrizes});
                        }} className="flex-1 bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500" placeholder="Название приза..." />
                        <button onClick={() => {
                          if (newRoulette.prizes.length > 1) {
                             setNewRoulette({...newRoulette, prizes: newRoulette.prizes.filter((_, idx) => idx !== i)});
                          }
                        }} className="p-2 bg-neutral-800 text-neutral-400 hover:text-red-400 rounded transition-colors" disabled={newRoulette.prizes.length === 1}><X size={16} /></button>
                      </div>
                    ))}
                    <button onClick={() => setNewRoulette({...newRoulette, prizes: [...newRoulette.prizes, '']})} className="text-blue-400 text-sm hover:underline flex items-center gap-1 mt-2">
                      <Plus size={14} /> Добавить приз
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                    <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-neutral-400 hover:text-white">Отмена</button>
                    <button 
                      onClick={() => {
                        if (!newRoulette.name || newRoulette.prizes.some(p => !p)) return;
                        addRoulette({
                          name: newRoulette.name,
                          prizes: newRoulette.prizes,
                          isAdminOnly: newRoulette.isAdminOnly,
                          authorId: currentUser!.id
                        });
                        setIsCreating(false);
                      }}
                      disabled={!newRoulette.name || newRoulette.prizes.some(p => !p)}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded transition-colors"
                    >Сохранить</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
`;

panel = panel.replace(/<\/div>\s*<\/div>\s*\);\s*\}/, match => manageModal + match);

fs.writeFileSync('src/components/RoulettePanel.tsx', panel);
