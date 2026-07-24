const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

code = code.replace(/\{(\['Nana Waifu'[^\]]+\])\.filter/g, "{models.map(m => m.name).filter");

if (!code.includes('const { dayOffs, addDayOff, deleteDayOff, currentUser, models }')) {
  code = code.replace(/const \{ dayOffs, addDayOff, deleteDayOff, currentUser \} = useStore\(\);/, "const { dayOffs, addDayOff, deleteDayOff, currentUser, models } = useStore();");
}
code = code.replace(/setSelectedModel\('Nana Waifu'\);/, "setSelectedModel(models[0]?.name || '');");

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
