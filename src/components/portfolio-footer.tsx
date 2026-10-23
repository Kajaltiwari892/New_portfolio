import { ArrowUp, ArrowUpRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/social-icons";
import { useReducedMotion } from "motion/react";
import { Mark } from "@/components/portfolio-pieces";
import { routeHref } from "@/lib/portfolio-router";
import { profile } from "@/portfolio-content";
import { analyticsAvailable, openAnalyticsPreferences } from "@/lib/analytics";

export function PortfolioFooter() {
  const reducedMotion = useReducedMotion();
  return <footer className="portfolio-footer">
    <div className="footer-inner">
      {analyticsAvailable() && <button className="footer-privacy" type="button" onClick={openAnalyticsPreferences}>Analytics preferences</button>}
      <div className="footer-directory">
        <div className="footer-person">
          <a href={routeHref("home")} className="brand"><Mark /><span>Kajal Tiwari.</span></a>
          <p>A developer’s mind. An artist’s eye.<br />Curious about everything in between.</p>
          <div className="footer-socials">
            {profile.github && <a data-analytics-event="social_click" data-analytics-target="github" href={profile.github} target="_blank" rel="noreferrer" aria-label="Kajal on GitHub"><GitHubIcon size={18} /></a>}
            {profile.linkedin && <a data-analytics-event="social_click" data-analytics-target="linkedin" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="Kajal on LinkedIn"><LinkedInIcon size={18} /></a>}
          </div>
        </div>
        <nav aria-label="Footer explore"><h3>Explore</h3><a href={routeHref("home")}>Home</a><a href={routeHref("about")}>About me</a><a href={routeHref("work")}>What I’ve done</a><a href={routeHref("github")}>GitHub Stats</a></nav>
        <nav aria-label="Footer connect"><h3>Say hello</h3><a href={routeHref("contact")}>Start a conversation <ArrowUpRight size={13} /></a>{profile.github && <a data-analytics-event="social_click" data-analytics-target="github" href={profile.github} target="_blank" rel="noreferrer"><GitHubIcon size={14} />GitHub <ArrowUpRight size={13} /></a>}{profile.linkedin && <a data-analytics-event="social_click" data-analytics-target="linkedin" href={profile.linkedin} target="_blank" rel="noreferrer"><LinkedInIcon size={14} />LinkedIn <ArrowUpRight size={13} /></a>}<span className="footer-note">Always up for a good idea.</span></nav>
      </div>
      <div className="footer-bottomline"><span>© {new Date().getFullYear()} Kajal Tiwari</span><span>Made with care. And a lot of curiosity.</span><button onClick={() => { window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" }); document.querySelector<HTMLElement>(".site-header .brand")?.focus({ preventScroll: true }); }}>Back to top <ArrowUp size={15} /></button></div>
    </div>
  </footer>;
}
