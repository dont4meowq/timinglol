const fs = require('fs');
let code1 = fs.readFileSync('src/components/CustomsPanel.tsx', 'utf8');
code1 = code1.replace("import React, { useState, useMemo } from 'react';", "import React, { useState } from 'react';");
fs.writeFileSync('src/components/CustomsPanel.tsx', code1);

let code2 = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');
code2 = code2.replace("import React, { useState, useMemo } from 'react';", "import React, { useState } from 'react';");
fs.writeFileSync('src/components/SchedulePanel.tsx', code2);
