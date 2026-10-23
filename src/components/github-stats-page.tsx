import { useEffect, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Code2, GitCommitHorizontal, Star, Users } from "lucide-react";
import { GitHubIcon } from "@/components/social-icons";
import { getGitHubOverview, summarizeRepositories, type GitHubOverview } from "@/lib/github";
import { routeHref } from "@/lib/portfolio-router";
import snapshot from "@/data/github-snapshot.json";
import { profile } from "@/portfolio-content";

const formatDate = (value: string, month: "short" | "long" = "short") => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month, year: "numeric", timeZone: "UTC" });
const languageColors: Record<string, string> = { JavaScript: "#b69a54", TypeScript: "#667b67", HTML: "#b37559", CSS: "#9181a0", Python: "#66818c" };
const languageColor = (name: string) => languageColors[name] ?? "#8e8170";
const activity = snapshot.contributions;

function ContributionCalendar() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedDay = activity.days.find(day => day.date === selectedDate);
  const activeDays = activity.days.filter(day => day.count > 0).length;
  const bestDay = Math.max(...activity.days.map(day => day.count));
  const weeks = Math.ceil(activity.days.length / 7);
  const months = activity.days.flatMap((day, index) => index % 7 === 0 && (index === 0 || day.date.slice(0, 7) !== activity.days[Math.max(0, index - 7)].date.slice(0, 7)) ? [{ label: new Date(day.date).toLocaleDateString("en", { month: "short", timeZone: "UTC" }), column: Math.floor(index / 7) + 1 }] : []);
  return <section className="github-activity" aria-labelledby="github-activity-heading">
    <div className="github-activity-top"><div><p className="github-eyebrow"><GitCommitHorizontal size={15} />The contribution trail</p><h2 id="github-activity-heading"><strong>{activity.total.toLocaleString()}</strong> contributions</h2><p>{formatDate(activity.from)} — {formatDate(activity.to)}</p></div><span className="github-calendar-period">Past year</span></div>
    <div className="github-calendar-scroll" role="region" aria-label="Contribution calendar. Scroll horizontally on smaller screens." tabIndex={0}>
      <div className="github-calendar" style={{ "--weeks": weeks } as CSSProperties}>
        <div className="github-calendar-months" aria-hidden="true">{months.map(month => <span key={month.column} style={{ gridColumn: month.column }}>{month.label}</span>)}</div>
        <div className="github-calendar-weekdays" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div>
        <div className="github-calendar-cells" role="img" aria-label={`${activity.total} contributions in the displayed period, across ${activeDays} active days. Highest daily count: ${bestDay}. Choose a date below for daily details.`}>
          {activity.days.map(day => <span key={day.date} data-level={day.level} className={selectedDate === day.date ? "is-selected" : undefined} title={`${formatDate(day.date)}: ${day.count} ${day.count === 1 ? "contribution" : "contributions"}`} onClick={() => setSelectedDate(day.date)} />)}
        </div>
      </div>
    </div>
    <p className="github-calendar-hint">Swipe to explore the full year →</p>
    <div className="github-calendar-bottom"><div className="github-day-picker"><label htmlFor="contribution-date">Explore a day</label><input id="contribution-date" type="date" min={activity.from} max={activity.to} value={selectedDate ?? ""} onInput={event => setSelectedDate(event.currentTarget.value)} onChange={event => setSelectedDate(event.target.value)} /></div><div className="github-calendar-legend" aria-label="Darker squares mean more contributions"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <i key={level} data-level={level} />)}<span>More</span></div></div>
    <p className="github-day-detail" role="status">{selectedDay ? `${formatDate(selectedDay.date, "long")} · ${selectedDay.count} ${selectedDay.count === 1 ? "contribution" : "contributions"}` : `${activeDays} active days · ${bestDay} contributions on the busiest day`}</p>
    <div className="github-calendar-source"><span>Calendar snapshot · {formatDate(snapshot.updatedAt)}</span><a href={profile.github!} target="_blank" rel="noreferrer">Latest activity on GitHub <ArrowUpRight size={14} /></a></div>
  </section>;
}

