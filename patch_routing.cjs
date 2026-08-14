const fs = require('fs');

let mainCode = fs.readFileSync('src/main.tsx', 'utf8');
if (!mainCode.includes('BrowserRouter')) {
  mainCode = mainCode.replace("import App from './App.tsx';", "import App from './App.tsx';\nimport { BrowserRouter } from 'react-router-dom';");
  mainCode = mainCode.replace("<App />", "<BrowserRouter>\n      <App />\n    </BrowserRouter>");
  fs.writeFileSync('src/main.tsx', mainCode);
}

let appCode = fs.readFileSync('src/App.tsx', 'utf8');
if (!appCode.includes('useNavigate')) {
  appCode = "import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';\nimport { useEffect } from 'react';\n" + appCode;
  
  // replace default export component App ()
  const appReplacement = `export default function App() {
  const { loading } = useFirebaseSync();
  const { sidebarOpen, setSidebarOpen, currentUser, appView } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      } else {
        // Logged in
        let teamPath = currentUser.teamId ? currentUser.teamId.replace('team_', '') : 'admin';
        if (currentUser.role === 'superadmin') teamPath = 'superadmin';
        
        if (location.pathname === '/' || location.pathname === '/login') {
          navigate('/' + teamPath, { replace: true });
        } else if (location.pathname !== '/' + teamPath) {
          // If they try to go to another team's URL, force them back to theirs
          navigate('/' + teamPath, { replace: true });
        }
      }
    }
  }, [loading, currentUser, location.pathname, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center p-4 text-white">Загрузка...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/:teamName" element={
        currentUser ? (
          <div className="flex h-screen w-full bg-[#1e1e1e] text-neutral-300 font-sans overflow-hidden">
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <div className={\`flex flex-col fixed inset-y-0 left-0 z-50 transform \${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out\`}>
              <Sidebar />
            </div>
            <div className="flex-1 min-h-0 flex flex-col min-w-0 w-full bg-[#1e1e1e]">
              <div className="md:hidden flex items-center p-4 border-b border-neutral-800 bg-[#1e1e1e]">
                <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-neutral-400">
                  <Menu size={24} />
                </button>
              </div>
              {appView === 'admin' ? (
                <AdminPanel />
              ) : appView === 'schedule' ? (
                <SchedulePanel />
              ) : appView === 'bonuses' ? (
                <BonusesPanel />
              ) : appView === 'roulette' ? (
                <RoulettePanel />
              ) : appView === 'guides' ? (
                <GuidesPanel />
              ) : appView === 'contests' ? (
                <ContestsPanel />
              ) : appView === 'customs' ? (
                <CustomsPanel />
              ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-500">Выберите раздел в меню</div>
              )}
            </div>
          </div>
        ) : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}`;
  
  appCode = appCode.replace(/export default function App\(\) \{[\s\S]*\}\;/g, appReplacement + '\n');
  appCode = appCode.replace(/export default function App\(\) \{[\s\S]*/, appReplacement + '\n'); // in case it missed it
  fs.writeFileSync('src/App.tsx', appCode);
}
console.log('Routing patched.');
