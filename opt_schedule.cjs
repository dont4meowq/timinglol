const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

if (!code.includes('useMemo')) {
  code = code.replace("import React, { useState } from 'react';", "import React, { useState, useMemo } from 'react';");
}

const memoCode = `
  const groupedDayOffs = useMemo(() => {
    const map = {};
    dayOffs.forEach(d => {
      if (!map[d.date]) map[d.date] = {};
      if (!map[d.date][d.shift]) map[d.date][d.shift] = [];
      map[d.date][d.shift].push(d);
    });
    return map;
  }, [dayOffs]);
`;

code = code.replace("  const getNextAvailableDate = (lastDateStr: string) => {", memoCode + "\n  const getNextAvailableDate = (lastDateStr: string) => {");

code = code.replace(
  "    const shifts = dayOffs.filter(d => d.date === dateStr && d.shift === shift);",
  "    const shifts = groupedDayOffs[dateStr]?.[shift] || [];"
);

fs.writeFileSync('src/components/SchedulePanel.tsx', code);
