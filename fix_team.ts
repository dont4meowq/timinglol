import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { secondaryAuth, secondaryApp } from './src/firebase';
import firebaseConfig from './firebase-applet-config.json';

const db2 = getFirestore(secondaryApp, firebaseConfig.firestoreDatabaseId);

async function create() {
  const users = [
    { login: 'spiraldown9@nexus.app', name: '@spiraldown9', pass: 'N3xus2026!' },
    { login: 'godproudofyou@nexus.app', name: '@godproudofyou', pass: 'N3xus2026!' }
  ];
  
  const newTeamId = 'team_2_admins';

  for (const u of users) {
    let cred;
    try {
      cred = await createUserWithEmailAndPassword(secondaryAuth, u.login, u.pass);
      console.log(`Created Auth: ${u.name}`);
    } catch(e: any) {
      if (e.code === 'auth/email-already-in-use') {
        cred = await signInWithEmailAndPassword(secondaryAuth, u.login, u.pass);
        console.log(`Signed In: ${u.name}`);
      } else {
        console.error(`Failed Auth for ${u.name}:`, e);
        continue;
      }
    }
    
    if (cred) {
      try {
        await setDoc(doc(db2, 'users', cred.user.uid), {
          id: cred.user.uid,
          email: u.login,
          name: u.name,
          role: 'admin',
          teamId: newTeamId
        });
        console.log(`Saved Firestore: ${u.name}`);
      } catch (e) {
        console.error(`Failed Firestore for ${u.name}:`, e);
      }
    }
  }
  process.exit(0);
}
create();
