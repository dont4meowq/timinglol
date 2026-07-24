const fs = require('fs');
let code = fs.readFileSync('src/hooks/useFirebaseSync.ts', 'utf8');

code = code.replace(
  `    // Admins need to see all users to manage them
    if (currentUser.role === 'admin') {
      unsubs.push(
        onSnapshot(collection(db, 'users'), (snap) => {
          setAllUsers(snap.docs.map(d => d.data() as User));
        })
      );
    }`,
  `    // Fetch users for everyone (chatters need it for bonuses)
    unsubs.push(
      onSnapshot(collection(db, 'users'), (snap) => {
        setAllUsers(snap.docs.map(d => d.data() as User));
      })
    );`
);

fs.writeFileSync('src/hooks/useFirebaseSync.ts', code);
