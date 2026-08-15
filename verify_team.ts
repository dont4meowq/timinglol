import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { secondaryApp } from './src/firebase';
import firebaseConfig from './firebase-applet-config.json';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { secondaryAuth } from './src/firebase';

const db2 = getFirestore(secondaryApp, firebaseConfig.firestoreDatabaseId);

async function verify() {
  await signInWithEmailAndPassword(secondaryAuth, 'godproudofyou@nexus.app', 'N3xus2026!');
  const snap = await getDocs(query(collection(db2, 'users'), where('teamId', '==', 'team_2_admins')));
  snap.forEach(d => console.log(d.data()));
  process.exit(0);
}
verify();
