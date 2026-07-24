import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { secondaryAuth, db } from './src/firebase.ts';
import fs from 'fs';

const users = [
  "@okayshen"
];

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pass = '';
  for(let i=0; i<8; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

async function main() {
  let existingResults = '';
  try {
    existingResults = fs.readFileSync('users_passwords.txt', 'utf8');
  } catch (e) {}
  
  const results = [];
  for (const username of users) {
    const password = generatePassword();
    const formatEmail = (str: string) => {
      if (str.includes('@') && str.includes('.') && !str.startsWith('@')) return str;
      return `${str.replace('@', '').toLowerCase()}.3@nexus.app`; // ADDED .3
    };
    const authEmail = formatEmail(username);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, authEmail, password);
      const uid = userCredential.user.uid;
      
      const newUserObj = {
        id: uid,
        email: username, 
        name: username,
        role: 'chatter',
      };
      
      await setDoc(doc(db, 'users', uid), newUserObj);
      results.push(`${username}: ${password}`);
      console.log(`Created ${username}`);
    } catch(err: any) {
      console.error(`Error for ${username}: ${err.message}`);
    }
  }
  
  fs.writeFileSync('users_passwords.txt', existingResults + '\n' + results.join('\n'));
  
  console.log('--- RESULTS ---');
  console.log(results.join('\n'));
  process.exit(0);
}

main();
