const fs = require('fs');
let code = fs.readFileSync('src/components/RoulettePanel.tsx', 'utf8');

const target = `        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="mt-12 bg-pink-600 hover:bg-pink-700 text-white text-xl font-bold px-12 py-4 rounded-full shadow-lg hover:shadow-pink-500/20 transition-all disabled:opacity-50 disabled:scale-95 disabled:cursor-not-allowed uppercase tracking-wider relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
          {isSpinning ? 'Крутится...' : 'Крутить!'}
        </button>`;

const replacement = `        <button
          onClick={spinWheel}
          disabled={isSpinning}
          className="mt-12 relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-[#1e1e1e] border border-neutral-700 text-white text-2xl font-black px-16 py-5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center gap-3">
            <Dices size={28} className={isSpinning ? "animate-spin text-pink-400" : "text-pink-400"} />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-sm">
              {isSpinning ? 'Крутится...' : 'КРУТИТЬ!'}
            </span>
          </div>
        </button>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/RoulettePanel.tsx', code);
