import { create } from 'zustand';
import { Section, Note, User, Fan, DayOff, ModelInfo, Bonus } from './types';
import { arrayMove } from '@dnd-kit/sortable';
import { auth, db } from './firebase';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

interface AppState {
  sections: Section[];
  activeSectionId: string | null;
  activeNoteId: string | null;
  searchQuery: string;
  sidebarOpen: boolean;

  allUsers: User[];
  currentUser: User | null;
  appView: 'dashboard' | 'admin' | 'crm' | 'schedule' | 'bonuses' | 'roulette';
  fans: Fan[];
  models: ModelInfo[];
  dayOffs: DayOff[];
  bonuses: Bonus[];
  
  activeModel: string;

  // Actions
  setAppView: (view: 'dashboard' | 'admin' | 'crm' | 'schedule' | 'bonuses' | 'roulette') => void;
  setActiveModel: (model: string) => void;
  
  setCurrentUser: (user: User | null) => void;
  setAllUsers: (users: User[]) => void;
  setFans: (fans: Fan[]) => void;
  setModels: (models: ModelInfo[]) => void;
  setDayOffs: (dayOffs: DayOff[]) => void;
  setBonuses: (bonuses: Bonus[]) => void;
  addBonus: (bonus: Omit<Bonus, 'id'>) => void;
  deleteBonus: (id: string) => void;
  setSections: (sections: Section[]) => void;

  addFan: (fan: Omit<Fan, 'id'>) => void;
  updateFan: (id: string, fan: Partial<Fan>) => void;
  deleteFan: (id: string) => void;
  
  addDayOff: (dayOff: Omit<DayOff, "id">) => void;
  deleteDayOff: (id: string) => void;
  
  setSidebarOpen: (open: boolean) => void;
  addSection: (id: string, title: string, model: string) => void;
  updateSection: (id: string, title: string) => void;
  deleteSection: (id: string) => void;
  reorderSections: (oldIndex: number, newIndex: number) => void;
  toggleSectionCollapse: (id: string) => void;
  setActiveSection: (id: string | null) => void;
  
