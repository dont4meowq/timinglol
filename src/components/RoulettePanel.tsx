import React, { useState } from 'react';
import { useStore } from '../store';
import { ArrowLeft, Dices, Coins, Plus, Edit2, Trash2, X, Settings, ChevronDown } from 'lucide-react';

const ROULETTES = [
  {
    id: 'classic',
    name: 'Классическая',
    icon: Dices,
    prizes: [
      "Sexy photo ❤️",
      "Voice message 🎤",
      "Sign Photo 🖊",
      "Dickrate 🍆",
      "Video 1 minute 📺",
      "Sexting 5 minutes 🔥",
      "Video 5 minute 📺",
      "Sexting 10 minutes 🔥🔥",
      "Video 10 minute 📺",
      "Sexting 15 minutes 💦",
      "Secret prize 🎁",
      "Videochat 5 minute 📹",
      "Videochat 10 minute 🎬",
      "Custom video 🎞",
      "VIP Access 👑"
    ]
  },
  {
    id: 'money',
    name: 'Денежная',
    icon: Coins,
    prizes: [
      "+5$",
      "+10$",
      "+2$",
      "0 (unlucky)",
      "+2$",
      "+5$",
      "0 (unlucky)",
      "+10$",
      "+2$"
    ]
  }
];

const colors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', 
  '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#ec4899', 
  '#10b981', '#14b8a6', '#6366f1', '#84cc16', '#a855f7'
];

