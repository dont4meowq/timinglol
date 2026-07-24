const fs = require('fs');

// Patch Login
let loginCode = fs.readFileSync('src/components/Login.tsx', 'utf8');

// Remove isRegistering state
loginCode = loginCode.replace(/const \[isRegistering, setIsRegistering\] = useState\(false\); \/\/ Only for creating the first admin\n/, '');

// Remove {isRegistering ? 'Регистрация (Первый Админ)' : 'Вход в систему'}
loginCode = loginCode.replace(/\{isRegistering \? 'Регистрация \(Первый Админ\)' : 'Вход в систему'\}/, "'Вход в систему'");

// Remove if(isRegistering) block
const handleSubmitReplacement = `
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const authEmail = formatEmail(login);
      await signInWithEmailAndPassword(auth, authEmail, password);
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    }
  };
`;
loginCode = loginCode.replace(/const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?\} catch \(err: any\) \{[\s\S]*?\}[\s\S]*?\};/, handleSubmitReplacement.trim());

// Remove button "Зарегистрироваться"
loginCode = loginCode.replace(/\{isRegistering \? 'Зарегистрироваться' : 'Войти'\}/, "'Войти'");

// Remove the toggle block entirely
loginCode = loginCode.replace(/<div className="mt-4 text-center">[\s\S]*?<\/div>/, '');

fs.writeFileSync('src/components/Login.tsx', loginCode);

// Patch AdminPanel
let adminCode = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');
adminCode = adminCode.replace(/console\.error\("Ошибка удаления", err\);/, 'console.error("Ошибка удаления", err);\n        alert("Ошибка удаления: " + err.message);');
fs.writeFileSync('src/components/AdminPanel.tsx', adminCode);

