const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const target = "  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();";

const injectedCode = `
  const groupedDayOffs = React.useMemo(() => {
    const map = {};
    dayOffs.forEach(d => {
      if (!map[d.date]) map[d.date] = {};
      if (!map[d.date][d.shift]) map[d.date][d.shift] = [];
      map[d.date][d.shift].push(d);
    });
    return map;
  }, [dayOffs]);

  const sortedMonthlyStats = React.useMemo(() => {
    const monthlyStats = dayOffs.reduce((acc, curr) => {
      const d = new Date(curr.date);
      if (d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()) {
        acc[curr.operator] = (acc[curr.operator] || 0) + 1;
      }
      return acc;
    }, {});
    return Object.entries(monthlyStats).sort((a, b) => b[1] - a[1]);
  }, [dayOffs, currentDate]);
`;

code = code.replace(target, injectedCode + "\\n" + target);
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
