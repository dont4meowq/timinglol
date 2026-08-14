const fs = require('fs');

let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// The error is TS2367: This comparison appears to be unintentional because the types '"admin"' and '"superadmin"' have no overlap.
// Let's find where role is checked.
// ah wait, is currentUser typed as User? Yes, and it has 'superadmin'.
// Let's search for "superadmin" in AdminPanel
console.log(code.match(/superadmin/g));
