import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  await signInWithEmailAndPassword(auth, "azun4n@superadmin.com", "password123");
  const usersSnap = await getDocs(collection(db, "users"));
  const users = usersSnap.docs.map(d => d.data());
  const formatted = users.filter(u => u.teamId && u.teamId !== "team_ironman" || u.role === "superadmin").map(u => {
    return {
      Email: u.email,
      Password: "password123",
      Role: u.role,
      Name: u.name,
      Team: u.teamId,
      Model: u.assignedModel || ""
    };
  });
  console.log(JSON.stringify(formatted, null, 2));
  process.exit(0);
}
run();
