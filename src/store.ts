import { create } from 'zustand';
import { User, DayOff, ModelInfo, Bonus, Guide, GuideFolder, Custom , Contest, Roulette} from './types';
import { arrayMove } from '@dnd-kit/sortable';
import { auth, db } from './firebase';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const generateId = () => crypto.randomUUID();

interface AppState {
  sidebarOpen: boolean;

  allUsers: User[];
  currentUser: User | null;
  appView: 'admin' | 'schedule' | 'bonuses' | 'roulette' | 'guides' | 'customs' | 'contests';
  customs: Custom[];
  models: ModelInfo[];
  dayOffs: DayOff[];
  bonuses: Bonus[];
  guideFolders: GuideFolder[];
  guides: Guide[];
  contests: Contest[];
  roulettes: Roulette[];
  
  activeModel: string;

  // Actions
  setAppView: (view: 'admin' | 'schedule' | 'bonuses' | 'roulette' | 'guides' | 'customs' | 'contests') => void;
  setActiveModel: (model: string) => void;
  
  setCurrentUser: (user: User | null) => void;
  setAllUsers: (users: User[]) => void;
  setCustoms: (customs: Custom[]) => void;
  setModels: (models: ModelInfo[]) => void;
  setDayOffs: (dayOffs: DayOff[]) => void;
  setBonuses: (bonuses: Bonus[]) => void;
  setGuideFolders: (folders: GuideFolder[]) => void;
  addGuideFolder: (folder: Omit<GuideFolder, 'id'>) => void;
  updateGuideFolder: (id: string, updates: Partial<GuideFolder>) => void;
  deleteGuideFolder: (id: string) => void;
  setGuides: (guides: Guide[]) => void;
  setContests: (contests: Contest[]) => void;
  setRoulettes: (roulettes: Roulette[]) => void;
  addRoulette: (roulette: Omit<Roulette, 'id'>) => void;
  deleteRoulette: (id: string) => void;
  updateRoulette: (id: string, updates: Partial<Roulette>) => void;
  addBonus: (bonus: Omit<Bonus, 'id'>) => void;
  deleteBonus: (id: string) => void;

  addGuide: (guide: Omit<Guide, 'id' | 'likes' | 'createdAt'>) => void;
  updateGuide: (id: string, updates: Partial<Guide>) => void;
  deleteGuide: (id: string) => void;
  toggleGuideLike: (id: string, userId: string) => void;
  addContest: (contest: Omit<Contest, 'id' | 'likes' | 'createdAt'>) => void;
  updateContest: (id: string, updates: Partial<Contest>) => void;
  deleteContest: (id: string) => void;
  toggleContestLike: (id: string, userId: string) => void;

  
  addCustom: (custom: Omit<Custom, 'id' | 'createdAt'>) => void;
  updateCustom: (id: string, custom: Partial<Custom>) => void;
  deleteCustom: (id: string) => void;
  
  addDayOff: (dayOff: Omit<DayOff, "id">) => void;
  deleteDayOff: (id: string) => void;
  
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  sidebarOpen: false,
  allUsers: [],
  currentUser: null,
  appView: 'schedule',
  customs: [],
  models: [],
  dayOffs: [],
  bonuses: [],
  guideFolders: [],
  guides: [],
  contests: [],
  roulettes: [],
  activeModel: '',

