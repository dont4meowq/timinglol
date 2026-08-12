import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';

const configStr = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configStr);

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app, config.firestoreDatabaseId);

const teams = [
  {
    id: "team_destr0yl0nely",
    admins: [
      { email: "destr0yl0nely@admin.com", name: "@destr0yl0nely" },
      { email: "eviljordanz@admin.com", name: "@eviljordanz" }
    ],
    chatters: [
      { email: "gotmillions@chatter.com", name: "@gotmillions", model: "Bella Habibi" },
      { email: "oggold048@chatter.com", name: "@OGgold048", model: "Bella Habibi" },
      { email: "taylors_sswift@chatter.com", name: "@taylors_sswift", model: "Bella Habibi" },
      { email: "broodmother1312@chatter.com", name: "@broodmother1312", model: "Asuka" },
      { email: "mylovelyexistence@chatter.com", name: "@mylovelyexistence", model: "Asuka" },
      { email: "cocuncux@chatter.com", name: "@cocuncux", model: "Asuka" },
      { email: "s1mpwl@chatter.com", name: "@s1mpwl", model: "Monica" },
      { email: "overthehxlls@chatter.com", name: "@overthehxlls", model: "Monica" },
      { email: "ranzebrff@chatter.com", name: "@ranzebrff", model: "Monica" },
      { email: "djlopezzz@chatter.com", name: "@DjLopezzz", model: "Lily Long" },
      { email: "stiefmutter18@chatter.com", name: "@stiefmutter18", model: "Lily Long" },
      { email: "moggetsu@chatter.com", name: "@moggetsu", model: "Lily Long" },
      { email: "parus690@chatter.com", name: "@parus690", model: "Rein" },
      { email: "overthehxlls2@chatter.com", name: "@overthehxlls (Rein)", model: "Rein" },
      { email: "zxcvbnnmowi@chatter.com", name: "@zxcvbnnmowi", model: "Rein" }
    ]
  },
  {
    id: "team_uzzi62",
    admins: [
      { email: "uzzi62@admin.com", name: "@Uzzi62" },
      { email: "godmodee666@admin.com", name: "@godmodee666" }
    ],
    chatters: [
      { email: "bbernik@chatter.com", name: "@bbernik", model: "Mommy Lust" },
      { email: "psychocommerce@chatter.com", name: "@psychocommerce", model: "Mommy Lust" },
      { email: "johannlieb@chatter.com", name: "@johannlieb", model: "Mommy Lust" },
      { email: "whoislunexq@chatter.com", name: "@whoislunexq", model: "Cherry Blossom" },
      { email: "qwezz2214@chatter.com", name: "@qwezz2214", model: "Cherry Blossom" },
      { email: "unicide1@chatter.com", name: "@unicide1", model: "Cherry Blossom" },
      { email: "hatemyseifpls@chatter.com", name: "@hatemyseIfpls", model: "Mommy Teacher" },
      { email: "angelous225@chatter.com", name: "@Angelous225", model: "Mommy Teacher" },
      { email: "skipzzzik@chatter.com", name: "@SkiPzZzik", model: "Mommy Teacher" },
      { email: "pigyyboyl@chatter.com", name: "@pigyyboyl", model: "Sakura Kasumi" },
      { email: "hoplopol@chatter.com", name: "@hoplopol", model: "Sakura Kasumi" },
      { email: "user5741@chatter.com", name: "@user5741", model: "Iren Seductress" },
      { email: "angelous225_2@chatter.com", name: "@Angelous225 (Iren)", model: "Iren Seductress" },
      { email: "ughdelyo@chatter.com", name: "@ughdeLYO", model: "Veronika Black🍒" },
      { email: "vanya3737@chatter.com", name: "@vanya3737", model: "Veronika Black🍒" },
      { email: "raymondbig@chatter.com", name: "@RaymondBig", model: "Veronika Black🍒" },
      { email: "boss_9874@chatter.com", name: "@Boss_9874", model: "Missy Lux" },
      { email: "hoplopol2@chatter.com", name: "@hoplopol (Missy)", model: "Missy Lux" }
    ]
  }
];

const generated = [];
const defaultPassword = "password123";

async function run() {
  console.log("Starting...");
  try {
    try {
      await signInWithEmailAndPassword(auth, "azun4n@superadmin.com", defaultPassword);
      console.log("Signed in SA");
    } catch(e) {
      try {
        const saCred = await createUserWithEmailAndPassword(auth, "azun4n@superadmin.com", defaultPassword);
        await setDoc(doc(db, "users", saCred.user.uid), {
          id: saCred.user.uid,
          email: "azun4n@superadmin.com",
          name: "@azun4n",
          role: "superadmin"
        });
        console.log("Created SA");
      } catch(ex) { console.log("Failed sa creation", ex.message); }
    }
    
    generated.push({ role: "Superadmin", email: "azun4n@superadmin.com", pass: defaultPassword, name: "@azun4n" });

    // Migrate existing
    const teamIronman = "team_ironman";
    const usersSnap = await getDocs(collection(db, "users"));
    console.log("Migrating users...");
    for (const d of usersSnap.docs) {
      if (!d.data().teamId && d.data().role !== "superadmin" && d.id !== auth.currentUser?.uid) {
        await updateDoc(doc(db, "users", d.id), { teamId: teamIronman });
      }
    }
    const collectionsToMigrate = ["models", "customs", "dayOffs", "bonuses", "guideFolders", "guides", "contests", "roulettes"];
    for (const c of collectionsToMigrate) {
      const snap = await getDocs(collection(db, c));
      for (const d of snap.docs) {
        if (!d.data().teamId) {
          await updateDoc(doc(db, c, d.id), { teamId: teamIronman });
        }
      }
    }
    console.log("Done migration.");
    
    for (const team of teams) {
      console.log("Team", team.id);
      for (const admin of team.admins) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, admin.email, defaultPassword);
          await setDoc(doc(db, "users", cred.user.uid), {
            id: cred.user.uid,
            email: admin.email,
            name: admin.name,
            role: "admin",
            teamId: team.id
          });
          generated.push({ role: "Admin", email: admin.email, pass: defaultPassword, name: admin.name, team: team.id });
        } catch(e) { console.log(admin.email, e.message); }
      }
      
      const createdModels = new Set();
      
      for (const chatter of team.chatters) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, chatter.email, defaultPassword);
          await setDoc(doc(db, "users", cred.user.uid), {
            id: cred.user.uid,
            email: chatter.email,
            name: chatter.name,
            role: "chatter",
            assignedModel: chatter.model,
            teamId: team.id
          });
          
          if (!createdModels.has(chatter.model)) {
            await setDoc(doc(db, "models", chatter.model + "_" + team.id), {
              id: chatter.model + "_" + team.id,
              name: chatter.model,
              teamId: team.id
            });
            createdModels.add(chatter.model);
          }
          
          generated.push({ role: "Chatter", email: chatter.email, pass: defaultPassword, name: chatter.name, model: chatter.model, team: team.id });
        } catch(e) { console.log(chatter.email, e.message); }
      }
    }
    
    fs.writeFileSync('generated_accounts.json', JSON.stringify(generated, null, 2));
    console.log("SUCCESS");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
