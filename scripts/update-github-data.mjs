import { mkdir, writeFile } from "node:fs/promises";
import { fetchGitHubOverview, GITHUB_USERNAME } from "../src/lib/github.ts";
import { parseContributions } from "./github-contributions.mjs";

// Run `node scripts/update-github-data.mjs` before publishing to refresh the calendar.
// Public GitHub endpoints only; no account token or third-party widget is needed.
const to = new Date().toISOString().slice(0, 10);
const from = `${to.slice(0, 4)}-01-01`;
const [overview, response] = await Promise.all([
  fetchGitHubOverview(),
  fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions?from=${from}&to=${to}`, { signal: AbortSignal.timeout(15000) }),
]);
if (!response.ok) throw new Error(`GitHub calendar returned ${response.status}`);
const contributions = parseContributions(await response.text(), { from, to });
// Keep the checked-in fallback small and limited to fields displayed by the portfolio.
const { login, name, public_repos, followers, created_at } = overview.profile;
const repositories = overview.repositories.map(({ id, name, description, html_url, language, stargazers_count, fork, archived, pushed_at }) => ({ id, name, description, html_url, language, stargazers_count, fork, archived, pushed_at }));
await mkdir(new URL("../src/data/", import.meta.url), { recursive: true });
await writeFile(new URL("../src/data/github-snapshot.json", import.meta.url), JSON.stringify({ updatedAt: overview.updatedAt, profile: { login, name, public_repos, followers, created_at }, repositories, contributions }, null, 2) + "\n");
console.log(`Saved ${repositories.length} repositories and ${contributions.days.length} contribution days from GitHub.`);
