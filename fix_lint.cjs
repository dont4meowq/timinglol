const fs = require('fs');

// 1. ContestsPanel
let contests = fs.readFileSync('src/components/ContestsPanel.tsx', 'utf8');
contests = contests.replace('Plus, Edit2, Trash2, Heart, MessageSquare, Send, X, Image as ImageIcon, Search', 'Plus, X, Image as ImageIcon, Search');
contests = contests.replace("import { db } from '../firebase';\n", "");
contests = contests.replace("import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';\n", "");
contests = contests.replace(", deleteContest, toggleContestLike } = useStore();", "} = useStore();");
contests = contests.replace("let imagePasted = false;\n", "");
contests = contests.replace("imagePasted = true;\n", "");
fs.writeFileSync('src/components/ContestsPanel.tsx', contests);

// 2. GuidesPanel
let guides = fs.readFileSync('src/components/GuidesPanel.tsx', 'utf8');
guides = guides.replace('Plus, Edit2, Trash2, Heart, MessageSquare, Send, X, Image as ImageIcon, Search, Folder, FolderOpen, ChevronRight, ChevronDown, MoreVertical', 'Plus, Trash2, X, Image as ImageIcon, Search, Folder, FolderOpen, ChevronRight, ChevronDown');
guides = guides.replace("import { db } from '../firebase';\n", "");
guides = guides.replace("import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';\n", "");
guides = guides.replace("import { GuideFolder } from '../types';\n", "");
guides = guides.replace("deleteGuide, addGuideFolder", "addGuideFolder");
guides = guides.replace("let imagePasted = false;\n", "");
guides = guides.replace("imagePasted = true;\n", "");
fs.writeFileSync('src/components/GuidesPanel.tsx', guides);

// 3. RoulettePanel
let roulette = fs.readFileSync('src/components/RoulettePanel.tsx', 'utf8');
roulette = roulette.replace('Plus, Edit2, Trash2, X, Settings, ChevronDown', 'Plus, Trash2, X, Settings, ChevronDown');
fs.writeFileSync('src/components/RoulettePanel.tsx', roulette);

// 4. store.ts
let store = fs.readFileSync('src/store.ts', 'utf8');
store = store.replace("import { arrayMove } from '@dnd-kit/sortable';\n", "");
store = store.replace("import { auth, db } from './firebase';", "import { db } from './firebase';");
fs.writeFileSync('src/store.ts', store);

