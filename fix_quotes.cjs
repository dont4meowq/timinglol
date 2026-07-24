const fs = require('fs');
let code = fs.readFileSync('src/components/Login.tsx', 'utf8');

code = code.replace(/>\s*'Вход в систему'\s*<\/h1>/, ">Вход в систему</h1>");
code = code.replace(/>\s*'Войти'\s*<\/button>/, ">Войти</button>");
code = code.replace(/import \{ signInWithEmailAndPassword, createUserWithEmailAndPassword \} from 'firebase\/auth';/, "import { signInWithEmailAndPassword } from 'firebase/auth';");

fs.writeFileSync('src/components/Login.tsx', code);
