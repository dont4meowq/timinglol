const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("import { SchedulePanel } from './components/SchedulePanel';", "import { SchedulePanel } from './components/SchedulePanel';\nimport { BonusesPanel } from './components/BonusesPanel';");

const target = `      {appView === 'admin' ? (
        <AdminPanel />
      ) : appView === 'schedule' ? (
        <SchedulePanel />
      ) : appView === 'crm' ? (
        <CrmPanel />
      ) : (
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <TabList />
          <Editor />
        </div>
      )}`;

const replacement = `      {appView === 'admin' ? (
        <AdminPanel />
      ) : appView === 'schedule' ? (
        <SchedulePanel />
      ) : appView === 'crm' ? (
        <CrmPanel />
      ) : appView === 'bonuses' ? (
        <BonusesPanel />
      ) : (
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <TabList />
          <Editor />
        </div>
      )}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
