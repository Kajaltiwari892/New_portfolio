export const OWNER_EMAIL = "kanjal55567@gmail.com";
export const EVENT_NAMES = ["page_view", "section_view", "project_view", "project_details_open", "project_link_click", "project_code_click", "resume_open", "social_click", "contact_start", "contact_submit_accepted", "contact_submit_failed"] as const;
export type EventName = typeof EVENT_NAMES[number];
export type PublicPage = "home" | "stats";
export type AnalyticsEvent = { v: 1; id: string; visitorId: string; sessionId: string; pageViewId: string; name: EventName; target: string; page: PublicPage; at: number; device: "mobile" | "tablet" | "desktop"; referrer: string };
export const PROJECT_LABELS: Record<string, string> = { abhyaas: "Abhyaas", resumeiq: "ResumeIQ", aissist: "AIssist", fizzi: "Fizzi" };
export const TARGET_LABELS: Record<string, string> = { ...PROJECT_LABELS, home: "Home", about: "About", work: "Work", contact: "Contact", stats: "GitHub Stats", resume: "Resume", github: "GitHub", linkedin: "LinkedIn" };
export const EVENT_LABELS: Record<EventName, string> = { page_view: "Page opened", section_view: "Section viewed", project_view: "Project viewed", project_details_open: "Details opened", project_link_click: "Website clicked", project_code_click: "Code clicked", resume_open: "Resume opened", social_click: "Social link clicked", contact_start: "Contact started", contact_submit_accepted: "Message accepted", contact_submit_failed: "Message failed" };
export function validTarget(name: EventName, target: string) {
  if (name === "page_view") return ["home", "stats"].includes(target);
  if (name === "section_view") return ["home", "about", "work", "contact", "stats"].includes(target);
  if (name.startsWith("project_")) return Object.hasOwn(PROJECT_LABELS, target);
  if (name === "resume_open") return target === "resume";
  if (name === "social_click") return ["github", "linkedin"].includes(target);
  return name.startsWith("contact_") && target === "contact";
}
export function indiaDay(at: number) { return new Date(at + 330 * 60_000).toISOString().slice(0, 10); }
export function dateBounds(from: string, to: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) throw new Error("Choose valid dates.");
  const start = Date.parse(`${from}T00:00:00+05:30`), end = Date.parse(`${to}T00:00:00+05:30`) + 86400000;
  if (!Number.isFinite(start) || !Number.isFinite(end) || indiaDay(start) !== from || indiaDay(end - 1) !== to || end <= start || end - start > 90 * 86400000) throw new Error("Choose a range of 1–90 days.");
  return { start, end };
}
export function presetRange(days: number, now = Date.now()) { const to = indiaDay(now); const end = Date.parse(`${to}T00:00:00+05:30`); return { from: indiaDay(end - (days - 1) * 86400000), to }; }
export function summarizeAnalytics(input: AnalyticsEvent[], from: string, to: string) {
  const { start, end } = dateBounds(from, to);
  const events = [...new Map(input.filter(e => e.at >= start && e.at < end).map(e => [e.id, e])).values()].sort((a, b) => a.at - b.at);
  const matching = (name: EventName, target?: string) => events.filter(e => e.name === name && (!target || e.target === target));
  const visits = (rows: AnalyticsEvent[]) => new Set(rows.map(e => e.sessionId)).size;
  const pages = matching("page_view");
  const daily = Array.from({ length: Math.round((end - start) / 86400000) }, (_, i) => { const day = indiaDay(start + i * 86400000); const rows = pages.filter(e => indiaDay(e.at) === day); return { day, views: rows.length, visitors: new Set(rows.map(e => e.visitorId)).size }; });
  const distribution = (key: "device" | "referrer") => {
    const groups = new Map<string, Set<string>>();
    for (const e of pages) { const value = e[key] || "Direct / unknown"; if (!groups.has(value)) groups.set(value, new Set()); groups.get(value)!.add(e.sessionId); }
    return [...groups].map(([label, sessions]) => ({ label, count: sessions.size })).sort((a, b) => b.count - a.count);
  };
  const sessions = new Map<string, AnalyticsEvent[]>();
  for (const event of events) { if (!sessions.has(event.sessionId)) sessions.set(event.sessionId, []); sessions.get(event.sessionId)!.push(event); }
  return {
    visitors: new Set(events.map(e => e.visitorId)).size, visits: visits(events), views: pages.length, resume: matching("resume_open").length,
    daily, sections: ["home", "about", "work", "contact", "stats"].map(target => ({ target, count: visits(matching(target === "stats" || target === "home" ? "page_view" : "section_view", target)) })),
    projects: Object.keys(PROJECT_LABELS).map(target => ({ target, viewed: visits(matching("project_view", target)), details: matching("project_details_open", target).length, website: matching("project_link_click", target).length, code: matching("project_code_click", target).length })),
    contact: { started: visits(matching("contact_start")), accepted: matching("contact_submit_accepted").length, failed: matching("contact_submit_failed").length },
    social: { github: matching("social_click", "github").length, linkedin: matching("social_click", "linkedin").length },
    devices: distribution("device"), referrers: distribution("referrer"),
    journeys: [...sessions].sort((a, b) => b[1].at(-1)!.at - a[1].at(-1)!.at).slice(0, 8).map(([id, rows]) => ({ id, at: rows[0].at, device: rows[0].device, events: rows.slice(0, 12), more: Math.max(0, rows.length - 12) })),
  };
}
