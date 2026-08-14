const fs = require('fs');

let code = fs.readFileSync('src/components/BonusesPanel.tsx', 'utf8');

// We add an option in the sidebar for "Топ чаттеров"
code = code.replace(
  `{chatters.map(chatter => (`,
  `<button
                onClick={() => setSelectedUserId('top')}
                className={\`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between \${
                  selectedUserId === 'top' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-purple-400 hover:bg-purple-900/20'
                } mb-2\`}
              >
                <span className="font-semibold">🏆 Топ чаттеров</span>
              </button>
            {chatters.map(chatter => (`
);

// We need to render the top chatters when selectedUser === 'top'
const topChattersRender = `
          {selectedUserId === 'top' ? (
            <div className="flex-1 flex flex-col p-6">
              <div className="border-b border-neutral-800 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Gift className="text-purple-400" /> Топ чаттеров по бонусам
                </h2>
                <p className="text-neutral-400 text-sm mt-1">Рейтинг сотрудников на основе начисленных бонусов</p>
              </div>
              <div className="bg-[#252526] rounded-xl border border-neutral-700 overflow-hidden flex-1 flex flex-col">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-700 bg-[#1e1e1e] font-medium text-neutral-400 text-sm">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-7">Чаттер</div>
                  <div className="col-span-4 text-right">Сумма бонусов</div>
                </div>
                <div className="overflow-y-auto p-2 space-y-1">
                  {chatters
                    .map(c => ({
                      ...c,
                      total: bonuses.filter(b => b.userId === c.id).reduce((sum, b) => sum + b.amount, 0)
                    }))
                    .sort((a, b) => b.total - a.total)
                    .map((c, idx) => (
                      <div key={c.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-[#2a2d2e] rounded-lg transition-colors">
                        <div className="col-span-1 text-center font-bold text-neutral-500">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </div>
                        <div className="col-span-7 font-medium text-white">{c.name}</div>
                        <div className={\`col-span-4 text-right font-bold \${c.total > 0 ? 'text-emerald-400' : c.total < 0 ? 'text-red-400' : 'text-neutral-500'}\`}>
                          {c.total > 0 ? '+' : ''}\${c.total.toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : selectedUser ? (
`;

code = code.replace(`          {selectedUser ? (`, topChattersRender);

// Wait, the "initialSelected" logic should handle this.
// `const selectedUser = chatters.find(c => c.id === selectedUserId);`
// If selectedUserId is 'top', selectedUser is undefined.
fs.writeFileSync('src/components/BonusesPanel.tsx', code);
console.log("Top chatters patched");
