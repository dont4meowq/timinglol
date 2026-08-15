import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './src/firebase';

async function check() {
  const snap = await getDocs(query(collection(db, 'users'), where('email', '==', 'spiraldown9@nexus.app')));
  snap.forEach(d => console.log(d.id, d.data()));
  process.exit(0);
}
check();
