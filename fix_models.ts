import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { secondaryAuth, secondaryApp } from './src/firebase';
import firebaseConfig from './firebase-applet-config.json';

const db2 = getFirestore(secondaryApp, firebaseConfig.firestoreDatabaseId);

async function check() {
  await signInWithEmailAndPassword(secondaryAuth, 'godproudofyou@nexus.app', 'N3xus2026!');
  const snap = await getDocs(collection(db2, 'models'));
  
  for (const d of snap.docs) {
    const data = d.data();
    if (!data.teamId) {
      console.log('Deleting orphan', data.name);
      await deleteDoc(doc(db2, 'models', d.id));
    }
  }
  process.exit(0);
}
check();
