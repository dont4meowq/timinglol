const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

const map = `
      const overrides: Record<string, string> = {
        "@whiskerboss": "whiskerboss.1@nexus.app",
        "@m4f82css": "m4f82css.1@nexus.app",
        "@calmcommerce": "calmcommerce.1@nexus.app",
        "@kiesuuuuu": "kiesuuuuu.1@nexus.app",
        "@iknowhow2r0ll": "iknowhow2r0ll.1@nexus.app",
        "@spiraldown9": "spiraldown9.1@nexus.app",
        "@dont4meowq": "dont4meowq.1@nexus.app",
        "@espanolespanolespan": "espanolespanolespan.1@nexus.app",
        "@sh1za911": "sh1za911.1@nexus.app",
        "@troublemaker2077": "troublemaker2077.1@nexus.app",
        "@terqq12": "terqq12.1@nexus.app",
        "@giwea1": "giwea1.1@nexus.app",
        "@babydollprincess": "babydollprincess.1@nexus.app",
        "@VS_JARVIS": "vs_jarvis.1@nexus.app",
        "@Loruk2": "loruk2.1@nexus.app",
        "@sleepyforever123": "sleepyforever123.1@nexus.app",
        "@shanxan": "shanxan.2@nexus.app",
        "@katana8899": "katana8899.2@nexus.app",
        "@okayshen": "okayshen.3@nexus.app"
      };
      const authEmail = overrides[login] || formatEmail(login);
`;

code = code.replace(/const authEmail = formatEmail\(login\);/, map.trim());
fs.writeFileSync('src/components/Login.tsx', code);
