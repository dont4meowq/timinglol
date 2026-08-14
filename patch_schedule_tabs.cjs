const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

// Insert the state
code = code.replace(
  "const [operatorName, setOperatorName] = useState('');", 
  "const [operatorName, setOperatorName] = useState('');\n  const [activeTab, setActiveTab] = useState<'calendar' | 'stats'>('calendar');"
);

// Find the header to add the tab switcher
const headerString = `<div className="flex items-center gap-4">
          <CalendarIcon size={24} className="text-blue-400" />
          <h1 className="text-2xl font-bold text-white uppercase tracking-wider">График выходных</h1>
        </div>`;
const newHeaderString = `<div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <CalendarIcon size={24} className="text-blue-400" />
            <h1 className="text-2xl font-bold text-white uppercase tracking-wider hidden sm:block">График выходных</h1>
          </div>
          
          <div className="flex bg-[#1a1c1d] rounded-lg p-1 border border-neutral-700">
            <button
              onClick={() => setActiveTab('calendar')}
              className={\`px-4 py-1.5 rounded-md text-sm font-medium transition-colors \${activeTab === 'calendar' ? 'bg-[#2a2d2e] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}\`}
            >
              Календарь
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={\`px-4 py-1.5 rounded-md text-sm font-medium transition-colors \${activeTab === 'stats' ? 'bg-[#2a2d2e] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'}\`}
            >
              Статистика
            </button>
          </div>
        </div>`;
        
code = code.replace(headerString, newHeaderString);

// Find where to inject the conditional rendering for activeTab
// The main layout starts with `<div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1e1e1e] pb-10">`
const calStart = `<div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1e1e1e] pb-10">`;
const calEndStatsStart = `{/* Day Offs Statistics */}`;

code = code.replace(calStart, `{activeTab === 'calendar' ? (\n      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1e1e1e] pb-10">`);

code = code.replace(
  calEndStatsStart, 
  `      </div>\n      ) : (\n      {/* Day Offs Statistics */}`
);

// Close the activeTab stats condition
const calEnd = `</div>
        </div>
      </div>
    </div>
  );
}`;
const statsEndRepl = `</div>
        </div>
      </div>
      )}
    </div>
  );
}`;
code = code.replace(calEnd, statsEndRepl);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
console.log('Schedule tabs patched!');