export function GitHubStatsPage() {
  const [overview, setOverview] = useState<GitHubOverview>(snapshot);
  const [status, setStatus] = useState<"updating" | "live" | "snapshot">("updating");
  useEffect(() => {
    let mounted = true;
    getGitHubOverview().then(data => { if (mounted) { setOverview(data); setStatus("live"); } }).catch(() => { if (mounted) setStatus("snapshot"); });
    return () => { mounted = false; };
  }, []);
  const summary = summarizeRepositories(overview.repositories);
  const languageTotal = summary.languages.reduce((sum, language) => sum + language.count, 0);
  const metrics = [
    { label: "Public repositories", value: overview.profile.public_repos, icon: BookOpen },
    { label: "Stars earned", value: summary.stars, icon: Star },
    { label: "Followers", value: overview.profile.followers, icon: Users },
    { label: "Primary languages", value: summary.languages.length, icon: Code2 },
  ];
  return <div id="github" className="github-page">
    <a href={routeHref("home")} className="github-back"><ArrowLeft size={14} />Back to portfolio</a>
    <header className="github-page-heading"><div><p className="github-eyebrow"><GitHubIcon size={16} />GitHub / In the open</p><h1 id="github-heading" tabIndex={-1}>Behind <em>the builds.</em></h1><p>A look at my code, contributions, and what I’m working on.</p></div><a className="github-profile-link" href={profile.github!} target="_blank" rel="noreferrer"><span className="github-profile-mark"><GitHubIcon size={27} /></span><span><strong>@{overview.profile.login}</strong><small>On GitHub since {new Date(overview.profile.created_at).getUTCFullYear()}</small></span><ArrowUpRight size={19} /></a></header>
    <div className="github-stats-meta" role="status"><span className={status === "live" ? "github-status-dot is-live" : "github-status-dot"} />{status === "live" ? `Profile stats updated ${formatDate(overview.updatedAt)}` : status === "updating" ? "Updating profile stats…" : `Saved profile stats · ${formatDate(overview.updatedAt)}`}</div>
    <dl className="github-metrics">{metrics.map(metric => <div className="github-metric" key={metric.label}><dt><metric.icon size={18} /><span>{metric.label}</span></dt><dd>{metric.value.toLocaleString()}</dd></div>)}</dl>
    <ContributionCalendar />
    <div className="github-details-grid">
      <section className="github-languages" aria-labelledby="github-languages-heading"><p className="github-eyebrow">The toolkit</p><h2 id="github-languages-heading">Languages I build with</h2><p className="github-panel-description">By primary language of my own public repositories.</p><div className="github-language-bar" aria-hidden="true">{summary.languages.map(language => <span key={language.name} style={{ flex: language.count, background: languageColor(language.name) }} />)}</div><ul>{summary.languages.map(language => <li key={language.name}><span><i style={{ background: languageColor(language.name) }} />{language.name}</span><span>{language.count} repos <b>{Math.round(language.count / languageTotal * 100)}%</b></span></li>)}</ul>{summary.languages.length === 0 && <p>No primary languages reported yet.</p>}<p className="github-language-note">Forks excluded.</p></section>
      <section className="github-repositories" aria-labelledby="github-repositories-heading"><div className="github-repo-heading"><div><p className="github-eyebrow">On my desk</p><h2 id="github-repositories-heading">Recently updated</h2></div><a href={`${profile.github}?tab=repositories`} target="_blank" rel="noreferrer">All repos <ArrowUpRight size={14} /></a></div><ul>{summary.recent.map(repo => <li key={repo.id}><a href={repo.html_url} target="_blank" rel="noreferrer"><BookOpen size={19} /><span className="github-repo-copy"><strong>{repo.name}</strong><span>{repo.language && <span><i style={{ background: languageColor(repo.language) }} />{repo.language}</span>}<span>Updated {formatDate(repo.pushed_at)}</span></span></span><ArrowUpRight size={17} /></a></li>)}</ul></section>
    </div>
    <div className="github-page-end"><span>There’s always something new to build.</span><a href={routeHref("work")}>Explore selected work <ArrowUpRight size={16} /></a></div>
  </div>;
}
