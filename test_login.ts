import { signInWithEmailAndPassword } from 'firebase/auth';
import { secondaryAuth } from './src/firebase';

async function check() {
  const passes = ['N3xus2026!', 'N3xusAdmin123!', 'spiral123!', '123456', 'password'];
  for (const p of passes) {
    try {
      await signInWithEmailAndPassword(secondaryAuth, 'spiraldown9@nexus.app', p);
      console.log('SUCCESS with password:', p);
      process.exit(0);
    } catch(e: any) {
      console.log('Failed:', p, e.code);
    }
  }
  process.exit(0);
}
check();