  setAppView: (view) => set({ appView: view }),
  setActiveModel: (model) => set({ activeModel: model }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setAllUsers: (users) => set({ allUsers: users }),
  setCustoms: (customs) => set({ customs }),
  setModels: (models) => set({ models }),
  setDayOffs: (dayOffs) => set({ dayOffs }),
  setBonuses: (bonuses) => set({ bonuses }),
  setGuideFolders: (folders) => set({ guideFolders: folders }),
  addGuideFolder: (folder) => {
    const id = generateId();
    const obj = { ...folder, id };
    setDoc(doc(db, `guideFolders/${id}`), obj).catch(console.error);
    set((state) => ({ guideFolders: [...state.guideFolders, obj] }));
  },
  updateGuideFolder: (id, updates) => {
    updateDoc(doc(db, `guideFolders/${id}`), updates).catch(console.error);
    set((state) => ({ guideFolders: state.guideFolders.map(f => f.id === id ? { ...f, ...updates } : f) }));
  },
  deleteGuideFolder: (id) => {
    deleteDoc(doc(db, `guideFolders/${id}`)).catch(console.error);
    set((state) => ({ guideFolders: state.guideFolders.filter(f => f.id !== id) }));
  },
  setGuides: (guides) => set({ guides }),
  setContests: (contests) => set({ contests }),
  setRoulettes: (roulettes) => set({ roulettes }),

  addRoulette: (roulette) => {
    const id = generateId();
    const obj = { ...roulette, id };
    setDoc(doc(db, `roulettes/${id}`), obj).catch(console.error);
    set((state) => ({ roulettes: [...state.roulettes, obj] }));
  },
  updateRoulette: (id, updates) => {
    updateDoc(doc(db, `roulettes/${id}`), updates).catch(console.error);
    set((state) => ({ roulettes: state.roulettes.map(r => r.id === id ? { ...r, ...updates } : r) }));
  },
  deleteRoulette: (id) => {
    deleteDoc(doc(db, `roulettes/${id}`)).catch(console.error);
    set((state) => ({ roulettes: state.roulettes.filter(r => r.id !== id) }));
  },

  addBonus: (bonus) => {
    const id = generateId();
    const obj = { ...bonus, id };
    setDoc(doc(db, `bonuses/${id}`), obj).catch(console.error);
    set((state) => ({ bonuses: [...state.bonuses, obj] }));
  },
  deleteBonus: (id) => {
    deleteDoc(doc(db, `bonuses/${id}`)).catch(console.error);
    set((state) => ({ bonuses: state.bonuses.filter(b => b.id !== id) }));
  },

  addGuide: (guide) => {
    const id = generateId();
    const obj = { ...guide, id, createdAt: Date.now(), likes: [] };
    setDoc(doc(db, `guides/${id}`), obj).catch(console.error);
    set((state) => ({ guides: [obj, ...state.guides] }));
  },
  updateGuide: (id, updates) => {
    updateDoc(doc(db, `guides/${id}`), updates).catch(console.error);
    set((state) => ({ guides: state.guides.map(g => g.id === id ? { ...g, ...updates } : g) }));
  },
  deleteGuide: (id) => {
    deleteDoc(doc(db, `guides/${id}`)).catch(console.error);
    set((state) => ({ guides: state.guides.filter(g => g.id !== id) }));
  },
  toggleGuideLike: (id, userId) => {
    const guide = get().guides.find(g => g.id === id);
    if (!guide) return;
    const isLiked = guide.likes.includes(userId);
    const newLikes = isLiked ? guide.likes.filter(u => u !== userId) : [...guide.likes, userId];
    updateDoc(doc(db, `guides/${id}`), { likes: newLikes }).catch(console.error);
    set((state) => ({ guides: state.guides.map(g => g.id === id ? { ...g, likes: newLikes } : g) }));
  },

  addContest: (contest) => {
    const id = generateId();
    const obj = { ...contest, id, createdAt: Date.now(), likes: [] };
    setDoc(doc(db, `contests/${id}`), obj).catch(console.error);
    set((state) => ({ contests: [obj, ...state.contests] }));
  },
  updateContest: (id, updates) => {
    updateDoc(doc(db, `contests/${id}`), updates).catch(console.error);
    set((state) => ({ contests: state.contests.map(c => c.id === id ? { ...c, ...updates } : c) }));
  },
  deleteContest: (id) => {
    deleteDoc(doc(db, `contests/${id}`)).catch(console.error);
    set((state) => ({ contests: state.contests.filter(c => c.id !== id) }));
  },
  toggleContestLike: (id, userId) => {
    const contest = get().contests.find(c => c.id === id);
    if (!contest) return;
    const isLiked = contest.likes.includes(userId);
    const newLikes = isLiked ? contest.likes.filter(u => u !== userId) : [...contest.likes, userId];
    updateDoc(doc(db, `contests/${id}`), { likes: newLikes }).catch(console.error);
    set((state) => ({ contests: state.contests.map(c => c.id === id ? { ...c, likes: newLikes } : c) }));
  },

  addCustom: (custom) => {
    const id = generateId();
    const obj = { ...custom, id, createdAt: Date.now() };
    setDoc(doc(db, `customs/${id}`), obj).catch(console.error);
    set((state) => ({ customs: [...state.customs, obj] }));
  },
  updateCustom: (id, updates) => {
    updateDoc(doc(db, `customs/${id}`), updates).catch(console.error);
    set((state) => ({ customs: state.customs.map(c => c.id === id ? { ...c, ...updates } : c) }));
  },
  deleteCustom: (id) => {
    deleteDoc(doc(db, `customs/${id}`)).catch(console.error);
    set((state) => ({ customs: state.customs.filter(c => c.id !== id) }));
  },
  
  addDayOff: (dayOff) => {
    const id = generateId();
    const obj = { ...dayOff, id };
    setDoc(doc(db, `dayOffs/${id}`), obj).catch(console.error);
    set((state) => ({ dayOffs: [...state.dayOffs, obj] }));
  },
  
  deleteDayOff: (id) => {
    deleteDoc(doc(db, `dayOffs/${id}`)).catch(console.error);
    set((state) => ({ dayOffs: state.dayOffs.filter(d => d.id !== id) }));
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