export function RoulettePanel() {
  const { setAppView, currentUser } = useStore();
  
  const { roulettes: customRoulettes, addRoulette, deleteRoulette } = useStore();
  const availableRoulettes = [
    ...(currentUser?.role === 'admin' ? ROULETTES : ROULETTES.filter(r => r.id !== 'money')),
    ...(currentUser?.role === 'admin' ? customRoulettes : customRoulettes.filter(r => !r.isAdminOnly))
  ].map(r => ({...r, icon: (r as any).icon || Dices}));
  
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newRoulette, setNewRoulette] = useState({ name: '', prizes: [''], isAdminOnly: false });
  
  const [activeRouletteId, setActiveRouletteId] = useState<string>(availableRoulettes[0].id);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [podkrutkaIndex, setPodkrutkaIndex] = useState<number | -1>(-1);

  const activeRoulette = availableRoulettes.find(r => r.id === activeRouletteId) || availableRoulettes[0];
  
  // if active roulette was deleted
  React.useEffect(() => {
    if (!availableRoulettes.find(r => r.id === activeRouletteId)) {
      if (availableRoulettes.length > 0) setActiveRouletteId(availableRoulettes[0].id);
    }
  }, [availableRoulettes, activeRouletteId]);
  
  const prizes = activeRoulette.prizes;

  const isAdminWheel = activeRoulette.id === 'money' || (activeRoulette as any).isAdminOnly;
  const canSeePodkrutka = !isAdminWheel || currentUser?.role === 'admin';

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    const prizeIndex = podkrutkaIndex !== -1 ? podkrutkaIndex : Math.floor(Math.random() * prizes.length);
    setPodkrutkaIndex(-1);
    
    const sliceAngle = 360 / prizes.length;
    
    const targetBase = 360 * 5; 
    const currentMod = rotation % 360;
    const sliceMiddle = (prizeIndex + 0.5) * sliceAngle;
    const offset = 360 - sliceMiddle;
    
    // Add randomness so it doesn't always land exactly in the middle of the slice
    const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.8);
    
    const newRotation = rotation + (360 - currentMod) + targetBase + offset + randomOffset;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(prizes[prizeIndex]);
    }, 5000); 
  };

  const createPie = (cx: number, cy: number, r: number, slices: number) => {
    let pathList = [];
    for (let i = 0; i < slices; i++) {
      const startAngle = (i * 360) / slices;
      const endAngle = ((i + 1) * 360) / slices;

      const x1 = cx + r * Math.cos((Math.PI * startAngle) / 180);
      const y1 = cy + r * Math.sin((Math.PI * startAngle) / 180);
      
      const x2 = cx + r * Math.cos((Math.PI * endAngle) / 180);
      const y2 = cy + r * Math.sin((Math.PI * endAngle) / 180);

      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      pathList.push({ d, fill: colors[i % colors.length] });
    }
    return pathList;
  };

  const sliceAngle = 360 / prizes.length;
  
  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
      <div className="h-14 flex items-center px-4 border-b border-neutral-800 shrink-0 gap-4 justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setAppView('schedule')}

            className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <Dices size={20} className="text-pink-400" />
            Рулетка
          </h1>
        </div>
        {availableRoulettes.length > 3 ? (
          <div className="relative">
            <button
              disabled={isSpinning}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              <activeRoulette.icon size={16} className="text-pink-400" />
              <span className="max-w-[120px] truncate">{activeRoulette.name}</span>
              <ChevronDown size={16} className="text-neutral-400 ml-1" />
            </button>
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute top-full mt-2 w-56 bg-[#252526] border border-neutral-700 rounded-lg shadow-xl overflow-y-auto max-h-64 z-20 custom-scrollbar right-0 sm:right-auto">
                  {availableRoulettes.map(roulette => (
                    <button
                      key={roulette.id}
                      onClick={() => {
                        setActiveRouletteId(roulette.id);
                        setWinner(null);
                        setRotation(0);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 text-left text-sm transition-colors ${
                        activeRouletteId === roulette.id
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                      }`}
                    >
                      <roulette.icon size={16} className={activeRouletteId === roulette.id ? "text-pink-400 shrink-0" : "shrink-0"} />
                      <span className="truncate">{roulette.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : availableRoulettes.length > 1 ? (
          <div className="flex bg-neutral-800 rounded-lg p-1">
            {availableRoulettes.map((roulette) => (
              <button
                key={roulette.id}
                disabled={isSpinning}
                onClick={() => {
                  setActiveRouletteId(roulette.id);
                  setWinner(null);
                  setRotation(0);
                }}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeRouletteId === roulette.id 
                    ? 'bg-neutral-700 text-white shadow' 
                    : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <roulette.icon size={16} className={activeRouletteId === roulette.id ? "text-pink-400 shrink-0" : "shrink-0"} />
                {roulette.name}
              </button>
            ))}
          </div>
        ) : null}
        <button onClick={() => setIsManageOpen(true)} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors ml-2"><Settings size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8 relative">
        <div className="relative flex items-center justify-center max-w-full" style={{ width: '400px', height: '400px' }}>
          {/* Pointer */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-0 h-0 
            border-y-[15px] border-y-transparent 
            border-r-[25px] border-r-white drop-shadow-xl" 
          />

          <div 
            className="w-full h-full rounded-full overflow-hidden border-8 border-[#2a2d2e] shadow-2xl relative"
            style={{ 
              transition: 'transform 5s cubic-bezier(0.15, 0.85, 0.15, 1)',
              transform: `rotate(${rotation}deg)`
            }}
          >
            <svg viewBox="0 0 500 500" className="w-full h-full">
              {createPie(250, 250, 250, prizes.length).map((slice, i) => (
                <path key={i} d={slice.d} fill={slice.fill} stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
              ))}
            </svg>

            {/* Text rendering */}
            <div className="absolute inset-0">
              {prizes.map((prize, i) => {
                const angle = (i + 0.5) * sliceAngle;
                return (
                  <div 
                    key={i} 
                    className="absolute w-full h-full flex items-center justify-end font-bold text-white pr-6 drop-shadow-md whitespace-nowrap"
                    style={{
                      transformOrigin: '50% 50%',
                      transform: `rotate(${angle}deg)`,
                      textShadow: '1px 1px 3px rgba(0,0,0,0.9)',
                      fontSize: prizes.length > 10 ? '13px' : '16px'
                    }}
                  >
                    {prize}
                  </div>
                )
              })}
            </div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#2a2d2e] rounded-full border-4 border-neutral-700 z-10 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
              <activeRoulette.icon size={20} className="text-pink-400" />
            </div>
          </div>
        </div>

        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="mt-6 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-[#1e1e1e] border border-neutral-700 text-white text-2xl font-black px-16 py-5 rounded-full transition-all group-hover:scale-105 disabled:group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center gap-3">
            <activeRoulette.icon size={28} className={isSpinning ? "animate-spin text-pink-400" : "text-pink-400"} />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              {isSpinning ? 'SPINNING...' : 'SPIN!'}
            </span>
          </div>
        </button>

        <div className={`mt-8 text-2xl text-center transition-all duration-500 ${winner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-widest mb-2">Выпало:</div>
          <div className="font-bold text-pink-400 px-6 py-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)] inline-block">
            {winner || '\u00A0'}
          </div>
        </div>

        {canSeePodkrutka && (
          <div className="mt-8 relative z-10 w-full max-w-xs mx-auto">
            <select
              className="w-full bg-[#252526] border border-neutral-700 text-neutral-400 text-sm rounded-lg px-3 py-2 outline-none focus:border-pink-500 transition-colors"
              value={podkrutkaIndex}
              onChange={(e) => setPodkrutkaIndex(Number(e.target.value))}
              disabled={isSpinning}
            >
              <option value={-1}>Случайный выбор (Честно)</option>
              {prizes.map((prize, i) => (
                <option key={i} value={i}>
                  Выпадет: {prize}
                </option>
              ))}
            </select>
          </div>
        )}
      
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
</div>
    </div>
  );
}
