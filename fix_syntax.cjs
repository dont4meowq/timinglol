const fs = require('fs');
let code = fs.readFileSync('src/components/RoulettePanel.tsx', 'utf8');

code = code.replace(
  "const d = \\`M \\${cx} \\${cy} L \\${x1} \\${y1} A \\${r} \\${r} 0 \\${largeArc} 1 \\${x2} \\${y2} Z\\`;",
  "const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;"
);

code = code.replace(
  "transform: \\`rotate(\\${rotation}deg)\\`",
  "transform: `rotate(${rotation}deg)`"
);

code = code.replace(
  "transform: \\`rotate(\\${angle}deg)\\`,",
  "transform: `rotate(${angle}deg)`,"
);

code = code.replace(
  "className={\\`mt-8 text-2xl text-center transition-all duration-500 \\${winner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}\\`}",
  "className={`mt-8 text-2xl text-center transition-all duration-500 ${winner ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}"
);

fs.writeFileSync('src/components/RoulettePanel.tsx', code);
