const fs = require('fs');
let code = fs.readFileSync('src/components/RoulettePanel.tsx', 'utf8');

code = code.replace(
  `className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"`,
  `className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12"`
);

fs.writeFileSync('src/components/RoulettePanel.tsx', code);
