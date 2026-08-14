const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const statsMemo = `
  const monthlyStats = useMemo(() => {
    return dayOffs.reduce((acc, curr) => {
      const d = new Date(curr.date);
      if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
        acc[curr.operator] = (acc[curr.operator] || 0) + 1;
      }
      return acc;
    }, {});
  }, [dayOffs, currentDate]);

  const sortedMonthlyStats = useMemo(() => {
    return Object.entries(monthlyStats).sort((a, b) => b[1] - a[1]);
  }, [monthlyStats]);
`;

code = code.replace("  const nextMonth = () => {", statsMemo + "\n  const nextMonth = () => {");

code = code.replace(
  /                \{Object\.entries\(dayOffs\.reduce\(\(acc, curr\) => \{\s*const d = new Date\(curr\.date\);\s*if \(d\.getMonth\(\) === currentDate\.getMonth\(\) && d\.getFullYear\(\) === currentDate\.getFullYear\(\)\) \{\s*acc\[curr\.operator\] = \(acc\[curr\.operator\] \|\| 0\) \+ 1;\s*\}\s*return acc;\s*\}, \{\} as Record<string, number>\)\)\s*\.sort\(\(a, b\) => b\[1\] - a\[1\]\)/,
  "                {sortedMonthlyStats"
);

code = code.replace(
  /                  \{dayOffs\.filter\(curr => \{\s*const d = new Date\(curr\.date\);\s*return d\.getMonth\(\) === currentDate\.getMonth\(\) && d\.getFullYear\(\) === currentDate\.getFullYear\(\);\s*\}\)\.length === 0 && \(/,
  "                  {sortedMonthlyStats.length === 0 && ("
);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
