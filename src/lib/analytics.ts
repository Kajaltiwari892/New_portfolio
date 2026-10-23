import { validTarget, type AnalyticsEvent, type EventName, type PublicPage } from "./analytics-model";
import publicConfig from "@/data/firebase-public-config.json";

// Preserve a previous explicit decline; new visits need no consent interaction.
const LEGACY_CONSENT = "portfolio-analytics-consent";
const SESSION = "portfolio-analytics-session";
let page: PublicPage = "home";
let pageViewId = crypto.randomUUID();
let sessionId = "";
let queue: Omit<AnalyticsEvent, "visitorId">[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;
let busy = false;
let failures = 0;
let storePromise: Promise<typeof import("./analytics-store")> | undefined;
const seen = new Set<string>();
export function analyticsAvailable() {
  return (import.meta.env.VITE_ANALYTICS_ENABLED ?? String(publicConfig.analyticsEnabled)) === "true"
    && String(import.meta.env.VITE_ANALYTICS_HOSTS ?? publicConfig.analyticsHosts.join(",")).split(",").map(s => s.trim()).includes(location.hostname)
    && !["localhost", "127.0.0.1"].includes(location.hostname);
}
export function privacyOptOut() { return navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true; }
function allowed() { try { return analyticsAvailable() && !privacyOptOut() && localStorage.getItem(LEGACY_CONSENT) !== "declined" && localStorage.getItem("portfolio-analytics-exclude") !== "true" && !location.pathname.startsWith("/admin"); } catch { return false; } }
function currentSession() {
  const now = Date.now();
  let saved: { id: string; last: number } | null = null;
  try { saved = JSON.parse(localStorage.getItem(SESSION) ?? "null"); } catch {}
  const id = saved?.id && now - saved.last < 30 * 60_000 ? saved.id : crypto.randomUUID();
  try { localStorage.setItem(SESSION, JSON.stringify({ id, last: now })); } catch {}
  return id;
}
function referrerHost() { try { const host = new URL(document.referrer).hostname; return host === location.hostname ? "" : host.slice(0, 200); } catch { return ""; } }
function enqueue(name: EventName, target: string) {
  queue.push({ v: 1, id: crypto.randomUUID(), sessionId, pageViewId, name, target, page, at: Date.now(), device: innerWidth < 768 ? "mobile" : innerWidth < 1024 ? "tablet" : "desktop", referrer: referrerHost() });
  if (queue.length > 100) queue.shift();
  if (!timer) timer = setTimeout(() => void flush(), 2500);
}
async function flush() {
  timer = undefined;
  if (busy) return;
  if (!allowed()) { queue = []; return; }
  if (!queue.length) return;
  busy = true;
  const batch = queue.splice(0, 20);
  try {
    const store = await (storePromise ??= import("./analytics-store").catch(reason => { storePromise = undefined; throw reason; }));
    if (!allowed()) { queue = []; return; }
    const uid = await store.visitorIdentity();
    if (!allowed()) { queue = []; if (uid) await store.forgetVisitor(); return; }
    if (!uid) return;
    await store.storeEvents(batch.map(event => ({ ...event, visitorId: uid })));
    failures = 0;
  } catch {
    if (++failures <= 3 && allowed()) queue.unshift(...batch.filter(event => Date.now() - event.at < 10 * 60_000));
  } finally {
    busy = false;
    if (queue.length && allowed()) timer = setTimeout(() => void flush(), failures ? 60_000 : 5000);
  }
}
export function trackEvent(name: EventName, target: string, once = false) {
  if (!allowed() || !validTarget(name, target)) return;
  const nextSession = currentSession();
  if (sessionId !== nextSession) {
    sessionId = nextSession; pageViewId = crypto.randomUUID(); seen.clear();
    if (name !== "page_view") enqueue("page_view", page);
  }
  const key = `${name === "contact_start" ? sessionId : pageViewId}:${name}:${target}`;
  if (once && seen.has(key)) return;
  if (once) seen.add(key);
  enqueue(name, target);
}
export function trackPage(next: PublicPage) { page = next; pageViewId = crypto.randomUUID(); trackEvent("page_view", next, true); }
export function flushAnalytics() { if (queue.length) { clearTimeout(timer); timer = undefined; void flush(); } }
