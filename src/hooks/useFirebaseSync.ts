import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { auth, db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, query, where, setDoc } from 'firebase/firestore';
import { User } from '../types';

export function useFirebaseSync() {
  const { 
    currentUser, 
    setCurrentUser, 
    setFans,
    setDayOffs,
    setModels, 
    setSections,
    setAllUsers,
    setBonuses,
    setGuides,
    setCustoms
  } = useStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const u = userDoc.data() as User;
          setCurrentUser(u);
          if (u.role === 'chatter' && u.assignedModel) useStore.getState().setActiveModel(u.assignedModel);
        } else {
          // If no doc exists, it's a new user (maybe the first admin)
          // We'll create it here as admin for simplicity if it's the very first
          const newUser: User = {
            id: user.uid,
            email: user.email || '',
            role: 'admin', 
            name: user.email?.split('@')[0] || 'Admin'
          };
          await setDoc(doc(db, 'users', user.uid), newUser);
          setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setCurrentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubs: any[] = [];

    // Fetch users for everyone (chatters need it for bonuses)
    unsubs.push(
      onSnapshot(collection(db, 'users'), (snap) => {
        setAllUsers(snap.docs.map(d => d.data() as User));
      })
    );

    // Fans: Admins see all, Chatters see only their assigned model
    const fansQuery = currentUser.role === 'admin' 
      ? collection(db, 'fans')
      : query(collection(db, 'fans'), where('model', '==', currentUser.assignedModel));
      
    unsubs.push(
      onSnapshot(fansQuery, (snap) => {
        setFans(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );

    // DayOffs: Everyone sees all
    unsubs.push(
      onSnapshot(collection(db, 'dayOffs'), (snap) => {
        setDayOffs(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );

    // Sections: Everyone sees all
    const sectionsQuery = collection(db, 'sections');

    unsubs.push(
      onSnapshot(sectionsQuery, (snap) => {
        // Sort sections by order
        const sections = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        sections.sort((a, b) => (a.order || 0) - (b.order || 0));
        setSections(sections);
      })
    );

    
    // Bonuses
    unsubs.push(
      onSnapshot(collection(db, 'bonuses'), (snap) => {
        setBonuses(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );

    // Guides
    unsubs.push(
      onSnapshot(collection(db, 'guides'), (snap) => {
        setGuides(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => b.createdAt - a.createdAt));
      })
    );
    unsubs.push(
      onSnapshot(collection(db, 'contests'), (snap) => {
        useStore.getState().setContests(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => b.createdAt - a.createdAt));
      })
    );
    unsubs.push(
      onSnapshot(collection(db, 'roulettes'), (snap) => {
        useStore.getState().setRoulettes(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );

    // Customs
    const customsQuery = currentUser.role === 'admin' 
      ? collection(db, 'customs')
      : query(collection(db, 'customs'), where('model', '==', currentUser.assignedModel));
      
    unsubs.push(
      onSnapshot(customsQuery, (snap) => {
        setCustoms(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => b.createdAt - a.createdAt));
      })
    );

    // Models
    unsubs.push(
      onSnapshot(collection(db, 'models'), (snap) => {
        setModels(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );

    return () => unsubs.forEach(u => u());
  }, [currentUser, setFans, setDayOffs, setSections, setAllUsers, setModels, setBonuses, setGuides]);

  return { loading };
}
