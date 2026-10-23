export const GITHUB_USERNAME = "Kajaltiwari892";
export type GitHubProfile = { login: string; name: string | null; public_repos: number; followers: number; created_at: string };
export type GitHubRepository = { id: number; name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; fork: boolean; archived: boolean; pushed_at: string };
export type GitHubOverview = { updatedAt: string; profile: GitHubProfile; repositories: GitHubRepository[]; starredRepositories: number };
export type ContributionDay = { date: string; count: number; level: number };

export function summarizeRepositories(repositories: GitHubRepository[]) {
  const owned = repositories.filter(repo => !repo.fork);
  const languages = new Map<string, number>();
  for (const repo of owned) if (repo.language) languages.set(repo.language, (languages.get(repo.language) ?? 0) + 1);
  return {
    stars: owned.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    languages: [...languages].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    recent: owned.filter(repo => !repo.archived && repo.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase()).sort((a, b) => b.pushed_at.localeCompare(a.pushed_at)).slice(0, 4),
  };
}

export async function fetchGitHubOverview(request: typeof fetch = fetch): Promise<GitHubOverview> {
  const signal = AbortSignal.timeout(12000);
  async function read(path: string) {
    const response = await request(`https://api.github.com/users/${GITHUB_USERNAME}${path}`, { headers: { Accept: "application/vnd.github+json" }, signal });
    if (!response.ok) throw new Error("GitHub is unavailable");
    return response.json();
  }
  async function countStarredRepositories() {
    // GitHub's profile “Stars” tab counts repositories this user has starred,
    // not the sum of stargazers on the user's own repositories.
    let count = 0;
    let page = 0;
    let items;
    do {
      items = await read(`/starred?per_page=100&page=${++page}`);
      if (!Array.isArray(items) || items.some(repo => !Number.isInteger(repo.id))) throw new Error("Invalid GitHub starred repositories");
      count += items.length;
    } while (items.length === 100);
    return count;
  }
  const [profile, firstPage, starredRepositories] = await Promise.all([read(""), read("/repos?type=owner&sort=pushed&per_page=100&page=1"), countStarredRepositories()]);
  if (typeof profile.public_repos !== "number" || typeof profile.followers !== "number" || !Array.isArray(firstPage)) throw new Error("Invalid GitHub response");
  const repositories = [...firstPage];
  let page = 1;
  let lastPage = firstPage;
  while (lastPage.length === 100) {
    lastPage = await read(`/repos?type=owner&sort=pushed&per_page=100&page=${++page}`);
    if (!Array.isArray(lastPage)) throw new Error("Invalid GitHub repositories");
    repositories.push(...lastPage);
  }
  if (repositories.some(repo => typeof repo.stargazers_count !== "number" || typeof repo.pushed_at !== "string" || typeof repo.name !== "string")) throw new Error("Incomplete GitHub repositories");
  return { updatedAt: new Date().toISOString(), profile, repositories, starredRepositories };
}

let cached: Promise<GitHubOverview> | undefined;
let cachedAt = 0;
export function getGitHubOverview(forceRefresh = false) {
  if (forceRefresh || !cached || Date.now() - cachedAt > 5 * 60 * 1000) {
    cachedAt = Date.now();
    cached = fetchGitHubOverview().catch(error => { cached = undefined; throw error; });
  }
  return cached;
}
