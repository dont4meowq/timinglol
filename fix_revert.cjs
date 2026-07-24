const fs = require('fs');

const revert = (file, replacements) => {
  let code = fs.readFileSync(file, 'utf8');
  for (const [t, r] of replacements) {
    code = code.replace(t, r);
  }
  fs.writeFileSync(file, code);
};

// CrmPanel.tsx
revert('src/components/CrmPanel.tsx', [
  [
    `if(confirm('Удалить фаната?')) deleteFan(fan.id);`,
    `deleteFan(fan.id);`
  ],
  [
    `if(confirm('Удалить фаната?')) {
                      deleteFan(viewingFan.id);
                      setViewingFan(null);
                    }`,
    `deleteFan(viewingFan.id);
                      setViewingFan(null);`
  ]
]);

// AdminPanel.tsx
revert('src/components/AdminPanel.tsx', [
  [
    `if(confirm('Удалить пользователя?')) handleDeleteUser(user.id, user.name);`,
    `handleDeleteUser(user.id, user.name);`
  ],
  [
    `if(confirm('Удалить анкету? Это не удалит связанные данные!')) handleDeleteModel(m.id);`,
    `handleDeleteModel(m.id);`
  ]
]);

// Sidebar.tsx
revert('src/components/Sidebar.tsx', [
  [
    `if(confirm('Удалить раздел и все вкладки в нем?')) { deleteSection(section.id); setMenuOpenId(null); }`,
    `deleteSection(section.id); setMenuOpenId(null);`
  ],
  [
    `if(confirm('Удалить вкладку?')) { deleteNote(section.id, note.id); setNoteMenuOpenId(null); }`,
    `deleteNote(section.id, note.id); setNoteMenuOpenId(null);`
  ]
]);

// TabList.tsx
revert('src/components/TabList.tsx', [
  [
    `if(confirm('Удалить вкладку?')) deleteNote(activeSection.id, note.id);`,
    `deleteNote(activeSection.id, note.id);`
  ],
  [
    `if(confirm('Удалить вкладку?')) {
                deleteNote(activeSection.id, menuOpenId);
              }`,
    `deleteNote(activeSection.id, menuOpenId);`
  ]
]);

// SchedulePanel.tsx
revert('src/components/SchedulePanel.tsx', [
  [
    `if(confirm('Удалить выходной?')) deleteDayOff(dayOff.id);`,
    `deleteDayOff(dayOff.id);`
  ]
]);

console.log("Done");
