import React, { useState } from 'react';
import { useStore } from '../store';
import { ArrowLeft, Dices, Coins } from 'lucide-react';

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
  const availableRoulettes = currentUser?.role === 'admin' ? ROULETTES : ROULETTES.filter(r => r.id !== 'money');
  const [activeRouletteId, setActiveRouletteId] = useState<string>(availableRoulettes[0].id);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const activeRoulette = availableRoulettes.find(r => r.id === activeRouletteId) || availableRoulettes[0];
  const prizes = activeRoulette.prizes;

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    const prizeIndex = Math.floor(Math.random() * prizes.length);
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
            onClick={() => setAppView('dashboard')}
            className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <Dices size={20} className="text-pink-400" />
            Рулетка
          </h1>
        </div>
        {availableRoulettes.length > 1 && (
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
                <roulette.icon size={16} className={activeRouletteId === roulette.id ? "text-pink-400" : ""} />
                {roulette.name}
              </button>
            ))}
          </div>
        )}
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
          className="mt-12 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-[#1e1e1e] border border-neutral-700 text-white text-2xl font-black px-16 py-5 rounded-full transition-all group-hover:scale-105 disabled:group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center gap-3">
            <activeRoulette.icon size={28} className={isSpinning ? "animate-spin text-pink-400" : "text-pink-400"} />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              {isSpinning ? 'Крутится...' : 'КРУТИТЬ!'}
            </span>
          </div>
        </button>

        <div className={`mt-8 text-2xl text-center transition-all duration-500 ${winner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-neutral-400 text-sm font-medium uppercase tracking-widest mb-2">Выпало:</div>
          <div className="font-bold text-pink-400 px-6 py-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)] inline-block">
            {winner || '\u00A0'}
          </div>
        </div>
      </div>
    </div>
  );
}
