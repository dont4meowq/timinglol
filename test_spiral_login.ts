import { signInWithEmailAndPassword } from 'firebase/auth';
import { secondaryAuth } from './src/firebase';

async function check() {
  try {
    const cred = await signInWithEmailAndPassword(secondaryAuth, 'spiraldown9.2@nexus.app', 'N3xus2026!');
    console.log('SUCCESS for spiraldown9.2@nexus.app');
  } catch(e: any) {
    console.log('Failed:', e.message);
  }
  process.exit(0);
}
check();
