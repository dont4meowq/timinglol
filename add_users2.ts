import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { secondaryAuth, db } from './src/firebase.ts';
import fs from 'fs';

const users = [
  "@whiskerboss",
  "@okayshen",
  "@m4f82css",
  "@calmcommerce",
  "@kiesuuuuu",
  "@iknowhow2r0ll",
  "@spiraldown9",
  "@dont4meowq",
  "@espanolespanolespan",
  "@sh1za911",
  "@troublemaker2077",
  "@terqq12",
  "@giwea1",
  "@babydollprincess",
  "@VS_JARVIS",
  "@Loruk2",
  "@shanxan",
  "@sleepyforever123",
  "@katana8899"
];

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pass = '';
  for(let i=0; i<8; i++) pass += chars[Math.floor(Math.random() * chars.length)];
  return pass;
}

async function main() {
  const results = [];
  for (const username of users) {
    const password = generatePassword();
    const formatEmail = (str: string) => {
      if (str.includes('@') && str.includes('.') && !str.startsWith('@')) return str;
      return `${str.replace('@', '').toLowerCase()}.1@nexus.app`; // ADDED .1
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
  
  fs.writeFileSync('users_passwords.txt', results.join('\n'));
  
  console.log('--- RESULTS ---');
  console.log(results.join('\n'));
  process.exit(0);
}

main();
