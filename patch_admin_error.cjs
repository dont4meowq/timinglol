const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/setError\(err\.message \|\| 'Ошибка создания пользователя'\);/, `
      if (err.code === 'auth/email-already-in-use') {
        setError('Этот логин уже занят. Если вы удаляли пользователя с таким логином ранее, его профиль остался в Firebase Auth. Пожалуйста, используйте другой логин (например, добавьте цифру) или удалите профиль в консоли Firebase.');
      } else {
        setError(err.message || 'Ошибка создания пользователя');
      }
`);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
