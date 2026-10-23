export const EXCLUSION_KEY = "portfolio-analytics-exclude";
let excludedThisPage = false;
export function browserIsExcluded() {
  try { return excludedThisPage || localStorage.getItem(EXCLUSION_KEY) === "true"; } catch { return true; }
}
export function excludeThisBrowser() {
  excludedThisPage = true;
  try { localStorage.setItem(EXCLUSION_KEY, "true"); return true; } catch { return false; }
}
// Runs before React and before any Firebase visitor identity is requested.
export function initializeAnalyticsPreferences() {
  const url = new URL(location.href);
  if (url.searchParams.get("analytics") !== "off") return null;
  const persistent = excludeThisBrowser();
  url.searchParams.delete("analytics");
  history.replaceState(history.state, "", `${url.pathname}${url.search}${url.hash}`);
  return persistent
    ? "Your visits in this browser are excluded from portfolio analytics. You can browse normally."
    : "Tracking is off for this page. Your browser blocked saving this preference; use the exclusion link again next time.";
}
