const fs = require('fs');
let content = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

// Remove setSections
content = content.replace(/\s*setSections,/g, '');

const sectionsBlock = `    // Sections: Everyone sees all
    const sectionsQuery = collection(db, 'sections');
    unsubs.push(
      onSnapshot(sectionsQuery, (snap) => {
        // Sort sections by order
        const sections = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        sections.sort((a, b) => (a.order || 0) - (b.order || 0));
        setSections(sections);
      })
    );`;

// Regex replacement or exact string replacement
content = content.replace(sectionsBlock, '');
fs.writeFileSync('src/hooks/useFirebaseSync.ts', content);
