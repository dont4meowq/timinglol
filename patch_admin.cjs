const fs = require('fs');

// Patch AdminPanel
let admin = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const sectionsUpdateRegex = /\s*\/\/ update sections\s*const sectionsQ = query\(collection\(db, 'sections'\), where\('model', '==', oldName\)\);\s*const sectionsSnap = await getDocs\(sectionsQ\);\s*sectionsSnap\.forEach\(d => updateDoc\(d\.ref, \{ model: newName \}\)\);/g;
admin = admin.replace(sectionsUpdateRegex, '');

const sectionsDeleteRegex = /\s*\/\/ delete sections\s*const sectionsQ = query\(collection\(db, 'sections'\), where\('model', '==', m\.name\)\);\s*const sectionsSnap = await getDocs\(sectionsQ\);\s*sectionsSnap\.forEach\(d => deleteDoc\(d\.ref\)\);/g;
admin = admin.replace(sectionsDeleteRegex, '');

admin = admin.replace(/setAppView\('dashboard'\)/g, "setAppView('crm')");

fs.writeFileSync('src/components/AdminPanel.tsx', admin);

// Patch BonusesPanel
let bonuses = fs.readFileSync('src/components/BonusesPanel.tsx', 'utf8');
bonuses = bonuses.replace(/setAppView\('dashboard'\)/g, "setAppView('crm')");
fs.writeFileSync('src/components/BonusesPanel.tsx', bonuses);

// Patch RoulettePanel
let roulette = fs.readFileSync('src/components/RoulettePanel.tsx', 'utf8');
roulette = roulette.replace(/setAppView\('dashboard'\)/g, "setAppView('crm')");
fs.writeFileSync('src/components/RoulettePanel.tsx', roulette);

// Patch SchedulePanel (just in case)
let schedule = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');
schedule = schedule.replace(/setAppView\('dashboard'\)/g, "setAppView('crm')");
fs.writeFileSync('src/components/SchedulePanel.tsx', schedule);

// Patch GuidesPanel
let guides = fs.readFileSync('src/components/GuidesPanel.tsx', 'utf8');
guides = guides.replace(/setAppView\('dashboard'\)/g, "setAppView('crm')");
fs.writeFileSync('src/components/GuidesPanel.tsx', guides);

// Patch ContestsPanel
let contests = fs.readFileSync('src/components/ContestsPanel.tsx', 'utf8');
contests = contests.replace(/setAppView\('dashboard'\)/g, "setAppView('crm')");
fs.writeFileSync('src/components/ContestsPanel.tsx', contests);

// Patch CustomsPanel
let customs = fs.readFileSync('src/components/CustomsPanel.tsx', 'utf8');
customs = customs.replace(/setAppView\('dashboard'\)/g, "setAppView('crm')");
fs.writeFileSync('src/components/CustomsPanel.tsx', customs);

