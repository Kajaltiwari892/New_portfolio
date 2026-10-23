import { mkdir, writeFile } from "node:fs/promises";
import { fetchGitHubOverview, GITHUB_USERNAME } from "../src/lib/github.ts";
import { parseContributions } from "./github-contributions.mjs";

// Run `node scripts/update-github-data.mjs` before publishing to refresh the calendar.
// Public GitHub endpoints only; no account token or third-party widget is needed.
const to = new Date().toISOString().slice(0, 10);
const year = Number(to.slice(0, 4));
const overview = await fetchGitHubOverview();
const firstYear = new Date(overview.profile.created_at).getUTCFullYear();
const periods = [
  { id: "current", label: String(year), from: `${year}-01-01`, to },
  { id: "last12months", label: "Last 12 months" },
  ...Array.from({ length: year - firstYear }, (_, index) => {
    const previousYear = year - index - 1;
    return { id: String(previousYear), label: String(previousYear), from: `${previousYear}-01-01`, to: `${previousYear}-12-31` };
  }),
];
const contributionPeriods = await Promise.all(periods.map(async period => {
  const range = period.from ? { from: period.from, to: period.to } : undefined;
  const query = range ? `?from=${range.from}&to=${range.to}` : "";
  const response = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions${query}`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`GitHub calendar returned ${response.status}`);
  return { id: period.id, label: period.label, ...parseContributions(await response.text(), range) };
}));
const contributions = contributionPeriods[0];
// Keep the checked-in fallback small and limited to fields displayed by the portfolio.
const { login, name, public_repos, followers, created_at } = overview.profile;
const repositories = overview.repositories.map(({ id, name, description, html_url, language, stargazers_count, fork, archived, pushed_at }) => ({ id, name, description, html_url, language, stargazers_count, fork, archived, pushed_at }));
await mkdir(new URL("../src/data/", import.meta.url), { recursive: true });
await writeFile(new URL("../src/data/github-snapshot.json", import.meta.url), JSON.stringify({ updatedAt: overview.updatedAt, profile: { login, name, public_repos, followers, created_at }, repositories, starredRepositories: overview.starredRepositories, contributions, contributionPeriods }, null, 2) + "\n");
console.log(`Saved ${repositories.length} repositories. Contributions: ${contributionPeriods.map(period => `${period.label}: ${period.total}`).join(", ")}.`);
