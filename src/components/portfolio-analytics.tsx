import { useEffect, useState } from "react";
import { BarChart3, X } from "lucide-react";
import { analyticsAvailable, consentChoice, flushAnalytics, privacyOptOut, setAnalyticsConsent, trackEvent, trackPage } from "@/lib/analytics";
import type { EventName, PublicPage } from "@/lib/analytics-model";
import "@/analytics-consent.css";

export function PortfolioAnalytics({ page }: { page: PublicPage }) {
  useEffect(() => {
    // Defer one tick so StrictMode's probe mount cannot emit a duplicate view.
    const start = setTimeout(() => trackPage(page), 0);
    const consent = () => { trackPage(page); observer.disconnect(); observed.clear(); observe(); };
    window.addEventListener("portfolio-consent-change", consent);
    const click = (event: MouseEvent) => {
      const element = (event.target as Element).closest<HTMLElement>("[data-analytics-event]");
      if (element) trackEvent(element.dataset.analyticsEvent as EventName, element.dataset.analyticsTarget ?? "");
    };
    document.addEventListener("click", click);
    const pending = new Map<Element, ReturnType<typeof setTimeout>>();
    const observed = new Set<Element>();
    const exposure = (element: Element) => {
      const r = element.getBoundingClientRect();
      const visible = Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
      return document.visibilityState === "visible" && visible >= Math.min(r.height * .5, innerHeight * .5) && r.width > 0;
    };
    const observer = new IntersectionObserver(entries => {
      for (const { target } of entries) {
        if (pending.has(target)) clearTimeout(pending.get(target));
        pending.delete(target);
        if (exposure(target)) pending.set(target, setTimeout(() => {
          pending.delete(target);
          if (!exposure(target)) return;
          const element = target as HTMLElement;
          if (element.dataset.analyticsProject) trackEvent("project_view", element.dataset.analyticsProject, true);
          else if (element.dataset.analyticsSection) trackEvent("section_view", element.dataset.analyticsSection, true);
        }, 1000));
      }
    }, { threshold: Array.from({ length: 101 }, (_, i) => i / 100) });
    const observe = () => document.querySelectorAll("[data-analytics-section], [data-analytics-project]").forEach(element => { if (!observed.has(element)) { observed.add(element); observer.observe(element); } });
    observe();
    const mutations = new MutationObserver(observe);
    mutations.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });
    const visibility = () => { pending.forEach(clearTimeout); pending.clear(); if (document.visibilityState === "hidden") flushAnalytics(); else { observer.disconnect(); observed.clear(); observe(); } };
    document.addEventListener("visibilitychange", visibility);
    return () => { clearTimeout(start); pending.forEach(clearTimeout); observer.disconnect(); mutations.disconnect(); document.removeEventListener("click", click); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("portfolio-consent-change", consent); };
  }, [page]);
  return <AnalyticsConsent />;
}
function AnalyticsConsent() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (analyticsAvailable() && !consentChoice() && !privacyOptOut()) setOpen(true);
    const show = () => setOpen(true);
    window.addEventListener("portfolio-analytics-preferences", show);
    return () => window.removeEventListener("portfolio-analytics-preferences", show);
  }, []);
  if (!open) return null;
  const choose = (accept: boolean) => { setAnalyticsConsent(accept); setOpen(false); };
  return <aside className="analytics-consent" aria-labelledby="analytics-consent-title"><BarChart3 size={20} /><div><h2 id="analytics-consent-title">Allow usage analytics?</h2><p>Optional stats help me understand which work you explore. Your message and contact details are never recorded.</p>{privacyOptOut() && <p>Your browser’s privacy preference keeps tracking off.</p>}<div className="analytics-consent-actions"><button type="button" onClick={() => choose(false)}>No thanks</button><button type="button" disabled={privacyOptOut() || !analyticsAvailable()} onClick={() => choose(true)}>Allow analytics</button></div></div><button className="analytics-consent-close" type="button" onClick={() => setOpen(false)} aria-label="Close analytics preferences"><X size={16} /></button></aside>;
}
