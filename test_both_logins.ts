import { signInWithEmailAndPassword } from 'firebase/auth';
import { secondaryAuth } from './src/firebase';

async function check() {
  try {
    await signInWithEmailAndPassword(secondaryAuth, 'spiraldown9.2@nexus.app', 'N3xus2026!');
    console.log('SUCCESS for spiraldown9.2@nexus.app');
  } catch(e: any) {
    console.log('Failed spiral:', e.message);
  }
  
  try {
    await signInWithEmailAndPassword(secondaryAuth, 'godproudofyou@nexus.app', 'N3xus2026!');
    console.log('SUCCESS for godproudofyou@nexus.app');
  } catch(e: any) {
    console.log('Failed god:', e.message);
  }
  process.exit(0);
}
check();
