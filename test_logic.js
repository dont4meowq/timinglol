const dayOffs = [{ date: '2026-07-01' }];
const selectedDate = '2026-07-02';
const d1 = new Date(dayOffs[0].date);
const d2 = new Date(selectedDate);
const diff = Math.abs(d2 - d1) / (1000 * 60 * 60 * 24);
console.log(diff);