  addNote: (sectionId: string, title: string) => void;
  updateNote: (sectionId: string, noteId: string, updates: Partial<Note>) => void;
  deleteNote: (sectionId: string, noteId: string) => void;
  moveNoteToSection: (noteId: string, fromSectionId: string, toSectionId: string) => void;
  reorderNotes: (sectionId: string, oldIndex: number, newIndex: number) => void;
  togglePinNote: (sectionId: string, noteId: string) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>()((set, get) => ({
  sections: [],
  activeSectionId: null,
  activeNoteId: null,
  searchQuery: '',
  sidebarOpen: false,

  allUsers: [],
  currentUser: null,
  appView: 'dashboard',
  fans: [],
  models: [],
  dayOffs: [],
  bonuses: [],
  activeModel: 'Shared',

  setAppView: (view) => set({ appView: view }),
  setActiveModel: (model) => set({ activeModel: model }),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  setAllUsers: (users) => set({ allUsers: users }),
  setFans: (fans) => set({ fans }),
  setModels: (models) => set({ models }),
  setDayOffs: (dayOffs) => set({ dayOffs }),
  setBonuses: (bonuses) => set({ bonuses }),
  addBonus: (bonus) => {
    const id = generateId();
    const obj = { ...bonus, id };
    setDoc(doc(db, `bonuses/${id}`), obj);
    set((state) => ({ bonuses: [...state.bonuses, obj] }));
  },
  deleteBonus: (id) => {
    deleteDoc(doc(db, `bonuses/${id}`));
    set((state) => ({ bonuses: state.bonuses.filter(b => b.id !== id) }));
  },
  setSections: (sections) => {
    set((state) => {
      // Ensure active selection is valid
      const activeSec = sections.find(s => s.id === state.activeSectionId);
      let newSecId = state.activeSectionId;
      let newNoteId = state.activeNoteId;
      if (!activeSec && sections.length > 0) {
        newSecId = sections[0].id;
        newNoteId = sections[0].notes[0]?.id || null;
      }
      return { sections, activeSectionId: newSecId, activeNoteId: newNoteId };
    });
  },

  addFan: (fan) => {
    const id = generateId();
    const obj = { ...fan, id };
    setDoc(doc(db, `fans/${id}`), obj);
    // Optimistic update
    set((state) => ({ fans: [...state.fans, obj] }));
  },

  updateFan: (id, updates) => {
    updateDoc(doc(db, `fans/${id}`), updates);
    set((state) => ({ fans: state.fans.map(f => f.id === id ? { ...f, ...updates } : f) }));
  },

  deleteFan: (id) => {
    deleteDoc(doc(db, `fans/${id}`));
    set((state) => ({ fans: state.fans.filter(f => f.id !== id) }));
  },
  
  addDayOff: (dayOff) => {
    const id = generateId();
    const obj = { ...dayOff, id };
    setDoc(doc(db, `dayOffs/${id}`), obj);
    set((state) => ({ dayOffs: [...state.dayOffs, obj] }));
  },
  
  deleteDayOff: (id) => {
    deleteDoc(doc(db, `dayOffs/${id}`));
    set((state) => ({ dayOffs: state.dayOffs.filter(d => d.id !== id) }));
  },

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  addSection: (id, title, model) => {
    const newSection: Section = { id, title, notes: [], collapsed: false, model };
    setDoc(doc(db, `sections/${id}`), newSection);
    set((state) => ({ sections: [...state.sections, newSection], activeSectionId: id }));
  },
  
  updateSection: (id, title) => {
    const section = get().sections.find(s => s.id === id);
    if (section) {
      const updated = { ...section, title };
      setDoc(doc(db, `sections/${id}`), updated);
      set((state) => ({ sections: state.sections.map(s => s.id === id ? updated : s) }));
    }
  },

  deleteSection: (id) => {
    deleteDoc(doc(db, `sections/${id}`));
    set((state) => {
      const newSections = state.sections.filter(s => s.id !== id);
      const newActiveSectionId = state.activeSectionId === id ? (newSections[0]?.id || null) : state.activeSectionId;
      const newActiveNoteId = state.activeSectionId === id ? (newSections[0]?.notes[0]?.id || null) : state.activeNoteId;
      return { sections: newSections, activeSectionId: newActiveSectionId, activeNoteId: newActiveNoteId };
    });
  },

  reorderSections: (oldIndex, newIndex) => {
    const newSections = arrayMove(get().sections, oldIndex, newIndex);
    // Ideally update order in DB, but for simplicity skipping DB order save for now
    set({ sections: newSections });
  },

  toggleSectionCollapse: (id) => {
    const section = get().sections.find(s => s.id === id);
    if (section) {
      const updated = { ...section, collapsed: !section.collapsed };
      setDoc(doc(db, `sections/${id}`), updated);
      set((state) => ({ sections: state.sections.map(s => s.id === id ? updated : s) }));
    }
  },

  setActiveSection: (id) => set((state) => {
    const section = state.sections.find(s => s.id === id);
    return { 
      activeSectionId: id,
      activeNoteId: section?.notes[0]?.id || null 
    };
  }),

  addNote: (sectionId, title) => {
    const section = get().sections.find(s => s.id === sectionId);
    if (section) {
      const newNote = { id: generateId(), title, content: '', pinned: false };
      const updated = { ...section, notes: [...section.notes, newNote] };
      setDoc(doc(db, `sections/${sectionId}`), updated);
      set((state) => ({ sections: state.sections.map(s => s.id === sectionId ? updated : s) }));
    }
  },

  updateNote: (sectionId, noteId, updates) => {
    const section = get().sections.find(s => s.id === sectionId);
    if (section) {
      const updated = {
        ...section,
        notes: section.notes.map(n => n.id === noteId ? { ...n, ...updates } : n)
      };
      setDoc(doc(db, `sections/${sectionId}`), updated);
      set((state) => ({ sections: state.sections.map(s => s.id === sectionId ? updated : s) }));
    }
  },

  deleteNote: (sectionId, noteId) => {
    const state = get();
    const section = state.sections.find(s => s.id === sectionId);
    if (section) {
      const newNotes = section.notes.filter(n => n.id !== noteId);
      const updated = { ...section, notes: newNotes };
      setDoc(doc(db, `sections/${sectionId}`), updated);
      
      let nextNoteId = state.activeNoteId;
      if (state.activeNoteId === noteId) {
        nextNoteId = newNotes[0]?.id || null;
      }
      set({ sections: state.sections.map(s => s.id === sectionId ? updated : s), activeNoteId: nextNoteId });
    }
  },

  moveNoteToSection: (noteId, fromSectionId, toSectionId) => {
    if (fromSectionId === toSectionId) return;
    const state = get();
    const fromSection = state.sections.find(s => s.id === fromSectionId);
    const toSection = state.sections.find(s => s.id === toSectionId);
    
    if (fromSection && toSection) {
      const noteToMove = fromSection.notes.find(n => n.id === noteId);
      if (noteToMove) {
        const newFrom = { ...fromSection, notes: fromSection.notes.filter(n => n.id !== noteId) };
        const newTo = { ...toSection, notes: [...toSection.notes, noteToMove] };
        
        setDoc(doc(db, `sections/${fromSectionId}`), newFrom);
        setDoc(doc(db, `sections/${toSectionId}`), newTo);
        
        set((state) => ({
          sections: state.sections.map(s => {
            if (s.id === fromSectionId) return newFrom;
            if (s.id === toSectionId) return newTo;
            return s;
          }),
          activeSectionId: state.activeNoteId === noteId ? toSectionId : state.activeSectionId
        }));
      }
    }
  },

  reorderNotes: (sectionId, oldIndex, newIndex) => {
    const section = get().sections.find(s => s.id === sectionId);
    if (section) {
      const updated = { ...section, notes: arrayMove(section.notes, oldIndex, newIndex) };
      setDoc(doc(db, `sections/${sectionId}`), updated);
      set((state) => ({ sections: state.sections.map(s => s.id === sectionId ? updated : s) }));
    }
  },

  togglePinNote: (sectionId, noteId) => {
    const section = get().sections.find(s => s.id === sectionId);
    if (section) {
      const updated = {
        ...section,
        notes: section.notes.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n)
      };
      setDoc(doc(db, `sections/${sectionId}`), updated);
      set((state) => ({ sections: state.sections.map(s => s.id === sectionId ? updated : s) }));
    }
  },

  setActiveNote: (id) => set({ activeNoteId: id }),
  setSearchQuery: (query) => set({ searchQuery: query })
}));
