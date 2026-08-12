const fs = require('fs');

let code = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

const replacement = `  useEffect(() => {
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
  }, [currentUser, setDayOffs, setAllUsers, setModels, setBonuses, setGuides, setGuideFolders]);`;

code = code.replace(/  useEffect\(\(\) => \{\n    if \(\!currentUser\) return;[\s\S]*?\}\, \[currentUser, setDayOffs, setAllUsers, setModels, setBonuses, setGuides, setGuideFolders\]\);/m, replacement);

fs.writeFileSync('src/hooks/useFirebaseSync.ts', code);
console.log('Patched useFirebaseSync');
