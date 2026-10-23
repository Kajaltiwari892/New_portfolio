/** Parse only the public calendar's dated cells and their matching labels. */
export function parseContributions(html, { from, to } = {}) {
  const totalText = html.match(/id="js-contribution-activity-description"[^>]*>\s*([\d,]+)\s+contributions/);
  const labels = new Map([...html.matchAll(/<tool-tip\b[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g)].map(match => [match[1], match[2]]));
  const days = [...html.matchAll(/<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"[^>]*data-level="([0-4])"[^>]*>/g)].map(([, date, id, level]) => {
    const label = labels.get(id);
    const count = label?.match(/^(No|[\d,]+) contributions? on /)?.[1];
    if (!count) throw new Error(`Missing contribution count for ${date}`);
    return { date, count: count === "No" ? 0 : Number(count.replaceAll(",", "")), level: Number(level) };
  }).filter(day => (!from || day.date >= from) && (!to || day.date <= to)).sort((a, b) => a.date.localeCompare(b.date));
  const expectedDays = from && to ? (Date.parse(to) - Date.parse(from)) / 86400000 + 1 : 365;
  if (!totalText || days.length < expectedDays || new Set(days.map(day => day.date)).size !== days.length || days.some((day, index) => index > 0 && Date.parse(day.date) - Date.parse(days[index - 1].date) !== 86400000)) throw new Error("GitHub calendar markup changed; retain the previous snapshot.");
  // GitHub can include surrounding-year padding and future dates; count only the requested period.
  return { total: days.reduce((sum, day) => sum + day.count, 0), from: days[0].date, to: days.at(-1).date, days };
}
