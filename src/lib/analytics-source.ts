export type VisitSource = { source: string; sourceKind: "tagged" | "referrer" | "unknown"; referrer: string };
const platforms: Record<string, string> = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", github: "GitHub", google: "Google" };
export const SOURCE_NAMES = Object.values(platforms);
export function resolveVisitSource(search: string, referrer: string, hostname: string): VisitSource {
  let host = "";
  try { host = new URL(referrer).hostname.toLowerCase(); } catch {}
  if (host === hostname || !/^[a-z0-9.-]{1,200}$/.test(host)) host = "";
  const tag = new URLSearchParams(search).get("utm_source")?.toLowerCase();
  if (tag && Object.hasOwn(platforms, tag)) return { source: platforms[tag], sourceKind: "tagged", referrer: host };
  for (const [domain, label] of Object.entries({ "instagram.com": "Instagram", "facebook.com": "Facebook", "linkedin.com": "LinkedIn", "github.com": "GitHub", "google.com": "Google", "google.co.in": "Google" })) {
    if (host === domain || host.endsWith(`.${domain}`)) return { source: label, sourceKind: "referrer", referrer: host };
  }
  return { source: host ? "Other website" : "Direct / unknown", sourceKind: host ? "referrer" : "unknown", referrer: host };
}
export function validSource(value: unknown): value is VisitSource {
  if (!value || typeof value !== "object") return false;
  const v = value as VisitSource;
  return typeof v.referrer === "string" && /^[a-zA-Z0-9.-]{0,200}$/.test(v.referrer)
    && ((v.sourceKind === "tagged" && SOURCE_NAMES.includes(v.source))
      || (v.sourceKind === "referrer" && !!v.referrer && [...SOURCE_NAMES, "Other website"].includes(v.source))
      || (v.sourceKind === "unknown" && v.source === "Direct / unknown" && !v.referrer));
}
