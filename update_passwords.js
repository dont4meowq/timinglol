import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);
const app = initializeApp(config);
const auth = getAuth(app);

const allUsers = JSON.parse(fs.readFileSync('all_users.json', 'utf8'));

function generatePassword() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let pass = "";
  for(let i=0; i<8; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

async function run() {
  const updated = [];
  for (const u of allUsers) {
    // Only update if it's one of the new teams or superadmin
    if (u.Team === "team_ironman") continue;
    
    const newPass = generatePassword();
    try {
      // Sign in with the old password
      const cred = await signInWithEmailAndPassword(auth, u.Email, "password123");
      // Update to new password
      await updatePassword(cred.user, newPass);
      updated.push({ ...u, Password: newPass });
      console.log(`Updated ${u.Email}`);
    } catch (e) {
      console.error(`Failed ${u.Email}:`, e.message);
      updated.push({ ...u, Password: "password123 (or already updated)", Error: e.message });
    }
  }
  fs.writeFileSync('updated_users.json', JSON.stringify(updated, null, 2));
  console.log("DONE");
  process.exit(0);
}

run();
