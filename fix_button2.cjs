const fs = require('fs');
let code = fs.readFileSync('src/components/RoulettePanel.tsx', 'utf8');

code = code.replace(
  "className=\"relative bg-[#1e1e1e] border border-neutral-700 text-white text-2xl font-black px-16 py-5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center gap-3\"",
  "className=\"relative bg-[#1e1e1e] border border-neutral-700 text-white text-2xl font-black px-16 py-5 rounded-full transition-all group-hover:scale-105 disabled:group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest flex items-center gap-3\""
);

fs.writeFileSync('src/components/RoulettePanel.tsx', code);
