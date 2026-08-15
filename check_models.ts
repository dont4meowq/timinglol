import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, getFirestore, updateDoc, doc } from 'firebase/firestore';
import { secondaryAuth, secondaryApp } from './src/firebase';
import firebaseConfig from './firebase-applet-config.json';

const db2 = getFirestore(secondaryApp, firebaseConfig.firestoreDatabaseId);

async function check() {
  await signInWithEmailAndPassword(secondaryAuth, 'godproudofyou@nexus.app', 'N3xus2026!');
  const snap = await getDocs(collection(db2, 'models'));
  
  let i = 0;
  for (const d of snap.docs) {
    const data = d.data();
    console.log(d.id, data);
    if (!data.teamId) {
      console.log('Fixing teamId for', data.name);
      // Wait, which teamId to assign to existing? Probably the main team. But wait, I don't know the main team ID.
    }
  }
  process.exit(0);
}
check();
