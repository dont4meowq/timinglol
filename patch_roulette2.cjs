const fs = require('fs');
let code = fs.readFileSync('src/components/RoulettePanel.tsx', 'utf8');

// Add ChevronDown
code = code.replace(/import \{ ArrowLeft, Dices, Coins, Plus, Edit2, Trash2, X, Settings \} from 'lucide-react';/, "import { ArrowLeft, Dices, Coins, Plus, Edit2, Trash2, X, Settings, ChevronDown } from 'lucide-react';");

// Add state for dropdown
code = code.replace(/const \[isCreating, setIsCreating\] = useState\(false\);/, "const [isCreating, setIsCreating] = useState(false);\n  const [isDropdownOpen, setIsDropdownOpen] = useState(false);");

// Replace the roulette selection logic
const oldSelection = `{availableRoulettes.length > 1 && (
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
                className={\`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all \${
                  activeRouletteId === roulette.id 
                    ? 'bg-neutral-700 text-white shadow' 
                    : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50'
                } disabled:opacity-50 disabled:cursor-not-allowed\`}
              >
                <roulette.icon size={16} className={activeRouletteId === roulette.id ? "text-pink-400" : ""} />
                {roulette.name}
              </button>
            ))}
          </div>
        )}`;

const newSelection = `{availableRoulettes.length > 3 ? (
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
                      className={\`w-full flex items-center gap-2 px-4 py-3 text-left text-sm transition-colors \${
                        activeRouletteId === roulette.id
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                      }\`}
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
                className={\`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all \${
                  activeRouletteId === roulette.id 
                    ? 'bg-neutral-700 text-white shadow' 
                    : 'text-neutral-400 hover:text-neutral-300 hover:bg-neutral-800/50'
                } disabled:opacity-50 disabled:cursor-not-allowed\`}
              >
                <roulette.icon size={16} className={activeRouletteId === roulette.id ? "text-pink-400 shrink-0" : "shrink-0"} />
                {roulette.name}
              </button>
            ))}
          </div>
        ) : null}`;

// The script might have exact whitespace differences, let's use a smarter replace
// We will replace from {availableRoulettes.length > 1 && ( to )}
code = code.replace(/\{\s*availableRoulettes\.length > 1 && \(\s*<div className="flex bg-neutral-800 rounded-lg p-1">[\s\S]*?<\/div>\s*\)\s*\}/, newSelection);

fs.writeFileSync('src/components/RoulettePanel.tsx', code);
