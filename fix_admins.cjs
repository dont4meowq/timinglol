import('firebase/app').then(async ({ initializeApp }) => {
  const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
  const { getFirestore, doc, setDoc } = await import('firebase/firestore');
  const fs = require('fs');
  const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

  const admins = [
    { login: '@IRONMAN9555', name: 'Ironman' },
    { login: '@mirasssrank', name: 'Mirasssrank' }
  ];

  for (const admin of admins) {
    const authEmail = `${admin.login.replace('@', '').toLowerCase()}@nexus.app`;
    try {
      console.log(`Fixing ${authEmail}...`);
      const cred = await signInWithEmailAndPassword(auth, authEmail, 'adminio228');
      await setDoc(doc(db, 'users', cred.user.uid), {
        id: cred.user.uid,
        email: admin.login,
        name: admin.name,
        role: 'admin'
      });
      console.log(`Successfully fixed ${admin.login}`);
    } catch (err) {
      console.error(`Failed to fix ${admin.login}: ${err.message}`);
    }
  }
  process.exit(0);
});
