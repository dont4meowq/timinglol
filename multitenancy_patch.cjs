const fs = require('fs');

// Patch types.ts to add teamId to everything
let typesCode = fs.readFileSync('src/types.ts', 'utf8');
const interfaces = ['Custom', 'DayOff', 'ModelInfo', 'GuideFolder', 'Guide', 'GuideComment', 'Bonus', 'Contest', 'ContestComment', 'Roulette'];
for (const intf of interfaces) {
  const regex = new RegExp(`export interface ${intf} \\{`, 'g');
  typesCode = typesCode.replace(regex, `export interface ${intf} {\n  teamId?: string;`);
}
fs.writeFileSync('src/types.ts', typesCode);

// Patch store.ts
let storeCode = fs.readFileSync('src/store.ts', 'utf8');

// For every add function, inject teamId: get().currentUser?.teamId
const addFns = [
  { name: 'addGuideFolder', defaultObj: '...folder' },
  { name: 'addRoulette', defaultObj: '...roulette' },
  { name: 'addBonus', defaultObj: '...bonus' },
  { name: 'addGuide', defaultObj: '...guide, createdAt: Date.now(), likes: []' },
  { name: 'addContest', defaultObj: '...contest, createdAt: Date.now(), likes: []' },
  { name: 'addCustom', defaultObj: '...custom, createdAt: Date.now()' },
  { name: 'addDayOff', defaultObj: '...dayOff' },
];

for (const fn of addFns) {
  const findStr = `const obj = { ${fn.defaultObj}, id };`;
  const findStr2 = `const obj = { ${fn.defaultObj}, id,`;
  // Let's use regex to replace const obj = { ... };
  const blockRegex = new RegExp(`(${fn.name}:\\s*\\([a-zA-Z_]+\\)\\s*=>\\s*\\{[\\s\\S]*?const\\s+obj\\s*=\\s*\\{)([^}]+)(\\};)`, 'm');
  storeCode = storeCode.replace(blockRegex, (match, p1, p2, p3) => {
    return `${p1}${p2}, teamId: get().currentUser?.teamId${p3}`;
  });
}
fs.writeFileSync('src/store.ts', storeCode);
console.log('Patched types and store');
