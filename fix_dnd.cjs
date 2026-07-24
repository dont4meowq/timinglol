const fs = require('fs');

let tabList = fs.readFileSync('src/components/TabList.tsx', 'utf8');
tabList = tabList.replace("if (active.id !== over.id) {", "if (over && active.id !== over.id) {");
fs.writeFileSync('src/components/TabList.tsx', tabList);

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace("if (active.id !== over.id) {", "if (over && active.id !== over.id) {");
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

console.log("Done");
