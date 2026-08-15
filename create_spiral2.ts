import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { secondaryAuth, secondaryApp } from './src/firebase';
import firebaseConfig from './firebase-applet-config.json';

const db2 = getFirestore(secondaryApp, firebaseConfig.firestoreDatabaseId);

async function create() {
  const newTeamId = 'team_2_admins';
  const login = 'spiraldown9.2@nexus.app';
  const pass = 'N3xus2026!';
  const name = '@spiraldown9';
  
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, login, pass);
    await setDoc(doc(db2, 'users', cred.user.uid), {
      id: cred.user.uid,
      email: login,
      name: name,
      role: 'admin',
      teamId: newTeamId
    });
    console.log(`Success: ${name}`);
  } catch(e: any) {
    console.error(`Failed Auth:`, e);
  }
  process.exit(0);
}
create();
