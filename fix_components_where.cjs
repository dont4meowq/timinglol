const fs = require('fs');

let contest = fs.readFileSync('src/components/ContestPost.tsx', 'utf8');
contest = contest.replace(
  "where('contestId', '==', contestId)",
  "where('contestId', '==', contestId || 'UNASSIGNED')"
);
fs.writeFileSync('src/components/ContestPost.tsx', contest);

let guide = fs.readFileSync('src/components/GuidePost.tsx', 'utf8');
guide = guide.replace(
  "where('guideId', '==', guideId)",
  "where('guideId', '==', guideId || 'UNASSIGNED')"
);
fs.writeFileSync('src/components/GuidePost.tsx', guide);

