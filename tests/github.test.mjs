import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fetchGitHubOverview, summarizeRepositories } from "../src/lib/github.ts";
import { parsePortfolioHash, routeHref } from "../src/lib/portfolio-router.ts";
import { parseContributions } from "../scripts/github-contributions.mjs";

const repository = (overrides = {}) => ({ id: 1, name: "example", description: null, html_url: "https://github.com/Kajaltiwari892/example", language: "TypeScript", stargazers_count: 2, fork: false, archived: false, pushed_at: "2026-10-01T12:00:00Z", ...overrides });

test("stats exclude fork stars and languages; recent work excludes archived and profile repos", () => {
  const summary = summarizeRepositories([
    repository(), repository({ id: 2, name: "fork", fork: true, language: "Python", stargazers_count: 99 }),
    repository({ id: 3, name: "old", archived: true, language: "JavaScript", stargazers_count: 1 }),
    repository({ id: 4, name: "Kajaltiwari892", stargazers_count: 0 }),
  ]);
  assert.equal(summary.stars, 3);
  assert.deepEqual(summary.languages, [{ name: "TypeScript", count: 2 }, { name: "JavaScript", count: 1 }]);
  assert.deepEqual(summary.recent.map(repo => repo.name), ["example"]);
});

test("empty repositories produce honest zero counts", () => {
  assert.deepEqual(summarizeRepositories([]), { stars: 0, languages: [], recent: [] });
});

test("GitHub pagination includes repositories beyond the first 100", async () => {
  const paths = [];
  const result = await fetchGitHubOverview(async url => {
    paths.push(url);
    const body = !url.includes("/repos") ? { public_repos: 101, followers: 10 } : url.endsWith("page=1") ? Array.from({ length: 100 }, (_, id) => repository({ id })) : [repository({ id: 101 })];
    return Response.json(body);
  });
  assert.equal(result.repositories.length, 101);
  assert.equal(paths.length, 3);
  assert.match(paths[2], /page=2$/);
});

test("rate limits reject, allowing the page to retain its dated snapshot", async () => {
  await assert.rejects(fetchGitHubOverview(async () => Response.json({ message: "Rate limit exceeded" }, { status: 403 })), /unavailable/);
});

test("malformed responses reject instead of displaying invented values", async () => {
  await assert.rejects(fetchGitHubOverview(async () => Response.json({})), /Invalid GitHub response/);
});

test("calendar snapshot contains continuous real dated cells", async () => {
  const { contributions } = JSON.parse(await readFile(new URL("../src/data/github-snapshot.json", import.meta.url), "utf8"));
  assert.equal(contributions.from.slice(5), "01-01");
  assert.equal(contributions.from.slice(0, 4), contributions.to.slice(0, 4));
  assert.equal(contributions.days.length, (Date.parse(contributions.to) - Date.parse(contributions.from)) / 86400000 + 1);
  assert.equal(contributions.total, contributions.days.reduce((sum, day) => sum + day.count, 0));
  contributions.days.forEach((day, index, days) => {
    assert.ok(Number.isInteger(day.count) && day.count >= 0);
    assert.ok(day.level >= 0 && day.level <= 4);
    if (index) assert.equal(Date.parse(day.date) - Date.parse(days[index - 1].date), 86400000);
  });
  assert.equal(contributions.from, contributions.days[0].date);
  assert.equal(contributions.to, contributions.days.at(-1).date);
});

test("calendar import fails safely when GitHub markup changes", () => {
  assert.throws(() => parseContributions("<html>Temporarily unavailable</html>"), /markup changed/);
});

test("calendar import counts only the requested dates, excluding previous-year and future cells", () => {
  const days = [{ date: "2025-12-31", count: 20 }, { date: "2026-01-01", count: 2 }, { date: "2026-01-02", count: 3 }, { date: "2026-01-03", count: 0 }];
  const html = '<h2 id="js-contribution-activity-description">25 contributions</h2>' + days.map((day, index) => `<td data-date="${day.date}" id="day-${index}" data-level="1"></td><tool-tip for="day-${index}">${day.count} contributions on this date.</tool-tip>`).join("");
  const calendar = parseContributions(html, { from: "2026-01-01", to: "2026-01-02" });
  assert.equal(calendar.total, 5);
  assert.deepEqual(calendar.days.map(day => day.date), ["2026-01-01", "2026-01-02"]);
});

test("GitHub route supports direct links while home section URLs still resolve", () => {
  assert.equal(routeHref("github"), "#/github");
  assert.equal(parsePortfolioHash("#/github"), "github");
  assert.equal(parsePortfolioHash("#github"), "github");
  for (const section of ["home", "about", "work", "contact"]) assert.equal(parsePortfolioHash(routeHref(section)), section);
  assert.equal(parsePortfolioHash("#main", "github"), "github");
});
