const fs = require('fs');
let content = fs.readFileSync('src/store.ts', 'utf8');

// Remove Section, Note from imports
content = content.replace(/Section,\s*Note,\s*/g, '');

// Remove section state properties
content = content.replace(/\s*sections: Section\[\];/g, '');
content = content.replace(/\s*activeSectionId: string \| null;/g, '');
content = content.replace(/\s*activeNoteId: string \| null;/g, '');

// Remove section action declarations
const actionDeclarationsToRemove = [
    'setSections: (sections: Section[]) => void;',
    'addSection: (id: string, title: string, model: string) => void;',
    'updateSection: (id: string, title: string) => void;',
    'deleteSection: (id: string) => void;',
    'reorderSections: (oldIndex: number, newIndex: number) => void;',
    'toggleSectionCollapse: (id: string) => void;',
    'setActiveSection: (id: string) => void;',
    'addNote: (sectionId: string, title: string) => void;',
    'updateNote: (sectionId: string, noteId: string, updates: Partial<Note>) => void;',
    'deleteNote: (sectionId: string, noteId: string) => void;',
    'moveNoteToSection: (noteId: string, fromSectionId: string, toSectionId: string) => void;',
    'reorderNotes: (sectionId: string, oldIndex: number, newIndex: number) => void;',
    'togglePinNote: (sectionId: string, noteId: string) => void;',
    'setActiveNote: (id: string) => void;'
];

for (const dec of actionDeclarationsToRemove) {
    // Regex escape
    const escaped = dec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(new RegExp('\\s*' + escaped, 'g'), '');
}

// Remove from initial state
content = content.replace(/\s*sections: \[\],/g, '');
content = content.replace(/\s*activeSectionId: null,/g, '');
content = content.replace(/\s*activeNoteId: null,/g, '');

// Change default appView from 'dashboard' to 'crm'
content = content.replace(/appView: 'dashboard',/g, "appView: 'crm',");

// Change type appView
content = content.replace(/appView: 'dashboard' \|/g, 'appView:');
content = content.replace(/view: 'dashboard' \|/g, "view:");

// The block from `setSections: (sections) => {` all the way to the end has all the actions.
// We can use a regex to replace these blocks, but it might be safer to string manipulate.
const actionsToRemove = [
    /setSections: \([\s\S]*?addFan:/,
    /addSection: \([\s\S]*?updateSection:/,
    /updateSection: \([\s\S]*?deleteSection:/,
    /deleteSection: \([\s\S]*?reorderSections:/,
    /reorderSections: \([\s\S]*?toggleSectionCollapse:/,
    /toggleSectionCollapse: \([\s\S]*?setActiveSection:/,
    /setActiveSection: \([\s\S]*?addNote:/,
    /addNote: \([\s\S]*?updateNote:/,
    /updateNote: \([\s\S]*?deleteNote:/,
    /deleteNote: \([\s\S]*?moveNoteToSection:/,
    /moveNoteToSection: \([\s\S]*?reorderNotes:/,
    /reorderNotes: \([\s\S]*?togglePinNote:/,
    /togglePinNote: \([\s\S]*?setActiveNote:/,
    /setActiveNote: \(id\) => set\(\{ activeNoteId: id \}\),/
];

for (const regex of actionsToRemove) {
    content = content.replace(regex, (match) => {
        // extract the part that belongs to the next action
        if (match.includes('addFan:')) return 'addFan:';
        if (match.includes('updateSection:')) return 'updateSection:';
        if (match.includes('deleteSection:')) return 'deleteSection:';
        if (match.includes('reorderSections:')) return 'reorderSections:';
        if (match.includes('toggleSectionCollapse:')) return 'toggleSectionCollapse:';
        if (match.includes('setActiveSection:')) return 'setActiveSection:';
        if (match.includes('addNote:')) return 'addNote:';
        if (match.includes('updateNote:')) return 'updateNote:';
        if (match.includes('deleteNote:')) return 'deleteNote:';
        if (match.includes('moveNoteToSection:')) return 'moveNoteToSection:';
        if (match.includes('reorderNotes:')) return 'reorderNotes:';
        if (match.includes('togglePinNote:')) return 'togglePinNote:';
        if (match.includes('setActiveNote:')) return 'setActiveNote:';
        return '';
    });
}
content = content.replace(/setActiveNote: \(id\) => set\(\{ activeNoteId: id \}\),/, '');

fs.writeFileSync('src/store.ts', content);
