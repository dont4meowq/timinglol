import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { auth, db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, query, where, setDoc } from 'firebase/firestore';
import { User } from '../types';

export function useFirebaseSync() {
  const { 
    currentUser, 
    setCurrentUser, 
    setDayOffs,
    setModels,
    setAllUsers,
    setBonuses,
    setGuideFolders,
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
    
    // Helper to get query based on teamId
    const getTeamQuery = (collectionName: string) => {
      const coll = collection(db, collectionName);
      if (currentUser.role === 'superadmin') return coll;
      if (!currentUser.teamId) return query(coll, where('teamId', '==', 'UNASSIGNED')); // Fallback for safety
      return query(coll, where('teamId', '==', currentUser.teamId));
    };

    // Fetch users for everyone (chatters need it for bonuses)
    unsubs.push(
      onSnapshot(getTeamQuery('users'), (snap) => {
        setAllUsers(snap.docs.map(d => d.data() as User));
      })
    );

    // DayOffs
    unsubs.push(
      onSnapshot(getTeamQuery('dayOffs'), (snap) => {
        setDayOffs(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );
        
    // Bonuses
    unsubs.push(
      onSnapshot(getTeamQuery('bonuses'), (snap) => {
        setBonuses(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );

    // Guides
    unsubs.push(
      onSnapshot(getTeamQuery('guideFolders'), (snap) => {
        setGuideFolders(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );
    unsubs.push(
      onSnapshot(getTeamQuery('guides'), (snap) => {
        setGuides(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => b.createdAt - a.createdAt));
      })
    );

    unsubs.push(
      onSnapshot(getTeamQuery('contests'), (snap) => {
        useStore.getState().setContests(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => b.createdAt - a.createdAt));
      })
    );

    unsubs.push(
      onSnapshot(getTeamQuery('roulettes'), (snap) => {
        useStore.getState().setRoulettes(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );

    // Customs
    let customsQuery = getTeamQuery('customs');
    if (currentUser.role === 'chatter') {
      if (currentUser.teamId) {
        customsQuery = query(collection(db, 'customs'), where('teamId', '==', currentUser.teamId), where('model', '==', currentUser.assignedModel));
      } else {
        customsQuery = query(collection(db, 'customs'), where('model', '==', currentUser.assignedModel));
      }
    }
    
    unsubs.push(
      onSnapshot(customsQuery, (snap) => {
        setCustoms(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).sort((a, b) => b.createdAt - a.createdAt));
      })
    );

    // Models
    unsubs.push(
      onSnapshot(getTeamQuery('models'), (snap) => {
        setModels(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      })
    );

    return () => unsubs.forEach(u => u());
  }, [currentUser, setDayOffs, setAllUsers, setModels, setBonuses, setGuides, setGuideFolders]);

  return { loading };
}
