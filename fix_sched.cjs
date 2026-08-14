const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

// I will extract the whole return block and replace it. Wait, easier to just replace the broken part.
code = code.replace(
  `            </div>\n      ) : (\n      {/* Day Offs Statistics */}`, 
  `            </div>\n      ) : (\n        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#1e1e1e]">`
);

// Remove the `)` at the very end
code = code.replace(
  `      </div>\n      )}\n    </div>\n  );\n}`,
  `        </div>\n      )}\n    </div>\n  );\n}`
);
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
