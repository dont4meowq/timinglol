const fs = require('fs');
let content = fs.readFileSync('src/store.ts', 'utf8');

// The rest of the file has:
//   moveNoteToSection: (sectionId, oldIndex, newIndex) => {
//    ...
//  togglePinNote: (id) => set({ activeNoteId: id }),

const start = content.indexOf('moveNoteToSection: (sectionId, oldIndex, newIndex)');
const end = content.indexOf('setSearchQuery: (query)');

if (start !== -1 && end !== -1) {
    content = content.substring(0, start) + content.substring(end);
}

fs.writeFileSync('src/store.ts', content);
