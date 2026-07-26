const fs = require('fs');

let panel = fs.readFileSync('src/components/ContestsPanel.tsx', 'utf8');
panel = panel.replace(/GuidesPanel/g, 'ContestsPanel');
panel = panel.replace(/guides/g, 'contests');
panel = panel.replace(/Guide/g, 'Contest');
panel = panel.replace(/guide/g, 'contest');
panel = panel.replace(/Гайды/g, 'Конкурсы');
panel = panel.replace(/Гайд/g, 'Конкурс');
panel = panel.replace(/гайд/g, 'конкурс');
panel = panel.replace(/Гайдов/g, 'Конкурсов');
fs.writeFileSync('src/components/ContestsPanel.tsx', panel);

let post = fs.readFileSync('src/components/ContestPost.tsx', 'utf8');
post = post.replace(/GuidePost/g, 'ContestPost');
post = post.replace(/guides/g, 'contests');
post = post.replace(/Guide/g, 'Contest');
post = post.replace(/guide/g, 'contest');
fs.writeFileSync('src/components/ContestPost.tsx', post);

