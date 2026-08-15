import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  
  const formatEmail = (str: string) => {
    if (str.includes('@') && str.includes('.') && !str.startsWith('@')) return str;
    return `${str.replace('@', '').toLowerCase()}@nexus.app`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const overrides: Record<string, string> = {
        "@whiskerboss": "whiskerboss.1@nexus.app",
        "@m4f82css": "m4f82css.1@nexus.app",
        "@calmcommerce": "calmcommerce.1@nexus.app",
        "@kiesuuuuu": "kiesuuuuu.1@nexus.app",
        "@iknowhow2r0ll": "iknowhow2r0ll.1@nexus.app",
        "@spiraldown9": "spiraldown9.2@nexus.app",
        "@godproudofyou": "godproudofyou@nexus.app",
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
      const trimmed = login.trim();
      const withAt = trimmed.startsWith('@') ? trimmed : '@' + trimmed;
      const authEmail = overrides[withAt] || formatEmail(trimmed);
      await signInWithEmailAndPassword(auth, authEmail, password);
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4">
      <div className="bg-[#252526] p-8 rounded-xl shadow-2xl border border-neutral-700 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Вход в систему</h1>
        
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Логин</label>
            <input 
              type="text"
              value={login}
              onChange={e => setLogin(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Пароль</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1e1e1e] border border-neutral-700 text-white rounded px-3 py-2 outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors mt-4"
          >Войти</button>
        </form>
        
        
      </div>
    </div>
  );
}
