const fs = require('fs');
let code = fs.readFileSync('src/components/GuidesPanel.tsx', 'utf8');

code = code.replace(
  "const [guideSubFolderId, setGuideSubFolderId] = useState<string>('');",
  `const [guideSubFolderId, setGuideSubFolderId] = useState<string>('');
  
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [subFolderToDelete, setSubFolderToDelete] = useState<{folderId: string, subFolderId: string} | null>(null);`
);

code = code.replace(
  `  const handleDeleteFolder = (folderId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот блок?')) {
      deleteGuideFolder(folderId);
      if (activeFolderId === folderId) {
        setActiveFolderId(null);
        setActiveSubFolderId(null);
      }
    }
  };

  const handleDeleteSubFolder = (folderId: string, subFolderId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот подблок?')) {
      const folder = guideFolders.find(f => f.id === folderId);
      if (folder) {
        updateGuideFolder(folderId, { subFolders: folder.subFolders.filter(s => s.id !== subFolderId) });
        if (activeSubFolderId === subFolderId) {
          setActiveSubFolderId(null);
        }
      }
    }
  };`,
  `  const handleDeleteFolder = (folderId: string) => {
    setFolderToDelete(folderId);
  };

  const handleDeleteSubFolder = (folderId: string, subFolderId: string) => {
    setSubFolderToDelete({ folderId, subFolderId });
  };`
);

const modalCode = `
      {folderToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#252526] rounded-xl shadow-xl border border-neutral-700 w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Подтверждение</h2>
              <p className="text-neutral-300">Вы уверены, что хотите удалить этот блок? Гайды останутся, но без привязки к нему.</p>
            </div>
            <div className="p-4 border-t border-neutral-800 flex justify-end gap-3">
              <button 
                onClick={() => setFolderToDelete(null)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={() => {
                  deleteGuideFolder(folderToDelete);
                  if (activeFolderId === folderToDelete) {
                    setActiveFolderId(null);
                    setActiveSubFolderId(null);
                  }
                  setFolderToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {subFolderToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#252526] rounded-xl shadow-xl border border-neutral-700 w-full max-w-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Подтверждение</h2>
              <p className="text-neutral-300">Вы уверены, что хотите удалить этот подблок?</p>
            </div>
            <div className="p-4 border-t border-neutral-800 flex justify-end gap-3">
              <button 
                onClick={() => setSubFolderToDelete(null)}
                className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={() => {
                  const folder = guideFolders.find(f => f.id === subFolderToDelete.folderId);
                  if (folder) {
                    updateGuideFolder(subFolderToDelete.folderId, { subFolders: folder.subFolders.filter(s => s.id !== subFolderToDelete.subFolderId) });
                    if (activeSubFolderId === subFolderToDelete.subFolderId) {
                      setActiveSubFolderId(null);
                    }
                  }
                  setSubFolderToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

code = code.replace("    </div>\n  );\n}", modalCode);

fs.writeFileSync('src/components/GuidesPanel.tsx', code);
