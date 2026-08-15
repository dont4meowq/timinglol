import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, getFirestore, updateDoc, doc } from 'firebase/firestore';
import { secondaryAuth, secondaryApp } from './src/firebase';
import firebaseConfig from './firebase-applet-config.json';

const db2 = getFirestore(secondaryApp, firebaseConfig.firestoreDatabaseId);

async function check() {
  await signInWithEmailAndPassword(secondaryAuth, 'godproudofyou@nexus.app', 'N3xus2026!');
  
  const snap = await getDocs(query(collection(db2, 'users'), where('email', '==', 'spiraldown9@nexus.app')));
  if (snap.empty) {
    console.log('No user in firestore for spiraldown9@nexus.app');
  }
  snap.forEach(d => {
    console.log(d.id, d.data());
    // update their teamId to 'team_2_admins' since they belong together
    updateDoc(doc(db2, 'users', d.id), { teamId: 'team_2_admins' }).then(() => console.log('Updated teamId!'));
  });
  
  setTimeout(() => process.exit(0), 1000);
}
check();
