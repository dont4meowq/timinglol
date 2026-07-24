const fs = require('fs');
let code = fs.readFileSync('src/components/SchedulePanel.tsx', 'utf8');

const targetStr = `              )
            )}


        </div>
      );
    });`;

const replaceStr = `              )
            )}
          </div>
        </div>
      );
    });`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/SchedulePanel.tsx', code);
