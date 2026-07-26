const fs = require('fs');
let code = fs.readFileSync('src/store.ts', 'utf8');

// add import of Contest
code = code.replace(/import {([^}]+)} from '\.\/types';/, (match, group1) => {
  if (!group1.includes('Contest')) {
    return `import {${group1}, Contest} from './types';`;
  }
  return match;
});

// add state typing
code = code.replace(/guides: Guide\[\];/, "guides: Guide[];\n  contests: Contest[];");

// add actions typing
code = code.replace(/setGuides: \(guides: Guide\[\]\) => void;/, "setGuides: (guides: Guide[]) => void;\n  setContests: (contests: Contest[]) => void;");
code = code.replace(/toggleGuideLike: \(id: string, userId: string\) => void;/, "toggleGuideLike: (id: string, userId: string) => void;\n  addContest: (contest: Omit<Contest, 'id' | 'likes' | 'createdAt'>) => void;\n  updateContest: (id: string, updates: Partial<Contest>) => void;\n  deleteContest: (id: string) => void;\n  toggleContestLike: (id: string, userId: string) => void;");

// add initial state
code = code.replace(/guides: \[\],/, "guides: [],\n  contests: [],");

// add actions implementation
code = code.replace(/setGuides: \(guides\) => set\(\{ guides \}\),/, "setGuides: (guides) => set({ guides }),\n  setContests: (contests) => set({ contests }),");

const contestActions = `
  addContest: (contest) => {
    const id = generateId();
    const obj = { ...contest, id, likes: [], createdAt: Date.now() };
    setDoc(doc(db, \`contests/\${id}\`), obj).catch(console.error);
    set((state) => ({ contests: [...state.contests, obj] }));
  },
  updateContest: (id, updates) => {
    updateDoc(doc(db, \`contests/\${id}\`), updates).catch(console.error);
    set((state) => ({ contests: state.contests.map(c => c.id === id ? { ...c, ...updates } : c) }));
  },
  deleteContest: (id) => {
    deleteDoc(doc(db, \`contests/\${id}\`)).catch(console.error);
    set((state) => ({ contests: state.contests.filter(c => c.id !== id) }));
  },
  toggleContestLike: (id, userId) => {
    const contest = get().contests.find(c => c.id === id);
    if (!contest) return;
    const isLiked = contest.likes.includes(userId);
    const newLikes = isLiked ? contest.likes.filter(u => u !== userId) : [...contest.likes, userId];
    updateDoc(doc(db, \`contests/\${id}\`), { likes: newLikes }).catch(console.error);
    set((state) => ({ contests: state.contests.map(c => c.id === id ? { ...c, likes: newLikes } : c) }));
  },
`;

code = code.replace(/toggleGuideLike: \(id, userId\) => \{[\s\S]*?\},/, (match) => match + contestActions);

fs.writeFileSync('src/store.ts', code);
