import { collection, getDocs } from 'firebase/firestore';
import { db } from './src/firebase';

async function check() {
  const snap = await getDocs(collection(db, 'users'));
  snap.forEach(d => console.log(d.id, d.data().name, d.data().teamId, d.data().role));
  process.exit(0);
}
check();
